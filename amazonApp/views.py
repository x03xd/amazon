from django.shortcuts import render
from rest_framework import generics, status
from .models import Product, Category, Rate, User, Transaction, CartItem, Brand, Cart
from .serializers import ProductSerializer, CategorySerializer, UserSerializer, CartSerializer, RateSerializer, TransactionSerializer, CartItemSerializer, GetterRateSerializer, BrandsByCategoriesSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http.response import JsonResponse
import json
from django.db.models import Q, F, When, Value, Case
from rest_framework.generics import ListAPIView, CreateAPIView
from django.contrib.auth import login, logout, authenticate
from .forms import RegisterForm
from django.views.generic.edit import View
from django.views.generic import View, TemplateView
from django.dispatch import receiver
from django.db.models.signals import post_save
from rest_framework.decorators import api_view
from rest_framework.authtoken.models import Token
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm
from django.db.models import Avg, Sum, Count
from django.db.models.functions import Concat
from datetime import datetime, timedelta, date
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.http import HttpResponse
from django.conf import settings
from django.views.generic.detail import SingleObjectMixin
from .serializers import EditUsernameSerializer, EditEmailSerializer
from django.contrib.auth.password_validation import validate_password
from django.core.validators import validate_email
from django.core.exceptions import ValidationError



class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username
        token['email'] = user.email

        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer



class CartAPI(APIView):

    def post(self, request):

        try:
            json_data = json.load(request)

            cart = CartItem.objects.filter(cart__owner__username = json_data["username"]).order_by('product__title')
            serializer = CartItemSerializer(cart, many=True)
            
            for cart_item in serializer.data:
                prod = Product.objects.get(id=cart_item["product"])
                p_serializer = ProductSerializer(prod)
                cart_item["product_data"] = p_serializer.data

            sum_ = cart.aggregate(total_price_sum=Sum('total_price'))
        
            return JsonResponse({"cart_items": serializer.data, "sum": sum_['total_price_sum']})
        
        except json.JSONDecodeError as e:
            return JsonResponse({"error": "Error decoding JSON", "detail": str(e)}, status=400)

        except CartItem.DoesNotExist:
            return JsonResponse({"error": "Object does not exist"}, status=404)

        except Exception as e:
            return JsonResponse({"error": "Internal Server Error", "detail": str(e)}, status=500)
        

    def patch(self, request):

        try:
            json_data = json.load(request)
       
            cart = CartItem.objects.get(cart__owner__id = json_data["user_id"], product__id = json_data["product_id"])
            new_total_price = (cart.total_price * json_data["quantity"]) / cart.quantity

            cart.quantity = json_data["quantity"]
            cart.total_price = new_total_price

            cart.save()
   
            return Response(json_data["product_id"])
        
        except (json.JSONDecodeError, CartItem.DoesNotExist) as e:
            return JsonResponse({"error": "Error message", "detail": str(e)}, status=400 or 404)
        
        except Exception as e:
            return JsonResponse({"error": "Internal Server Error", "detail": str(e)}, status=500)



class ProcessAPI(APIView):

    def post(self, request):

        try:
            json_data = json.load(request)
            quantity = int(json_data["quantity"])

            total_quantity = CartItem.objects.filter(cart__owner__username=json_data["user_id"]).aggregate(total_quantity=Sum('quantity'))['total_quantity']

            if isinstance(total_quantity, int) and total_quantity >= 10:
                return JsonResponse({"status": False, "info": "size of the cart is too big"})

            cart = Cart.objects.get(owner__id=json_data["user_id"])  

            try: 
                product = Product.objects.get(id=json_data["product_id"]) 

            
            except Product.DoesNotExist:
                return JsonResponse({"error": "Object does not exist"}, status=404)


            try:
                obj = CartItem.objects.get(cart__owner__id = json_data["user_id"], product__id = json_data["product_id"])
                obj.quantity += quantity
                obj.total_price += product.price * quantity
                obj.save()

            except:
                obj = CartItem.objects.create(
                    cart = cart,
                    product = product,
                    quantity = quantity,
                    total_price = product.price * quantity
                )

            return Response("The item has been added to the user's cart")

        except (json.JSONDecodeError, Product.DoesNotExist) as e:
            return JsonResponse({"error": "Error message", "detail": str(e)}, status=400 or 404)
        
        except Exception as e:
            return JsonResponse({"error": "Internal Server Error", "detail": str(e)}, status=500)
        
        



class RemoveItemCart(APIView):

    def post(self, request):
  
        try:
            json_data = json.load(request)

            cart = CartItem.objects.get(cart__owner__id = json_data["username"], product__id = json_data["id"])
            cart.delete()

            return JsonResponse({"done": True, "product_id": json_data["id"]})


        except json.JSONDecodeError as e:
            return JsonResponse({"error": "Error decoding JSON", "detail": str(e)}, status=400)

        except Product.DoesNotExist:
            return JsonResponse({"error": "Object does not exist"}, status=404)

        except Exception as e:
            return JsonResponse({"error": "Internal Server Error", "detail": str(e)}, status=500)




