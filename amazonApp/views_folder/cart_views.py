from amazonApp.models import Product,  User, CartItem, Cart
from amazonApp.serializers import ProductSerializer, CartItemSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import  Sum
from decimal import Decimal
from rest_framework.response import Response
from .views import provide_currency_context


class CartAPI(APIView):

    def adding_product_by_id(self, cart_item_serializer):
        product_data_list = []

        for cart_item in cart_item_serializer:
            try:
                prod = Product.objects.get(id=cart_item["product"])

                p_serializer = ProductSerializer(prod)
                cart_item["product_data"] = p_serializer.data
                product_data_list.append(cart_item)

            except Product.DoesNotExist as e:
                return Response({"error": "Error message", "detail": str(e)}, status=404)
        
        return product_data_list
                
        
    def get(self, request, *args, **kwargs):
        try:
            user_id = self.kwargs.get("user_id")
            currency_context = provide_currency_context(user_id)

            cart = CartItem.objects.filter(cart__owner__id = user_id).order_by('product__title')
            serializer = CartItemSerializer(cart, many=True, context=currency_context)
            serializer_id = list(map(lambda item: item['product'], CartItemSerializer(cart, many=True).data))

            prod_data = self.adding_product_by_id(serializer.data)

            if currency_context["user_preferred_currency"] is None:
                currency_context["user_preferred_currency"] = 1

            sum_ = cart.aggregate(total_price_sum=Sum('total_price'))
            sum_r = round(sum_['total_price_sum'] * Decimal(currency_context["user_preferred_currency"]), 2)

            return Response({"cart_items": prod_data, "sum": sum_r, "serialized_id": serializer_id})
        

        except (CartItem.DoesNotExist, User.DoesNotExist) as e:
            return Response({"error": "Error message", "detail": str(e)}, status=404)

        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)
        


    def patch(self, request, *args, **kwargs):
        try:
            product_id = request.data.get("product_id")
            quantity = request.data.get("quantity")

            user_id = self.kwargs.get("user_id")

            product = Product.objects.get(id=product_id)
            cart = CartItem.objects.get(cart__owner__id = user_id, product = product)
            
            if product.quantity < quantity:
                raise ValueError("Quantity exceeds available stock")

            new_total_price = (cart.total_price * quantity) / cart.quantity

            cart.quantity = quantity
            cart.total_price = new_total_price

            cart.save()
   
            return Response(product_id)
        
        except (CartItem.DoesNotExist, Product.DoesNotExist) as e:
            return Response({"error": "Error message", "detail": str(e)}, status=404)
        
        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)


class ProcessAPI(APIView):

    @staticmethod
    def validate_conditions(quantity, product_quantity, total_quantity):
        
        if quantity > product_quantity:
            return Response("Quantity exceeds available stock")

        if not (1 <= quantity <= 10):
            return Response("Quantity is not in range 1-10")

        if isinstance(total_quantity, int) and total_quantity + quantity > 10:
            return Response("Maximum quantity of single item exceeded")

    
    def post(self, request):
        try:
            product_id = request.data.get("product_id")
            user_id = request.data.get("user_id")
            quantity = int(request.data.get("quantity", 0))

            try:
                user = User.objects.get(id=user_id)
                product = Product.objects.get(id=product_id) 

            except (User.DoesNotExist, Product.DoesNotExist) as e:
                return Response({"error": "Object does not exist"}, status=404)    
            
            total_quantity = CartItem.objects.filter(cart__owner=user).aggregate(Sum('quantity'))['quantity__sum']
            
            ProcessAPI.validate_conditions(quantity, product.quantity, total_quantity)

            try:
                cart = Cart.objects.get(owner__id=user_id)  

            except Cart.DoesNotExist:
                return Response({"error": "Object does not exist"}, status=404)     

            try:
                obj = CartItem.objects.get(cart=cart, product=product)
                obj.quantity += quantity
                obj.total_price += Decimal(product.price) * quantity
                obj.save()

            except CartItem.DoesNotExist:
                obj = CartItem.objects.create(
                    cart = cart,
                    product = product,
                    quantity = quantity,
                    total_price = float(product.price) * quantity
                )

            return Response({"status": True})

        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)
        
        
class RemoveItemCart(APIView):

    def post(self, request):
        try:
            user_id = request.data.get("user_id")
            item_id = request.data.get("item_id")

            cart = CartItem.objects.get(cart__owner__id=user_id, product__id=item_id)
            cart.delete()

            return Response({"done": True, "product_id": item_id})

        except CartItem.DoesNotExist as e:
            return Response({"error": "Error message", "detail": str(e)}, status=404)

        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)