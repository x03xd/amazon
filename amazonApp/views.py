from rest_framework import generics, status
from .models import Product, Category, Rate, User, Transaction, CartItem, Brand, Cart
from .serializers import ProductSerializer, CategorySerializer, RateSerializer, TransactionSerializer, CartItemSerializer, GetterRateSerializer, BrandsByCategoriesSerializer, BrandsByIdSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http.response import JsonResponse
from rest_framework.generics import ListAPIView
from django.db.models import Avg, Sum
from datetime import datetime, timedelta, date
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.password_validation import validate_password
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from rest_framework import serializers
from django.contrib.auth.hashers import make_password, check_password
from decimal import Decimal
from django.contrib.auth.models import update_last_login
import re
from django.http import JsonResponse
import requests
from django.core.cache import cache
import threading
import time

def update_exchange_rates():
    while True:
        API_URL = "http://data.fixer.io/api/latest"
        API_KEY = '3f1d8c17a80596d5a89ba0001f8fa2a5'

        params = {
            "access_key": API_KEY,
            "symbols": "EUR, USD, PLN, GBP"
        }

        response = requests.get(API_URL, params=params)

        if response.status_code == 200:
            data = response.json()
            cache.set("exchange_rates", data["rates"], timeout=36000)

        else:
            return Response({"error": "Currency exchanging does not work properly."})

        time.sleep(3600)  


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username
        token['email'] = user.email
        token['currency'] = user.currency

        return token
    

    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user

        if user:
            update_last_login(None, user)
     
        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class CurrencyConverterAPI(APIView):
    def patch(self, request, *args, **kwargs):

        try:
            currency = request.data.get("currency")
            user = User.objects.get(id = self.kwargs.get("id"))
            user.currency = currency 
            user.save()

            return Response({"currency": currency})

        except User.DoesNotExist:
            return Response({"error": "Error message", "detail": str(e)}, status=404)

        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)
        
    
        


class CartAPI(APIView):

    def post(self, request):

        try:
            username = request.data.get("username")

            cart = CartItem.objects.filter(cart__owner__username = username).order_by('product__title')
            serializer = CartItemSerializer(cart, many=True)
            
            for cart_item in serializer.data:
                try:
                    prod = Product.objects.get(id=cart_item["product"])
                    p_serializer = ProductSerializer(prod)
                    cart_item["product_data"] = p_serializer.data

                except Product.DoesNotExist:
                    return Response({"error": "Error message", "detail": str(e)}, status=404)

            sum_ = cart.aggregate(total_price_sum=Sum('total_price'))
        
            return Response({"cart_items": serializer.data, "sum": sum_['total_price_sum']})

        except CartItem.DoesNotExist:
            return Response({"error": "Error message", "detail": str(e)}, status=404)

        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)
        

    def patch(self, request, *args, **kwargs):

        try:
            product_id = request.data.get("product_id")
            user_id = request.data.get("user_id")
            quantity = request.data.get("quantity")

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

    def post(self, request):

        try:
            product_id = request.data.get("product_id")
            user_id = request.data.get("user_id")
            quantity = int(request.data.get("quantity", 0))

            try:
                user = User.objects.get(id=user_id)
                product = Product.objects.get(id=product_id) 

            except (User.DoesNotExist, Product.DoesNotExist) as e:
                return Response({"error": "Error message", "detail": str(e)}, status=404)
            
            if quantity > product.quantity:
                return Response("Quantity exceeds available stock")

            if 10 > quantity < 1:
                return Response("Quantity is not in range 1-10")

            total_quantity = CartItem.objects.filter(cart__owner=user).aggregate(Sum('quantity'))['quantity__sum']

            if isinstance(total_quantity, int) and total_quantity + quantity > 10:
                return Response("Maximum quantity of single item exceeded")

            try:
                cart = Cart.objects.get(owner__id=user_id)  

            except Cart.DoesNotExist:
                return Response("Object does not exist", status=404)    

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
            username = request.data.get("username")
            item_id = request.data.get("item_id")

            cart = CartItem.objects.get(cart__owner__id = username, product__id = item_id)
            cart.delete()

            return JsonResponse({"done": True, "product_id": item_id})


        except Product.DoesNotExistc as e:
            return Response({"error": "Error message", "detail": str(e)}, status=404)

        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)




class CategoriesAPI(ListAPIView):
    serializer_class = CategorySerializer

    def get_queryset(self):
        try:
            queryset = Category.objects.all()
            return queryset

        except Category.DoesNotExist:
            return Response({'authenticated': False, "error": "Object does not exist"}, status=404)

        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)
        