class CategoriesAPI(ListAPIView):
    serializer_class = CategorySerializer

    def get_queryset(self):
        try:
            queryset = Category.objects.all()
            return queryset

        except Category.DoesNotExist:
            return JsonResponse({'authenticated': False, "error": "Object does not exist"}, status=404)



class LoginAPI(APIView):
    def post(self, request):
        
        try:
            json_data = json.load(request)
            user_object = User.objects.get(username=json_data['username'])
            return JsonResponse({'authenticated': True, 'email': user_object.email, 'username': json_data['username']})
        
        except User.DoesNotExist:
            return JsonResponse({'authenticated': False, "error": "Object does not exist"}, status=404)
        
        except json.JSONDecodeError as e:
            return JsonResponse({'authenticated': False, "error": "Error decoding JSON", "detail": str(e)}, status=400)
        
        except Exception as e:
            return JsonResponse({'authenticated': False, "error": "Internal Server Error", "detail": str(e)}, status=500)



class LogoutView(APIView):
    def get(self, request, format = None):
        pass

class RegisterSystem(CreateAPIView):
    model = User
    serializer_class = UserSerializer
    form_class = RegisterForm

    def create(self, request, *args, **kwargs):

        try:
            if User.objects.filter(username = request.data.get('username')).exists():
                return JsonResponse({"status":False, "detail": "Użytkownik o takiej nazwie figuruje już w bazie danych"})
            
            if User.objects.filter(email = request.data.get('email')).exists():
                return JsonResponse({"status":False, "detail": "Użytkownik o takim emailu figuruje już w bazie danych"})

            password = request.data.get('password')  # Get the password from the request data
            validate_password(password)  # Validate the password strength

            email = request.data.get('email')  # Get the password from the request data
            validate_email(email)  # Validate the password strength

            response = super().create(request, *args, **kwargs)
            return Response(True, status=status.HTTP_201_CREATED)
        
        except ValidationError as e:
            return Response({"error": "Password is too weak", "detail": e.messages}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response({"error": "An error occurred during user registration", "detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class ProductsBySubsAPI(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):

        q = self.request.query_params.get('q')

        if q is not None:
            queryset = Product.objects.filter(category_name__name=q)

        return queryset




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

            except Exception as e:
                return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)
        

        if c is not None:
            multiple_brands_filter = c.split(",")

        if u is not None:
            multiple_prices_filter = u.split(",")
            first_lst, second_lst = [], []

            for index, s in enumerate(multiple_prices_filter):
                first, second = s.split('-')
                first_lst.append(float(first))
                second_lst.append(float(second))


        try:
            queryset = Product.objects.all()

        except Rate.DoesNotExist:
            return Response({"error": "Object does not exist"}, status=404)
        
        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)

  
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
            json_data = json.load(request)
            products = []

            for product, quantity in json_data["lst"]:
                instance = Product.objects.get(id=product)
                products.append(instance)

            serializer = ProductSerializer(products, many=True)

            return JsonResponse({"products": serializer.data})
        
        
        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON data"}, status=400)

        except Product.DoesNotExist:
            return Response({"error": "Object does not exist"}, status=404)

        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)
   

class AccessToChangeStatus(APIView):
        
    def get(self, request, *args, **kwargs):
        today_date = date.today()

        try:
            user = User.objects.get(id = self.kwargs.get("id"))

            if user.username_change_allowed.date() >= today_date:
                status_username = False

            elif user.username_change_allowed.date() < today_date:
                status_username = True


            if user.email_change_allowed.date() >= today_date:
                status_email = False

            elif user.email_change_allowed.date() < today_date:
                status_email = True


            if user.password_change_allowed.date() >= today_date:
                status_password = False

            elif user.password_change_allowed.date() < today_date:
                status_password = True

                    
            return JsonResponse({"username": status_username, "email": status_email, "password": status_password})


        except User.DoesNotExist:
            return JsonResponse({"error": "Object does not exist"}, status=404)

        except Exception as e:
            return JsonResponse({"error": "Internal Server Error", "detail": str(e)}, status=500)





class EditUsername(APIView):
    
    def patch(self, request, **kwargs):
        
        try:
            json_data = json.load(request)

            if not json_data["access"]["username"]:
                return JsonResponse({"error": "Impossible"})
            
            user = User.objects.get(id = self.kwargs.get("id"))
 
            if User.objects.filter(username=json_data["change"]).exists():
                return JsonResponse({"status": "User with passed username already exists"})
            
            user.username = json_data["change"]
            user.save()

            return JsonResponse({"status":True})

        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON data"}, status=400)

        except User.DoesNotExist:
            return Response({"error": "One or more products do not exist"}, status=404)

        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)



    def post(self, requst, **kwargs):

        try:
            user = User.objects.get(id = self.kwargs.get("id"))
            new_date = date.today() + timedelta(days=30) 

            user.username_change_allowed = new_date
            user.save()

        except User.DoesNotExist:
            return JsonResponse({"error": "Object does not exist"}, status=404)    

        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)



