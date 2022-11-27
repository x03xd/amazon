from django.shortcuts import render
from rest_framework import generics, status
from frontend.models import Product, Category, SubCategory
from .serializers import ProductSerializer, CategorySerializer, SubCategorySerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http.response import JsonResponse
import json
from django.db.models import Q, F
from rest_framework.generics import GenericAPIView, ListAPIView

class ProductsAPI(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):

        queryset = Product.objects.all()

        q = self.request.query_params.get('q')
        c = self.request.query_params.get('c')

        if q is not None and q != "":
            queryset = queryset.filter(subcategory_name__sub_category=q)

            if c is not None and c != "":
                queryset = queryset.filter(brand=c)

        return queryset











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


