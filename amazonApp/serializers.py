from rest_framework.serializers import ModelSerializer
from .models import Product, Category, User, Cart, Rate, Transaction, CartItem
from rest_framework import serializers


class RateSerializer(ModelSerializer):
    average_rate = serializers.FloatField()
    rated_products = serializers.CharField() # trzeba nadpsiac jako charfield bo foreinkey nie dziala w serializers

    class Meta:
        model = Rate
        fields = ("rated_products", "average_rate")

class GetterRateSerializer(ModelSerializer):

    class Meta:
        model = Rate
        fields = "__all__"


class StandardUserRateSerializer(ModelSerializer):

    class Meta:
        model = Rate
        fields = "__all__"


class CartItemSerializer(ModelSerializer):

    class Meta:
        model = CartItem
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



class TransactionSerializer(ModelSerializer):

    class Meta:
        model = Transaction
        fields = "__all__"



class EditUsernameSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = ('username')


class EditEmailSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = ("email")

    