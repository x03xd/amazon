from django.shortcuts import render
from rest_framework import generics, status
from frontend.models import Product, Category, SubCategory, UserRate
from .serializers import ProductSerializer, CategorySerializer, SubCategorySerializer, UserSerializer, CartSerializer, UserRateSerializer, StandardUserRateSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http.response import JsonResponse
import json
from django.db.models import Q, F, When, Value, Case
from rest_framework.generics import GenericAPIView, ListAPIView, ListCreateAPIView, CreateAPIView, UpdateAPIView
from frontend.models import User, Cart
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






class CardAPI(APIView):

    def post(self, request):

        json_data = json.load(request)

        cart = Cart.objects.get(owner__username = json_data["username"])
        serializer = CartSerializer(cart)

        return Response(serializer.data["products"])

#@login_required




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

        except:
            return JsonResponse({"done": False})





class CategoriesAPI(generics.ListAPIView):
    serializer_class = CategorySerializer

    def get_queryset(self):

        queryset2 = Category.objects.all()
        return queryset2



class SubCategoriesAPI(generics.ListAPIView):
    serializer_class = SubCategorySerializer

    def get_queryset(self):

        queryset3 = SubCategory.objects.all()
        return queryset3





class LoginAPI(APIView):


    def post(self, request, *args, **kwargs):

        json_data = json.load(request)

        try:
            user_object = User.objects.get(username = json_data['username'])
            return JsonResponse({'authenticated': 'true', 'email': user_object.email, 'username': json_data['username']})

        except User.DoesNotExist:

            return JsonResponse({'authenticated':'false'})



class LogoutView(APIView):
    def get(self, request, format = None):
        pass


class RegisterSystem(CreateAPIView):
    model = User
    serializer_class = UserSerializer
    form_class = RegisterForm

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)

        try:
            return Response("done")

        except:
            pass




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
        lista = []
        object_ = UserRate.objects.values("rated_products").annotate(average_rate=Avg("rate")).filter(average_rate__gte=r)
        serializer = UserRateSerializer(object_, many = True)

        for x in object_:
            lista.append(x["rated_products"])


        queryset = Product.objects.all()

        rating_queryset = UserRate.objects.all()

        q = self.request.query_params.get('q')
        c = self.request.query_params.get('c')
        u = self.request.query_params.get('u')

        multiple_brands_filter = c.split(",")


        '''
        dla przyklady mamy rating = 3 no to
        '''

        if u != "null" and u != "":
            multiple_prices_filter = u.split(",")

            first_list = []
            second_list = []

            for index, s in enumerate(multiple_prices_filter):
                first, second = s.split('-')
                first_list.append(float(first))
                second_list.append(float(second))



        if q is not None:

                if c != "null" and u != "null" and r != "null":
                    queryset = queryset.filter(id__in = lista, subcategory_name__sub_category=q, brand__in = multiple_brands_filter, price__range=(first_list[0],second_list[-1]))

                if c != "null" and u == "null" and r != "null":
                    queryset = queryset.filter(id__in = lista, subcategory_name__sub_category=q, brand__in = multiple_brands_filter)

                if c == "null" and u != "null" and r != "null":
                    queryset = queryset.filter(id__in = lista, subcategory_name__sub_category=q, price__range=(first_list[0],second_list[-1]))

                if c == "null" and u == "null" and r != "null":
                    queryset = queryset.filter(id__in = lista, subcategory_name__sub_category=q)


        return queryset


    def post(self, request):

        json_f = json.load(request)["list"]
        objects_list = []


        for id in json_f:
            objects_list.append(Product.objects.get(id = id))

        serializer = ProductSerializer(objects_list, many=True)


        return Response(serializer.data)

'''class UserUpdateView(LoginRequiredMixin, UpdateView):
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
        user = User.objects.get(id = self.kwargs.get("id"))


        if user.username_change_allowed.date() >= today_date:
            status_username = False

        elif user.email_change_allowed.date() < today_date:
            status_username = True


        if user.email_change_allowed.date() >= today_date:
            status_email = False

        elif user.email_change_allowed.date() < today_date:
            status_email = True
                

        return JsonResponse({"username": status_username, "email":status_email})



class EditUsername(APIView):
    

    def patch(self, request, *args, **kwargs):

        date = datetime.now()
        today_date = date.date()

        user = User.objects.get(id = self.kwargs.get("id"))
        json_data = json.load(request)

        if json_data["access"]["username"] == False or "false":
            return Response("cant edit username")

        else:
            try:
                try:
                    User.objects.get(username = json_data["change"])      
                    return JsonResponse({"status": "User with passed username already exists"})


                except User.DoesNotExist:

                    user.username = json_data["change"]
                    user.save()

                    return JsonResponse({"status":"Username has been changed"})

            except:
                return JsonResponse({"status":"ERROR"})



    def post(self, request, *args, **kwargs):

        json_data = json.load(request)

        if json_data["access"]["username"] == False or "false":
            return Response("cant new date")

        else:
            user = User.objects.get(id = self.kwargs.get("id"))
            date = datetime.now()

            date = date.date() + timedelta(days=30) 

            user.email_change_allowed = date
            user.save()





class EditEmail(APIView):

    def patch(self, request, *args, **kwargs):

        date = datetime.now()
        today_date = date.date()
            
        user = User.objects.get(id = self.kwargs.get("id"))
        json_data = json.load(request)

        if json_data["access"]["email"] == False or "false":
            return Response("cant change")

        else: 
            try:

                try:
                    User.objects.get(email = json_data["change"])      
                    return JsonResponse({"status": "User with passed email already exists"})


                except User.DoesNotExist:

                    user.email = json_data["change"]
                    user.save()

                    return JsonResponse({"status":"Email has been changed"})

            except:
                return JsonResponse({"status":"ERROR"})



    def post(self, request, *args, **kwargs):

        json_data = json.load(request)

        if json_data["access"] == True or "true":
            return Response("cant change")

        else:
            user = User.objects.get(id = self.kwargs.get("id"))
            date = datetime.now()

            date = date.date() + timedelta(days=30) 

            user.username_change_allowed = date
            user.save()
