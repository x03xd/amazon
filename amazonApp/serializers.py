from rest_framework.serializers import ModelSerializer
from frontend.models import Product, Category, SubCategory


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





