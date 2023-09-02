from amazonApp.models import Product, User, Transaction, CartItem, Cart
from amazonApp.serializers import ProductSerializer, TransactionSerializer, CartItemSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from datetime import datetime
from rest_framework.response import Response
from rest_framework.generics import ListAPIView

class FinalizeOrder(APIView):

    def handle_lobby(self, product_id, quantity):
        try:
            bought = product_id * int(quantity)
            product = Product.objects.get(id=product_id[0])

            if product.quantity >= int(quantity):
                product.quantity -= int(quantity)
                product.save()

                return bought
            
            else:
                return Response("User's input greater than product's quantity")
                    
        except Cart.DoesNotExist:
            return Response({"error": "Object does not exist"}, status=404)    

        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)


    def handle_cart(self, user):
        try:
            cart_items = CartItem.objects.filter(cart__owner=user)
            serializer = CartItemSerializer(cart_items, many=True)
            bought = []

            for record in serializer.data:
                product = Product.objects.get(id=record["product"])

                if product.quantity >= record["quantity"]:
                    bought += [record["product"]] * record["quantity"]
                    product.quantity -= record["quantity"]
                else:
                    return Response("User's input greater than product's quantity")
                        
                product.save()
                        
            cart_items.delete()
            return bought

             
        except (CartItem.DoesNotExist, Product.DoesNotExist):
            return Response({"error": "Object does not exist"}, status=404)    

        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)


    def post(self, request):
        try:
            user = request.data.get("user")
            location = request.data.get("location")
            product_id = request.data.get("product_id")
            quantity = request.data.get("quantity")

            try:
                user = User.objects.get(id = user)
                
            except User.DoesNotExist:
                return Response("Object does not exist", status=404) 

            if location == "cart":
                bought = self.handle_cart(user)
    
            elif location == "lobby":
                bought = self.handle_lobby(product_id, quantity)

            else:
                raise Exception("Given paramteter is wrong.") 
                
            Transaction.objects.create(
                bought_by = user,
                bought_products = bought,
                date = datetime.now().date()
            )

            return Response({"status": True})
                

        except Cart.DoesNotExist:
            return Response({"error": "Object does not exist"}, status=404)    

        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)
        
from django.core.cache import cache
class TransactionsAPI(ListAPIView):
    serializer_class = TransactionSerializer

    def get_queryset(self, request):
        queryset = Transaction.objects.filter(bought_by__id=self.kwargs.get("id"))
        return queryset


    
class ProductsFromTransactions(APIView):

    def adding_products(self, end, table):
        counter, lst_f = 0, []

        for (index, date), count in table.items():
            product = Product.objects.get(id=index)
            serializer = ProductSerializer(product)
            lst_f.append((count, serializer.data, date))
            counter += 1
                
            if counter == end:
                break

        return lst_f


    def post(self, request):
        table = {}

        try:
            pages = request.data.get("pages")
            lst = request.data.get("lst")
            
            flattened_lst = [[item, sublist["date"]] for sublist in lst for item in sublist["bought_products"]]
            _, end = pages, pages + 5

            for index, date in flattened_lst:
                table[(index, date)] = table.get((index, date), 0) + 1

            lst_result = self.adding_products(end, table)

            return Response(lst_result)

        except Product.DoesNotExist:
            return Response({"error": "Object does not exist"}, status=404)
        
        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)
        