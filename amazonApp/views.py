from django.shortcuts import render
from rest_framework import generics, status
from frontend.models import Product, Category, SubCategory, UserRate
from .serializers import ProductSerializer, CategorySerializer, SubCategorySerializer, UserSerializer, CartSerializer, UserRateSerializer, StandardUserRateSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http.response import JsonResponse
import json
from django.db.models import Q, F, When, Value, Case
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
from django.db.models import Avg, Sum, Count
from django.db.models.functions import Concat

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        # ...

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

'''
class Login2API(APIView):

    def post(self, request, *args, **kwargs):

        json_data = json.load(request)

        user = User.objects.get(username=json_data['username'])


        user = authenticate(request, username = json_data['username'], password= json_data['password'])

        if user is not None:
            login(request, user)
            return JsonResponse({'password': 'correct'})


        else:
            return JsonResponse({'password': "wrong"})


'''
class LogoutView(APIView):
    def get(self, request, *args, **kwargs):
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


class TestXD(APIView):

    def get(self, request, format = None):

        lista = []
        object_ = UserRate.objects.values("rated_products").annotate(average_rate=Avg("rate")).filter(average_rate__gte=4)
        serializer = UserRateSerializer(object_, many = True)

        for x in object_:
            lista.append(x["rated_products"])

        #return Response(serializer.data)
        return Response(lista)

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

                if c == "null" and u == "null" and r == "null":
                    queryset = queryset.filter(subcategory_name__sub_category=q)

                if c != "null" and u != "null" and r == "null":
                    queryset = queryset.filter(subcategory_name__sub_category=q, brand__in = multiple_brands_filter, price__range=(first_list[0],second_list[-1]))

                if c == "null" and u != "null" and r == "null":
                    queryset = queryset.filter(subcategory_name__sub_category=q, price__range=(first_list[0],second_list[-1]))

                if c != "null" and u == "null" and r == "null":
                    queryset = queryset.filter(subcategory_name__sub_category=q, brand__in = multiple_brands_filter)


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