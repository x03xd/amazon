from django.shortcuts import render
from rest_framework import generics, status
from .models import Product, Category, Rate, User, Cart, Transaction, CartItem, Brand
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

            cart = CartItem.objects.filter(cart__owner__username = json_data["username"])
       
            serializer = CartItemSerializer(cart, many=True)
        
            return Response(serializer.data)
        
        except json.JSONDecodeError as e:
            return JsonResponse({'authenticated': False, "error": "Error decoding JSON", "detail": str(e)}, status=400)

        except Cart.DoesNotExist:
            return JsonResponse({'authenticated': False, "error": "Object does not exist"}, status=404)

        except Exception as e:
            return JsonResponse({'authenticated': False, "error": "Internal Server Error", "detail": str(e)}, status=500)
        

    def patch(self, request):

        try:
            json_data = json.load(request)
       
            cart = CartItem.objects.get(cart__owner__id = json_data["username"], product__id = json_data["id"])
            cart.quantity = json_data["quantity"]
            cart.save()
   
            return Response("The CartItem has been updated")
        
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

            cart = Cart.objects.get(owner__id=json_data["user_id"])  # Retrieve the cart associated with the user

            try:
                product = Product.objects.get(id=json_data["product_id"])  # Retrieve the product based on the ID
            
            except Product.DoesNotExist:
                return JsonResponse({"error": "Object does not exist"}, status=404)


            try:
                obj = CartItem.objects.get(cart__owner__id = json_data["user_id"], product__id = json_data["product_id"])
                obj.quantity += quantity
                obj.save()

            except:
                obj = CartItem.objects.create(
                    cart=cart,
                    product=product,
                    quantity=quantity
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
            response = super().create(request, *args, **kwargs)
            return Response(True, status=status.HTTP_201_CREATED)
        
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
            product_ids = json_data["list"]

            objects_list = Product.objects.filter(id__in=product_ids)
            serializer = ProductSerializer(objects_list, many=True)

            return Response(serializer.data)
        
        
        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON data"}, status=400)

        except Product.DoesNotExist:
            return Response({"error": "Object does not exist"}, status=404)

        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)
   

class AccessToChangeStatus(APIView):
        
    def get(self):
        
        date = datetime.now()
        today_date = date.date()

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
                    
            return JsonResponse({"username": status_username, "email":status_email})


        except User.DoesNotExist:
            return JsonResponse({"error": "Object does not exist"}, status=404)

        except Exception as e:
            return JsonResponse({"error": "Internal Server Error", "detail": str(e)}, status=500)





class EditUsername(APIView):
    

    def patch(self, request):
        
        date = datetime.now()

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



    def post(self):

        try:
            user = User.objects.get(id = self.kwargs.get("id"))
            date = datetime.now()

            new_date = date.date() + timedelta(days=30) 

            user.username_change_allowed = new_date
            user.save()

        except User.DoesNotExist:
            return JsonResponse({"error": "Object does not exist"}, status=404)    

        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)



class EditEmail(APIView):

    def patch(self, request):

        date = datetime.now()
        today_date = date.date()

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



    def post(self):

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
                cart_items.delete()
                bought = []

                for record in cart_items:
                    bought += record["product"] * record["quantity"]

    
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
        lst = []

        try:

            json_data = json.load(request)
            start, end = json_data["pages"], json_data["pages"] + 5

            flattened_lst = [item for sublist in json_data["lst"] for item in sublist["bought_products"]]

            for product_id in flattened_lst[start:end]:
                product = Product.objects.get(id=product_id)
                serializer = ProductSerializer(product)
                lst.append((product_id, serializer.data))

            return Response(lst)

        except Product.DoesNotExist:
            return JsonResponse({"error": "Object does not exist"}, status=404)
        
        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)
        

class RateProduct(APIView):

    def post(self, request):

        try:
            json_data = json.load(request)

            rate_of_product = Rate.objects.get(rated_by__id = json_data["user_id"], rated_products__id = json_data["product_id"])
            serializer = GetterRateSerializer(rate_of_product)

            return Response(serializer.data["rate"])


        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON data"}, status=400)

        except Rate.DoesNotExist:
            return JsonResponse({"error": "Object does not exist"}, status=404)
        
        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)


    
    def patch(self, request):
        created = False

        try:
            json_data = json.load(request)

            try:
                user = User.objects.get(id = json_data["user_id"])

            except User.DoesNotExist:
                return JsonResponse({"error": "Object does not exist"}, status=404)
            

            try:
                product = Product.objects.get(id = json_data["product_id"])
            
            except Product.DoesNotExist:
                return JsonResponse({"error": "Object does not exist"}, status=404)
            

            rate_of_user, created = Rate.objects.get_or_create(
                rated_by = user,
                rated_products = product,
                defaults={'rate': json_data["rate"]}
            )

            if not created:
                rate_of_user.rate = json_data["rate"]
                rate_of_user.save()

            return Response("The rate for the specific item has been changed/created")
        
        
        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON data"}, status=400)

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