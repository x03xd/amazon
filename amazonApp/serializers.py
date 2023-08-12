from rest_framework.serializers import ModelSerializer
from .models import Product, Category, User, Cart, Rate, Transaction, CartItem, Brand
from rest_framework import serializers
from django.core.cache import cache
from decimal import Decimal

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



class UserSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = "__all__"
        

class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class CurrencySerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ["currency"]



class CartSerializer(ModelSerializer):

    class Meta:
        model = Cart
        fields = ["products"]



class ProductSerializer(ModelSerializer):

    class Meta:
        model = Product
        fields = "__all__"

    def to_representation(self, instance):
        context = self.context
        representation = super().to_representation(instance)

        if context:
            exchange_rate = context.get("user_preferred_currency")
            representation["price"] = round(Decimal(representation["price"]) * Decimal(exchange_rate), 2)
            
        return representation


class CartItemSerializer(ModelSerializer):

    class Meta:
        model = CartItem
        fields = "__all__"

    def to_representation(self, instance):
        context = self.context
        representation = super().to_representation(instance)

        if context:
            exchange_rate = context.get("user_preferred_currency")
            representation["total_price"] = round(Decimal(representation["total_price"]) * Decimal(exchange_rate), 2)
            
        return representation
    

class TransactionSerializer(ModelSerializer):

    class Meta:
        model = Transaction
        fields = "__all__"



class EditUsernameSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = ('username',)


class EditEmailSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = ("email",)


class BrandsByCategoriesSerializer(ModelSerializer):

    class Meta:
        model = Brand
        fields = "__all__"


class BrandsByIdSerializer(ModelSerializer):

    class Meta:
        model = Brand
        fields = "__all__"


        
