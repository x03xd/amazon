from django.shortcuts import render
from rest_framework import generics, status
from frontend.models import Product
from .serializers import ProductSerializer
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

        if q is not None and q != "":
            queryset = queryset.filter(subcategory_name__sub_category = q)


        return queryset