class LoginAPI(APIView):
    def post(self, request):
        
        try:
            username = request.data.get("username")

            user_object = User.objects.get(username=username)
            return JsonResponse({'authenticated': True, 'email': user_object.email, 'username': username})
        
        except User.DoesNotExist as e:
            return Response({"error": "Error message", "detail": str(e)}, status=404)
        
        except Exception as e:
            return Response({'authenticated': False, "error": "Internal Server Error", "detail": str(e)}, status=500)



class LogoutView(APIView):
    def get(self, request, format = None):
        pass



class UserRegistrationSerializer(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    def validate(self, data):
        password = data.get('password')
        password2 = data.get('password2')
        email = data.get('email')
        username = data.get('username')

        if password != password2:
            raise Exception("Passwords do not match.")

        if not re.match(r'^[a-zA-Z]*$', username):
            raise Exception("Username should contain only letters.")
        
        if User.objects.filter(username=username).exists():
            raise Exception("A username with that username already exists")
        
        validate_email(email)

        if User.objects.filter(email=email).exists():
            raise Exception("A username with that email already exists")
        
        if User.objects.filter(email=email, username=username).exists():
            raise Exception("A username with that username and email already exists")
        
        validate_password(password)

        return data

    def create(self, validated_data):
        password = validated_data.pop('password')
        validated_data.pop('password2')

        hashed_password = make_password(password)
        user = User.objects.create(password=hashed_password, **validated_data)
        return user
    

class RegisterSystem(APIView):
    def post(self, request, *args, **kwargs):
        try:
            serializer = UserRegistrationSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({"status": True}, status=status.HTTP_201_CREATED)
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


        except serializers.ValidationError as e:  
            return Response({"error": "Password is too weak", "detail": e.messages}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": "An error occurred during user registration", "detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class ProductsBySubsAPI(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        q = self.request.query_params.get('q')

        try:
            if q is not None:
                queryset = Product.objects.filter(category_name__name=q)
                return queryset
            else:
                raise ValueError("Parameter 'q' is missing.")
            
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)



class CountAvgRate(generics.ListAPIView):
    serializer_class = RateSerializer

    def get_queryset(self):
        try:
            return Rate.objects.values("rated_products").annotate(average_rate=Avg("rate"))

        except Rate.DoesNotExist:
            return Response({"error": "Object does not exist"}, status=404)


class ProductsAPI(APIView):

    def get(self, request):
    
        r = self.request.query_params.get('rating')
        q = self.request.query_params.get('q')
        c = self.request.query_params.get('c')
        u = self.request.query_params.get('u')
        
        lst = []

        if r is not None:
            try:
                rates = Rate.objects.values("rated_products").annotate(average_rate=Avg("rate")).filter(average_rate__gte=r)
                serializer = RateSerializer(rates, many = True)

                for rate in rates:
                    lst.append(rate["rated_products"])

            except Rate.DoesNotExist:
                return Response({"error": "Object does not exist"}, status=404)


        if c is not None:
            multiple_brands_filter = c.split(",")

        if u is not None:
            multiple_prices_filter = u.split(",")
            first_lst, second_lst = [], []

            for index, s in enumerate(multiple_prices_filter):
                first, second = s.split('-')

                first = float(first)
                second = float(second)

                if first > 0 and second > 0:
                    first_lst.append(first)
                    second_lst.append(second)

        try:
            queryset = Product.objects.all()

        except Product.DoesNotExist:
            return Response({"error": "Object does not exist"}, status=404)

  
        if q is None:

            if (c is not None) and (u is not None) and (r is not None):
                queryset = queryset.filter(id__in = lst, brand__brand_name__in = multiple_brands_filter, price__range=(first_lst[0], second_lst[-1]))

            if (c is not None) and (u is not None) and (r is None):
                queryset = queryset.filter(brand__brand_name__in = multiple_brands_filter, price__range=(first_lst[0], second_lst[-1]))

            if (c is not None) and (u is None) and (r is not None):
                queryset = queryset.filter(id__in = lst, brand__brand_name__in = multiple_brands_filter)

            if (c is None) and (u is not None) and (r is not None):
                queryset = queryset.filter(id__in = lst, price__range=(first_lst[0], second_lst[-1]))
            
            if (c is None) and (u is None) and (r is not None):
                queryset = queryset.filter(id__in = lst)

            if (c is not None) and (u is None) and (r is None):
                queryset = queryset.filter(brand__brand_name__in = multiple_brands_filter)

            if (c is None) and (u is not None) and (r is None):
                queryset = queryset.filter(price__range=(first_lst[0], second_lst[-1]))

        
        else:

            if (c is not None) and (u is not None) and (r is not None):
                queryset = queryset.filter(category_name__name__icontains=q, id__in = lst, brand__brand_name__in = multiple_brands_filter, price__range=(first_lst[0], second_lst[-1]))

            if (c is not None) and (u is not None) and (r is None):
                queryset = queryset.filter(category_name__name__icontains=q, brand__brand_name__in = multiple_brands_filter, price__range=(first_lst[0], second_lst[-1]))

            if (c is not None) and (u is None) and (r is not None):
                queryset = queryset.filter(category_name__name__icontains=q, id__in = lst, brand__brand_name__in = multiple_brands_filter)

            if (c is None) and (u is not None) and (r is not None):
                queryset = queryset.filter(category_name__name__icontains=q, id__in = lst, price__range=(first_lst[0], second_lst[-1]))
            
            if (c is None) and (u is None) and (r is not None):
                queryset = queryset.filter(category_name__name__icontains=q, id__in = lst)

            if (c is not None) and (u is None) and (r is None):
                queryset = queryset.filter(category_name__name__icontains=q, brand__brand_name__in = multiple_brands_filter)

            if (c is None) and (u is not None) and (r is None):
                queryset = queryset.filter(category_name__name__icontains=q, price__range=(first_lst[0], second_lst[-1]))

            if (c is None) and (u is None) and (r is None):
                queryset = queryset.filter(category_name__name__icontains=q)
   
   
        serializer = ProductSerializer(queryset, many=True)

        return Response(serializer.data)
 


    def post(self, request):
                
        try:
            lst = request.data.get("lst")
            products = []

            for product, quantity in lst:
                instance = Product.objects.get(id=product)
                products.append(instance)

            serializer = ProductSerializer(products, many=True)

            return Response({"products": serializer.data})

        except Product.DoesNotExist:
            return Response({"error": "Object does not exist"}, status=404)

        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)
   


class AccessToChangeStatus(APIView):
        
    def get(self, request, *args, **kwargs):
        today_date = date.today()

        try:
            user = User.objects.get(id = self.kwargs.get("id"))

            if user.username_change_allowed >= today_date:
                status_username = False

            elif user.username_change_allowed < today_date:
                status_username = True


            if user.email_change_allowed >= today_date:
                status_email = False

            elif user.email_change_allowed < today_date:
                status_email = True


            if user.password_change_allowed >= today_date:
                status_password = False

            elif user.password_change_allowed < today_date:
                status_password = True

            return Response({
                                    "username": [status_username, user.username_change_allowed],
                                    "email": [status_email, user.email_change_allowed],
                                    "password": [status_password, user.password_change_allowed]
                                })


        except User.DoesNotExist:
            return Response({"error": "Object does not exist"}, status=404)

        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)



