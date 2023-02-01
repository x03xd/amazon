from rest_framework.serializers import ModelSerializer
from frontend.models import Product, Category, SubCategory, User, Cart, UserRate
from rest_framework import serializers


class UserRateSerializer(ModelSerializer):
    average_rate = serializers.FloatField()
    rated_products = serializers.CharField() # trzeba nadpsiac jako charfield bo foreinkey nie dziala w serializers

    class Meta:
        model = UserRate
        fields = ("rated_products", "average_rate")


class StandardUserRateSerializer(ModelSerializer):

    class Meta:
        model = UserRate
        fields = "__all__"


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



class EditUsernameSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = ('username')


class EditEmailSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = ("email")