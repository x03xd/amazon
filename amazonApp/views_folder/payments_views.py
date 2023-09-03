from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import decimal
from amazonApp.models import Product, Transaction, User, Product, CartItem, Cart
import stripe
from datetime import datetime
from amazonApp.serializers import CartItemProductsSerializer
from django.db import transaction

stripe.api_key = settings.STRIPE_SECRET_KEY


class StripeCheckout(APIView):
    def post(self, request, *args, **kwargs):
        try:
            with transaction.atomic():
                list_item = self.core(request)

                checkout_session = stripe.checkout.Session.create(
                    payment_method_types=['card'],
                    line_items=list_item,
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
        

    def core(self, request):
        user_id = request.data.get("user")
        location = request.data.get("location")
        product_id = request.data.get("product_id")
        quantity = request.data.get("quantity")
        
        if location == "cart":
            bought, line_items = self.handle(user_id)

        elif location == "lobby":
            product = Product.objects.get(id=product_id)
            cart = Cart.objects.get(owner__id=user_id)

            CartItem.objects.create(
                cart = cart,
                product = product,
                quantity = quantity,
                total_price = product.price * quantity,
            )
            
            bought, line_items = self.handle(user_id)

        else:
            raise Exception("Given parameter is wrong.") 
                    
        '''Transaction.objects.create(
            bought_by = user,
            bought_products = bought,
            date = datetime.now().date()
        )'''

        return line_items

    def handle(self, user_id):
        print(user_id)
        try:
            cart_items = CartItem.objects.filter(cart__owner__id=user_id)
            serializer = CartItemProductsSerializer(cart_items, many=True)
            bought, line_items = [], []

            print(serializer.data)

            for record in serializer.data:
                product = Product.objects.get(id=record["product"]["id"])

                if product.quantity >= record["quantity"]:
                    bought += [record["product"]["id"]] * record["quantity"]
                    product.quantity -= record["quantity"]

                    data = {
                            'price_data': {
                                'currency': 'pln',
                                'unit_amount': 100,
                                'product_data': {
                                    'name': "Razer",
                                },
                            },
                            'quantity': 3,
                    }
                    line_items.append(data)

                else:
                    return Response("User's input greater than product's quantity")
                        
                product.save()
            cart_items.delete()

            return bought, line_items
        
             
        except (CartItem.DoesNotExist, Product.DoesNotExist):
            return Response({"error": "Object does not exist"}, status=404)    

        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)