class EditUsername(APIView):
    
    def patch(self, request, **kwargs):

        try:
            change = request.data.get("change")

            user = User.objects.get(id = self.kwargs.get("id"))
            today_date = date.today()

            if user.username_change_allowed >= today_date:
                return Response({"error": f"You cannot change username till {user.username_change_allowed}"})
            
            if not re.match(r'^[a-zA-Z]+$', change):
                return Response({"error": "Username should contain only letters."})

            if User.objects.filter(username=change).exists():
                return Response({"error": "User with passed username already exists"})
            
            user.username = change

            new_date = date.today() + timedelta(days=30) 
            user.username_change_allowed = new_date

            user.save()

            return Response({"status": True})

        except User.DoesNotExist as e:
            return Response({"error": "Error message", "detail": str(e)}, status=404)

        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)



class EditEmail(APIView):

    def patch(self, request, **kwargs):

        try:
            change = request.data.get("change")

            user = User.objects.get(id = self.kwargs.get("id"))
            today_date = date.today()

            if user.email_change_allowed >= today_date:
                return Response({"error": f"You cannot change email till {user.email_change_allowed}"})
            
            validate_email(change)

            if User.objects.filter(email=change).exists():
                return Response({"error": "User with passed email already exists"})
            
            user.email = change

            new_date = date.today() + timedelta(days=30) 
            user.email_change_allowed = new_date

            user.save()

            return Response({"status": True})

        except User.DoesNotExist as e:
            return Response({"error": "Error message", "detail": str(e)}, status=404)

        except ValidationError as e:
            return Response({"error": "Email format is not correct", "detail": e.messages}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response({"error": "An error occurred during user registration", "detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


        


class FinalizeOrder(APIView):

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
 
    
            elif location == "lobby":

                bought = product_id * int(quantity)
                product = Product.objects.get(id=product_id[0])

                if product.quantity >= int(quantity):
                    product.quantity -= int(quantity)
                    product.save()

                else:
                    return Response("User's input greater than product's quantity")


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
        
        
            


class TransactionsAPI(ListAPIView):
    serializer_class = TransactionSerializer

    def get_queryset(self):
      
        try:
            queryset = Transaction.objects.filter(bought_by__id = self.kwargs.get("id"))
            return queryset

        except Transaction.DoesNotExist:
            return Response({'authenticated': False, "error": "Object does not exist"}, status=404)
        
        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)
        
    
class ProductsFromTransactions(APIView):

    def post(self, request):
        table, lst_f = {}, []

        try:

            pages = request.data.get("pages")
            lst = request.data.get("lst")

            start, end = pages, pages + 5

            flattened_lst = [[item, sublist["date"]] for sublist in lst for item in sublist["bought_products"]]

            for index, date in flattened_lst:
                table[(index, date)] = table.get((index, date), 0) + 1

            counter = 0
            for (index, date), count in table.items():
                product = Product.objects.get(id=index)
                serializer = ProductSerializer(product)
                lst_f.append((count, serializer.data, date))
                counter += 1

                if counter == end:
                    break

            return Response(lst_f)

        except Product.DoesNotExist:
            return Response({"error": "Object does not exist"}, status=404)
        
        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)
        

class RateProduct(APIView):

    def get(self, request, **kwargs):

        try:
            rate_of_product = Rate.objects.get(rated_by__id = self.kwargs.get("id"), rated_products__id = self.kwargs.get("pid"))
            serializer = GetterRateSerializer(rate_of_product)

            return Response(serializer.data["rate"])

        except Rate.DoesNotExist:
            return JsonResponse({"error": "Object does not exist"}, status=404)
        
        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)


    
    def patch(self, request, **kwargs):
        created = False

        try:
            try:
                user = User.objects.get(id = self.kwargs.get("id"))

            except User.DoesNotExist:
                return Response({"error": "Object does not exist"}, status=404)
            
            try:
                product = Product.objects.get(id = self.kwargs.get("pid"))
            
            except Product.DoesNotExist:
                return Response({"error": "Object does not exist"}, status=404)
            
            rate_of_user, created = Rate.objects.get_or_create(
                rated_by = user,
                rated_products = product,
                defaults={'rate': self.kwargs.get("rate")}
            )

            if not created:
                rate_of_user.rate = self.kwargs.get("rate")
                rate_of_user.save()

            return Response({"status": True})
    

        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)
        

