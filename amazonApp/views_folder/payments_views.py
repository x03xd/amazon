from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import decimal
from amazonApp.models import Product, Transaction, User, Product, CartItem
import stripe
from datetime import datetime
from amazonApp.serializers import CartItemProductsSerializer, CartItemSerializer, ProductSerializer
from django.views.decorators.csrf import csrf_exempt
stripe.api_key = settings.STRIPE_SECRET_KEY
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.core.cache import cache


class StripeCheckout(APIView):

    def __init__(self):
        self.user_id = None
        self.location = None
        self.currency = None
        self.quantity = None
        self.product_id = None
        self.ratio = 1

    def post(self, request, *args, **kwargs):
        try:
            self.user_id = request.data.get("user")
            self.location = request.data.get("location")
            self.location = request.data.get("location")
            self.product_id = request.data.get("product_id")
            self.quantity = request.data.get("quantity")
            self.currency = request.data.get("currency")

            self.request.session['user_id'] = self.user_id

            cache_dict = cache.get("exchange_rates")
            self.ratio = cache_dict[self.currency] if cache_dict else 1

            result = self.core()

            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=result,
                metadata={'user_id': self.user_id, 'location': self.location},
                mode='payment',
                success_url=settings.SITE_URL + '/',
                cancel_url=settings.SITE_URL + '/',
            )

            return Response({'link': checkout_session.url})
                
        except stripe.error.StripeError as e:
            print("Stripe error:", str(e))
            return Response(
                {'error': 'Something went wrong when creating stripe checkout session'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        

    def core(self):

        if self.location == "cart":
            list_item = self.handle_cart()

        elif self.location == "lobby":
            list_item = self.handle_lobby()

        else:
            raise Exception("Given parameter is wrong.")
            
        return list_item

        
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
        data = {
            'price_data': {
                'currency': self.currency.lower(),
                'unit_amount': int(decimal.Decimal(price) * decimal.Decimal(self.ratio)) * 100,
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
        intent = event.data.object
        user_id = intent.metadata.get('user_id', None)  
        location = intent.metadata.get('location', None)  

        if user_id:
            try:
                user = User.objects.get(id=user_id)
                cart_items = CartItem.objects.filter(cart__owner=user)
                serializer = CartItemSerializer(cart_items, many=True)
                bought = []

                for record in serializer.data:
                    product = Product.objects.get(id=record["product"])

                    if product.quantity >= record["quantity"]:
                        bought += [record["product"]] * record["quantity"]
                    else:
                        return Response("User's input greater than product's quantity")
                    
                for record in serializer.data:
                    product = Product.objects.get(id=record["product"])
                    product.quantity -= record["quantity"]
                    product.save()

                cart_items.delete()

                Transaction.objects.create(
                    bought_by = user,
                    bought_products = bought,
                    date = datetime.now().date()
                )

            except Exception as e:
                return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)
            
        print("Checkout completed", user_id)
    
    elif event["type"] == "payment_intent.succeeded":
        print("Succeeded")

    return HttpResponse(status=200)