class EditEmail(APIView):

    def patch(self, request, **kwargs):

        try:
            json_data = json.load(request)

            if not json_data["access"]["email"]:
                return JsonResponse({"error": "Impossible"})
            
            user = User.objects.get(id = self.kwargs.get("id"))
 
            if User.objects.filter(email=json_data["change"]).exists():
                return JsonResponse({"status": "User with passed email already exists"})
            
            user.email = json_data["change"]
            user.save()

            return JsonResponse({"status": True})

        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON data"}, status=400)

        except User.DoesNotExist:
            return Response({"error": "One or more products do not exist"}, status=404)

        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)



    def post(self, request, **kwargs):

        try:
            user = User.objects.get(id = self.kwargs.get("id"))
            date = datetime.now()

            new_date = date.date() + timedelta(days=30) 

            user.email_change_allowed = new_date
            user.save()

        except User.DoesNotExist:
            return JsonResponse({"error": "Object does not exist"}, status=404)    

        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)
        


class FinalizeOrder(APIView):

    def post(self, request):

        try:
            json_data = json.load(request)

            if json_data["location"] == "cart":
                cart_items = CartItem.objects.filter(cart__owner__id = json_data["user"])
                serializer = CartItemSerializer(cart_items, many=True)
                bought = []

                for record in serializer.data:
                    bought += [record["product"]] * record["quantity"]

                cart_items.delete()
 
    
            elif json_data["location"] == "lobby":
                bought = json_data["product_id"] * int(json_data["quantity"])

            try:
                user = User.objects.get(id = json_data["user"])

            except User.DoesNotExist:
                return Response({"error": "Object does not exist"}, status=404)    

            Transaction.objects.create(
                bought_by = user,
                bought_products = bought,
                date = datetime.now().date()
            )

            return Response("The user's cart has been cleared and transaction has been saved")
                

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
            return JsonResponse({'authenticated': False, "error": "Object does not exist"}, status=404)
        
        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)
        
    
        
class ProductsFromTransactions(APIView):

    def post(self, request):
        table, lst = {}, []

        try:
            json_data = json.load(request)
            start, end = json_data["pages"], json_data["pages"] + 5

            flattened_lst = [[item, sublist["date"]] for sublist in json_data["lst"] for item in sublist["bought_products"]]

            for index, date in flattened_lst:
                table[(index, date)] = table.get((index, date), 0) + 1

            counter = 0
            for (index, date), count in table.items():
                product = Product.objects.get(id=index)
                serializer = ProductSerializer(product)
                lst.append((count, serializer.data, date))
                counter += 1

                if counter == end:
                    break


            return Response(lst)

        except Product.DoesNotExist:
            return JsonResponse({"error": "Object does not exist"}, status=404)
        
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
                return JsonResponse({"error": "Object does not exist"}, status=404)
            
            try:
                product = Product.objects.get(id = self.kwargs.get("pid"))
            
            except Product.DoesNotExist:
                return JsonResponse({"error": "Object does not exist"}, status=404)
            

            rate_of_user, created = Rate.objects.get_or_create(
                rated_by = user,
                rated_products = product,
                defaults={'rate': self.kwargs.get("rate")}
            )

            if not created:
                rate_of_user.rate = self.kwargs.get("rate")
                rate_of_user.save()

            return Response("The rate for the specific item has been changed/created")
        
        
        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)
        

class DeleteRate(APIView):

    def post(self, request, **kwargs):

        try:
            json_data = json.load(request)
            rate = Rate.objects.get(rated_by__id = json_data["user_id"], rated_products__id = json_data["product_id"])
            rate.delete()

        except Rate.DoesNotExist:
            return JsonResponse({"error": "Object does not exist"}, status=404)

        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON data"}, status=400)

        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)



class BrandsByCategoriesAPI(APIView):

    def get(self, request, *args, **kwargs):

        try:
            brands = Brand.objects.filter(belong_to_category__name__icontains = self.kwargs.get("category"))
            serializer = BrandsByCategoriesSerializer(brands, many=True)

            return Response(serializer.data)

        
        except Brand.DoesNotExist:
            return JsonResponse({"error": "Object does not exist"}, status=404)

        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON data"}, status=400)

        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)
        


class EditPassword(APIView):
    
    def patch(self, request, *args, **kwargs):

        
        try:
            json_data = json.load(request)

            user = User.objects.get(id = self.kwargs.get("id"))

            if json_data["password"] != json_data["password2"]:
                return JsonResponse({"status": False, "detail": "Hasła są różne"})

            validate_password(json_data["password"])

            user.password = json_data["password"]

            return JsonResponse({"status": True})

                
        except User.DoesNotExist:
            return JsonResponse({"error": "Object does not exist"}, status=404)

        except ValidationError as e:
            return Response({"error": "Password is too weak", "detail": e.messages}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response({"error": "An error occurred during user registration", "detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


        