class DeleteRate(APIView):

    def post(self, request, **kwargs):

        try:
            user_id = request.data.get("user_id")
            product_id = request.data.get("product_id")

            rate = Rate.objects.get(rated_by__id = user_id, rated_products__id = product_id)
            rate.delete()

        except Rate.DoesNotExist:
            return Response({"error": "Object does not exist"}, status=404)

        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)



class BrandsByCategoriesAPI(APIView):

    def get(self, request, *args, **kwargs):

        try:
            brands = Brand.objects.filter(belongs_to_category__name__icontains = self.kwargs.get("category"))
            serializer = BrandsByCategoriesSerializer(brands, many=True)

            return Response(serializer.data)

        except Brand.DoesNotExist:
            return Response({"error": "Object does not exist"}, status=404)

        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)
        


class BrandsByIdAPI(APIView):

    def get(self, request, **kwargs):

        try:
            brand = Brand.objects.get(id = self.kwargs.get("id"))
            serializer = BrandsByIdSerializer(brand)

            return Response(serializer.data)


        except Brand.DoesNotExist as e:
            return Response({"error": "Error message", "detail": str(e)}, status=404)

        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)
        



class EditPassword(APIView):
    def patch(self, request, *args, **kwargs):

        try:
            current = request.data.get("current")
            password = request.data.get("password")
            password2 = request.data.get("password2")

            user = User.objects.get(id = self.kwargs.get("id"))

            today_date = date.today()

            if user.password_change_allowed >= today_date:
                return Response({"error": f"You cannot change password till {user.username_change_allowed}"})

            password_matches = check_password(current, user.password)

            if not password_matches:
                return Response({"error": "Your current password is not correct"})

            if password != password2:
                return Response({"error": "Passwords do not match."})
            
            validate_password(password)

            hashed_password = make_password(password)
            user.password = hashed_password

            new_date = today_date + timedelta(days=30) 
            user.password_change_allowed = new_date

            user.save()

            return Response({"status": True})

        except User.DoesNotExist as e:
            return JsonResponse({"error": "Error message", "detail": str(e)}, status=404)

        except ValidationError as e:
            return Response({"error": "Password is too weak", "detail": e.messages}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response({"error": "An error occurred during user registration", "detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


        

if __name__ == "__main__":
    exchange_updater_thread = threading.Thread(target=update_exchange_rates)
    exchange_updater_thread.start()

