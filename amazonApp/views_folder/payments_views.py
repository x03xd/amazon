from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from amazonApp.models import Product, Transaction, User, Product, CartItem
from datetime import datetime
from amazonApp.serializers import CartItemProductsSerializer, CartItemSerializer, ProductSerializer
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.core.cache import cache
from decimal import Decimal
from django.http import JsonResponse
import stripe

stripe.api_key = settings.STRIPE_SECRET_KEY

class StripeCheckout(APIView):
    def __init__(self):
        super().__init__()
        self.user_id = None
        self.location = None
        self.quantity = None
        self.product_id = None
        self.currency = "EUR"
        self.ratio = 1

    def parse_request_data(self, data):
        self.user_id = data.get("user")
        self.location = data.get("location")
        self.product_id = data.get("product_id", None)
        self.quantity = data.get("quantity", None)
        self.currency = data.get("currency")

        cache_dict = cache.get("exchange_rates")
        if cache_dict:
            self.ratio = cache_dict.get(self.currency)

        self.request.session['user_id'] = self.user_id
        self.request.session['product_id'] = self.product_id
        self.request.session['quantity'] = self.quantity
        self.request.session['location'] = self.location


    def post(self, request, *args, **kwargs):
        try:
            self.parse_request_data(request.data)
            result = self.core()

            checkout_session = self.create_checkout_session(result)

            return Response({'link': checkout_session.url})
                
        except stripe.error.StripeError as e:
            print("Stripe error:", str(e))
            return Response(
                {'error': 'Something went wrong when creating stripe checkout session'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


    def create_checkout_session(self, line_items):
        return stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=line_items,
            metadata={'user_id': self.user_id, 'product_id': self.product_id, 'quantity': self.quantity, 'location': self.location},
            mode='payment',
            success_url=settings.SITE_URL + '/',
            cancel_url=settings.SITE_URL + '/',
        )


    def core(self):
        if self.location == "cart":
            return self.handle_cart()
        
        if self.location == "lobby":
            return self.handle_lobby()
        
        raise Exception("Given parameter is wrong.")


    def handle_cart(self):
        try:
            cart_items = CartItem.objects.filter(cart__owner__id=self.user_id)
            serialized = CartItemProductsSerializer(cart_items, many=True)
            list_item = []

            for record in serialized.data:
                data = self.fill_data(record["product"]["price"], record["product"]["title"], record["quantity"])
                list_item.append(data)

            return list_item
        
        except CartItem.DoesNotExist:
            return Response({"error": "Object does not exist"}, status=404)    

        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)
        
        
    def handle_lobby(self):
        try:
            product = Product.objects.get(id=self.product_id)
            serialized = ProductSerializer(product)
            list_item = []

            data = self.fill_data(serialized.data["price"], serialized.data["title"], self.quantity)
            list_item.append(data)

            return list_item
  
        except Product.DoesNotExist:
            return Response({"error": "Object does not exist"}, status=404)    

        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)


    def fill_data(self, price, title, quantity):
        print(price, self.ratio)
        data = {
            'price_data': {
                'currency': self.currency.lower(),
                'unit_amount': int(Decimal(price) * Decimal(self.ratio)) * 100,
                'product_data': {
                    'name': title,
                },
            },
            'quantity': quantity,
        }
        return data
    

@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META['HTTP_STRIPE_SIGNATURE']
    event = None

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_ENDPOINT_SECRET
        )
    except ValueError as e:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    except stripe.error.SignatureVerificationError as e:
        return HttpResponse(status=status.HTTP_400_BAD_REQUEST)

    if event['type'] == 'checkout.session.completed':
        handle_checkout_session_completed(event)

    elif event["type"] == "payment_intent.succeeded":
        print("Succeeded")

    return HttpResponse(status=200)



def handle_checkout_session_completed(event):
    intent = event.data.object
    user_id = intent.metadata.get('user_id', None)  
    product_id = intent.metadata.get('product_id', None)  
    quantity = intent.metadata.get('quantity', None)
    location = intent.metadata.get('location', None)

    user_id = int(user_id)
    product_id = int(product_id) if product_id else None
    quantity = int(quantity) if quantity else None
    bought = []
    
    try:
        user = User.objects.get(id=user_id)

        if location == "lobby":
            product = Product.objects.get(id=product_id)

            if product.quantity >= quantity:
                bought.extend([product.id] * quantity)
                product.quantity -= quantity
                product.save()

        elif location == "cart":
            cart_items = CartItem.objects.filter(cart__owner=user)
            serializer = CartItemSerializer(cart_items, many=True)

            for record in serializer.data:
                product = Product.objects.get(id=record["product"])

                if product.quantity >= record["quantity"]:
                    bought.extend([record["product"]] * record["quantity"])
                else:
                    return
                
            for record in serializer.data:
                product = Product.objects.get(id=record["product"])
                product.quantity -= record["quantity"]
                product.save()

            cart_items.delete()

        Transaction.objects.create(
            bought_by=user,
            bought_products=bought,
            date=datetime.now().date()
        )

    except:
        return Exception("Failed")



