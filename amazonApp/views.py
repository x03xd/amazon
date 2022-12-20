from django.shortcuts import render
from rest_framework import generics, status
from frontend.models import Product, Category, SubCategory
from .serializers import ProductSerializer, CategorySerializer, SubCategorySerializer, UserSerializer, CartSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http.response import JsonResponse
import json
from django.db.models import Q, F
from rest_framework.generics import GenericAPIView, ListAPIView, ListCreateAPIView, CreateAPIView
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
class ProductsAPI(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):

        queryset = Product.objects.all()

        q = self.request.query_params.get('q')
        c = self.request.query_params.get('c')
        u = self.request.query_params.get('u')
        u2 = self.request.query_params.get('u2')

        if q is not None:

            if q == "":
                queryset = queryset.filter(subcategory_name__sub_category=q)

            if c == "null" and u != "null":
                queryset = queryset.filter(subcategory_name__sub_category=q, price__gte=u, price__lte=u2)

            if c == "null" and u == "null":
                queryset = queryset.filter(subcategory_name__sub_category=q)

            if c != "null" and u == "null":
                queryset = queryset.filter(subcategory_name__sub_category=q, brand=c)

            if c != "null" and u != "null":
                queryset = queryset.filter(subcategory_name__sub_category=q, brand = c, price__gte=u, price__lte=u2)

           #queryset = queryset.filter(subcategory_name__sub_category=q, brand= c.rstrip(c[-1]))

        return queryset


    def post(self, request):

        json_f = json.load(request)["list"]
        objects_list = []


        for id in json_f:
            objects_list.append(Product.objects.get(id = id))

        serializer = ProductSerializer(objects_list, many=True)


        return Response(serializer.data)



class CardAPI(APIView):

    def get(self, request):
        cart = Cart.objects.all()
        serializer = CartSerializer(cart, many = True)

        return Response(serializer.data[0]["products"])

#@login_required




class ProcessAPI(APIView):

    def post(self, request, *args, **kwargs):

        try:
            json_data = json.load(request)["id"]
            product = Product.objects.get(id = json_data)

            cart = Cart.objects.get(owner__username = "admin")
            cart.products.add(product)

            return JsonResponse({"done": True})

        except:
            return JsonResponse({"done": False})



class getUser(APIView):
    def get(self, request, *args, **kwargs):

        user = User.objects.get(username = "kacperek")
        serializer = UserSerializer(user)


        return JsonResponse({"user":self.request.user})



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


class Login2API(APIView):

    def post(self, request, *args, **kwargs):

        json_data = json.load(request)

        user = authenticate(request, username = json_data['username'], password= json_data['password'])

        if user is not None:
            login(request, user)
            return JsonResponse({'password': 'correct'})

        else:
            return JsonResponse({'password': 'wrong'})



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

    '''
    def get_initial(self, request, *args, **kwargs):
        initial = super().get_initial(**kwargs)
        initial["sub_category"] = "enter"
        return initial
#serializer.data, status=status.HTTP_201_CREATED
'''



class ProductsBySubsAPI(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):

        q = self.request.query_params.get('q')

        if q is not None:
            queryset = Product.objects.filter(subcategory_name__sub_category=q)

        return queryset



