from django.shortcuts import render
from rest_framework import generics, status
from .models import Product, SubCategory, UserRate, User, Cart, Transaction
from .serializers import ProductSerializer, SubCategorySerializer, UserSerializer, CartSerializer, UserRateSerializer, StandardUserRateSerializer, TransactionSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http.response import JsonResponse
import json
from django.db.models import Q, F, When, Value, Case
from rest_framework.generics import GenericAPIView, ListAPIView, ListCreateAPIView, CreateAPIView, UpdateAPIView
from django.contrib.auth import login, logout, authenticate
from django.views.generic.edit import CreateView, FormView
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
from django.contrib.postgres.fields import HStoreField


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

    def post(self, request, *args, **kwargs):

        try:
            json_data = json.load(request)

            cart = Cart.objects.get(owner__username = json_data["username"])
            serializer = CartSerializer(cart)

            return Response(serializer.data["products"])
        
        except json.JSONDecodeError as e:
            return JsonResponse({'authenticated': False, "error": "Error decoding JSON", "detail": str(e)}, status=400)

        except Cart.DoesNotExist:
            return JsonResponse({'authenticated': False, "error": "Object does not exist"}, status=404)

        except Exception as e:
            return JsonResponse({'authenticated': False, "error": "Internal Server Error", "detail": str(e)}, status=500)





class ProcessAPI(APIView):

    def post(self, request, *args, **kwargs):

        try:
            json_data = json.load(request)
            product = Product.objects.get(id = json_data["id"])

            cart = Cart.objects.get(owner__username = json_data["username"])
            quantity = int(json_data["quantity"])

            for i in range(quantity):
                cart.products.add(product)

            return JsonResponse({"status": True})

        except json.JSONDecodeError as e:
            return JsonResponse({"error": "Error decoding JSON", "detail": str(e)}, status=400)

        except Product.DoesNotExist:
            return JsonResponse({"error": "Object does not exist"}, status=404)

        except Exception as e:
            return JsonResponse({"error": "Internal Server Error", "detail": str(e)}, status=500)


class RemoveItemCart(APIView):

    def post(self, request, *args, **kwargs):
  
        try:
            json_data = json.load(request)
            product = Product.objects.get(id = json_data["id"])

            cart = Cart.objects.get(owner__username = json_data["username"])
            cart.products.remove(product)

            return JsonResponse({"done": True, "product_id": product.id})


        except json.JSONDecodeError as e:
            return JsonResponse({"error": "Error decoding JSON", "detail": str(e)}, status=400)

        except Product.DoesNotExist:
            return JsonResponse({"error": "Object does not exist"}, status=404)

        except Exception as e:
            return JsonResponse({"error": "Internal Server Error", "detail": str(e)}, status=500)




class SubCategoriesAPI(ListAPIView):
    serializer_class = SubCategorySerializer

    def get_queryset(self):
        try:
            queryset = SubCategory.objects.all()
            return queryset

        except SubCategory.DoesNotExist:
            return JsonResponse({'authenticated': False, "error": "Object does not exist"}, status=404)



class LoginAPI(APIView):
    def post(self, request, *args, **kwargs):
        
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
            queryset = Product.objects.filter(subcategory_name__sub_category=q)

        return queryset




class CountAvgRate(generics.ListAPIView):
    serializer_class = UserRateSerializer

    def get_queryset(self):
        try:
            return UserRate.objects.values("rated_products").annotate(average_rate=Avg("rate"))

        except UserRate.DoesNotExist:
            return Response({"error": "Object does not exist"}, status=404)






