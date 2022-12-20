from rest_framework.serializers import ModelSerializer
from frontend.models import Product, Category, SubCategory, User, Cart
from rest_framework import serializers






class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class ProductSerializer(ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"




class SubCategorySerializer(ModelSerializer):
    class Meta:
        model = SubCategory
        fields = "__all__"




class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"





class CartSerializer(ModelSerializer):

    class Meta:
        model = Cart
        fields = ["products"]



class ProductSerializer(ModelSerializer):

    class Meta:
        model = Product
        fields = "__all__"

