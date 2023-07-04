from django.shortcuts import render
from rest_framework import generics, status
from .models import Product, Category, SubCategory, UserRate, User, Cart
from .serializers import ProductSerializer, CategorySerializer, SubCategorySerializer, UserSerializer, CartSerializer, UserRateSerializer, StandardUserRateSerializer
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
            cart.products.add(product)

            return JsonResponse({"done": True})

        except:
            return JsonResponse({"done": False})


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





class CategoriesAPI(generics.ListAPIView):
    serializer_class = CategorySerializer

    def get_queryset(self):

        queryset = Category.objects.all()
        return queryset



class SubCategoriesAPI(generics.ListAPIView):
    serializer_class = SubCategorySerializer

    def get_queryset(self):

        queryset = SubCategory.objects.all()
        return queryset





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
        return UserRate.objects.values("rated_products").annotate(average_rate=Avg("rate"))





class ProductsAPI(generics.ListAPIView):
    serializer_class = ProductSerializer

   
    def get_queryset(self):
      
        r = self.request.query_params.get('rating')
        q = self.request.query_params.get('q')
        c = self.request.query_params.get('c')
        u = self.request.query_params.get('u')
        
        lst = []

        if r is not None:
            rates = UserRate.objects.values("rated_products").annotate(average_rate=Avg("rate")).filter(average_rate__gte=r)
            serializer = UserRateSerializer(rates, many = True)

            for rate in rates:
                lst.append(rate["rated_products"])
    
        #rating_queryset = UserRate.objects.all()
        
       
        if c is not None:
            multiple_brands_filter = c.split(",")
     
        
        if u is not None:
            multiple_prices_filter = u.split(",")

            first_lst, second_lst = [], []

            for index, s in enumerate(multiple_prices_filter):
                first, second = s.split('-')
                first_lst.append(float(first))
                second_lst.append(float(second))
      

        queryset = Product.objects.all()
      
  
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
   

        return queryset
 

    def post(self, request):

        json_f = json.load(request)["list"]
        objects_list = []


        for id in json_f:
            objects_list.append(Product.objects.get(id = id))

        serializer = ProductSerializer(objects_list, many=True)

        return Response(serializer.data)




'''
class UserUpdateView(LoginRequiredMixin, UpdateView):
    model = User
    fields = ['username', 'email']
    template_name = 'user_form.html'
    success_url = reverse_lazy('home')

    def get_object(self, queryset=None):
        return self.request.user
      
'''



'''
class StoringUserToken(APIView):
    
    def post(self, request, *args, **kwargs):
        json_data = json.load(request)

        response = HttpResponse("cookie setting") 

        response.set_cookie("username", json_data["username"], samesite='None', secure=True, httponly= False)
        response.set_cookie("authToken", json_data["authToken"], samesite='None', secure=True, httponly= False)

        return response


    def get(self, request, *args, **kwargs):

        try:
            username_cookie = request.COOKIES.get('username')
            authToken_cookie = request.COOKIES.get('authToken')

            return JsonResponse({"cookie_to_update": True}) 

        except:
            return JsonResponse({"cookie_to_update": False})
'''

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

        
        except User.DoesNotExist:
            return JsonResponse({"error": "Object does not exist"}, status=404)



    def post(self, request, *args, **kwargs):

        user = User.objects.get(id = self.kwargs.get("id"))
        date = datetime.now()

        new_date = date.date() + timedelta(days=30) 

        user.username_change_allowed = new_date
        user.save()





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

        
        except User.DoesNotExist:
            return JsonResponse({"error": "Object does not exist"}, status=404)



    def post(self, request, *args, **kwargs):

        user = User.objects.get(id = self.kwargs.get("id"))
        date = datetime.now()

        new_date = date.date() + timedelta(days=30) 

        user.email_change_allowed = new_date
        user.save()