class ProductsAPI(APIView):

    def get(self, request, *args, **kwargs):
      
        r = self.request.query_params.get('rating')
        q = self.request.query_params.get('q')
        c = self.request.query_params.get('c')
        u = self.request.query_params.get('u')
        
        lst = []

        if r is not None:
            try:
                rates = UserRate.objects.values("rated_products").annotate(average_rate=Avg("rate")).filter(average_rate__gte=r)
                serializer = UserRateSerializer(rates, many = True)

                for rate in rates:
                    lst.append(rate["rated_products"])

            except UserRate.DoesNotExist:
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

        except UserRate.DoesNotExist:
            return Response({"error": "Object does not exist"}, status=404)
        
        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)

  
        if q is None:

            if (c is not None) and (u is not None) and (r is not None):
                queryset = queryset.filter(id__in = lst, brand__in = multiple_brands_filter, price__range=(first_lst[0], second_lst[-1]))

            if (c is not None) and (u is not None) and (r is None):
                queryset = queryset.filter(brand__in = multiple_brands_filter, price__range=(first_lst[0], second_lst[-1]))

            if (c is not None) and (u is None) and (r is not None):
                queryset = queryset.filter(id__in = lst, brand__in = multiple_brands_filter)

            if (c is None) and (u is not None) and (r is not None):
                queryset = queryset.filter(id__in = lst, price__range=(first_lst[0], second_lst[-1]))
            
            if (c is None) and (u is None) and (r is not None):
                queryset = queryset.filter(id__in = lst)

            if (c is not None) and (u is None) and (r is None):
                queryset = queryset.filter(brand__in = multiple_brands_filter)

            if (c is None) and (u is not None) and (r is None):
                queryset = queryset.filter(price__range=(first_lst[0], second_lst[-1]))

        
        else:

            if (c is not None) and (u is not None) and (r is not None):
                queryset = queryset.filter(subcategory_name__sub_category=q, id__in = lst, brand__in = multiple_brands_filter, price__range=(first_lst[0], second_lst[-1]))

            if (c is not None) and (u is not None) and (r is None):
                queryset = queryset.filter(subcategory_name__sub_category=q, brand__in = multiple_brands_filter, price__range=(first_lst[0], second_lst[-1]))

            if (c is not None) and (u is None) and (r is not None):
                queryset = queryset.filter(subcategory_name__sub_category=q, id__in = lst, brand__in = multiple_brands_filter)

            if (c is None) and (u is not None) and (r is not None):
                queryset = queryset.filter(subcategory_name__sub_category=q, id__in = lst, price__range=(first_lst[0], second_lst[-1]))
            
            if (c is None) and (u is None) and (r is not None):
                queryset = queryset.filter(subcategory_name__sub_category=q, id__in = lst)

            if (c is not None) and (u is None) and (r is None):
                queryset = queryset.filter(subcategory_name__sub_category=q, brand__in = multiple_brands_filter)

            if (c is None) and (u is not None) and (r is None):
                queryset = queryset.filter(subcategory_name__sub_category=q, price__range=(first_lst[0], second_lst[-1]))

            if (c is None) and (u is None) and (r is None):
                queryset = queryset.filter(subcategory_name__sub_category=q)
   
        serializer = ProductSerializer(queryset, many=True)

        return Response(serializer.data)
 


    def post(self, request, *args, **kwargs):
                
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
   




from .serializers import EditUsernameSerializer, EditEmailSerializer



class AccessToChangeStatus(APIView):
        
    def get(self, request, *args, **kwargs):
        
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
    

    def patch(self, request, *args, **kwargs):
        
        date = datetime.now()
        today_date = date.date()

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



    def post(self, request, *args, **kwargs):

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

    def patch(self, request, *args, **kwargs):

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

            return JsonResponse({"status":True})

        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON data"}, status=400)

        except User.DoesNotExist:
            return Response({"error": "One or more products do not exist"}, status=404)

        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)



    def post(self, request, *args, **kwargs):

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


    def post(self, request, *args, **kwargs):

        try:
            json_data = json.load(request)

            if json_data["location"] == "cart":
                cart = Cart.objects.get(owner__id = self.kwargs.get("id"))
                serializer = CartSerializer(cart)
                bought = serializer.data["products"]
                cart.products.clear()
    
            elif json_data["location"] == "lobby":
                bought = json_data["product_id"] * int(json_data["quantity"])

            try:
                user = User.objects.get(id = self.kwargs.get("id"))


            except User.DoesNotExist:
                return Response({"error": "Object does not exist"}, status=404)    

            except Exception as e:
                return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)

            Transaction.objects.create(
                bought_by = user,
                bought_products = bought,
                date = datetime.now()
            )

            return Response("The user's cart has been cleared and transaction has been saved")
                
        except Cart.DoesNotExist:
            return Response({"error": "Object does not exist"}, status=404)    

        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)
        
            

class TransactionsAPI(generics.ListAPIView):
    serializer_class = TransactionSerializer

   
    def get_queryset(self):
      
        try:
            queryset = Transaction.objects.filter(bought_by__id = self.kwargs.get("id"))
            return queryset

        except Transaction.DoesNotExist:
            return JsonResponse({'authenticated': False, "error": "Object does not exist"}, status=404)
        
        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)
        

class ProductsByTrnAPI(View):

    def post(self, request, *args, **kwargs):

        try:
            '''json_data = json.load(request)
            product_ids = json_data["list"]

            objects_list = Product.objects.filter(id__in=product_ids)
            serializer = ProductSerializer(objects_list, many=True)'''

            return 2
       
        
        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON data"}, status=400)

        except Product.DoesNotExist:
            return Response({"error": "Object does not exist"}, status=404)

        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)