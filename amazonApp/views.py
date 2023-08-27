from rest_framework import status
from .models import Product, Category, Brand
from .serializers import ProductSerializer, CategorySerializer, BrandsByCategoriesSerializer, BrandsByIdSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from django.db.models import Count
from amazonApp.views_folder.currencies_views import provide_currency_context



class CategoriesAPI(ListAPIView):
    serializer_class = CategorySerializer

    def get_queryset(self):
        try:
            queryset = Category.objects.all()
            return queryset

        except Category.DoesNotExist:
            return Response({'status': False, "error": "Object does not exist"}, status=404)

        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)
        


class ProductsBySubsAPI(ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        q = self.request.query_params.get('q')

        try:
            if q is not None:
                queryset = Product.objects.filter(category_name__name=q)
                return queryset
            else:
                raise ValueError("Parameter 'q' is missing.")
            
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)



class BrandsByCategoriesAPI(APIView):

    def get(self, request, *args, **kwargs):

        try:
            brands = Brand.objects.filter(belongs_to_category__name__icontains = self.kwargs.get("category"))
            serializer = BrandsByCategoriesSerializer(brands, many=True)

            return Response(serializer.data)

        except Brand.DoesNotExist:
            return Response({"error": "Object does not exist"}, status=404)

        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)
        

class BrandsByIdAPI(APIView):

    def get(self, request, **kwargs):

        try:
            brand = Brand.objects.get(id = self.kwargs.get("id"))
            serializer = BrandsByIdSerializer(brand)

            return Response(serializer.data)

        except Brand.DoesNotExist as e:
            return Response({"error": "Error message", "detail": str(e)}, status=404)

        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)
        


class Recommendations(APIView):

    def get(self, request, *args, **kwargs):

        try:
            username = self.kwargs.get("username")
            products_id = self.kwargs.get("id")
            products_id = [int(item) for item in products_id.split(", ")]
            user_id = self.kwargs.get("user_id")

            print(products_id)
   
            recommended = Product.objects.filter(bought_by_rec__username=username).exclude(id__in=products_id)
            recommended = recommended.annotate(freq=Count('bought_by_rec')).order_by('-freq')
            serialized = ProductSerializer(recommended, many=True, context=provide_currency_context(user_id))
            
            return Response({"recommendations": serialized.data[:5]})

        except Product.DoesNotExist:
            return Response({"error": "Object does not exist"}, status=404)    

        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)
            


class LobbyPriceMod(APIView):

    def get(self, request, *args, **kwargs):

        try:
            product_id = self.kwargs.get("product_id")
            user_id = self.kwargs.get("user_id")

            product = Product.objects.get(id=product_id)
            serialized_current = ProductSerializer(product, context=provide_currency_context(user_id))
            serialized_current = ProductSerializer(product, context=provide_currency_context(user_id))

            return Response({"modified_price": serialized_current.data["price"]})

        except Product.DoesNotExist:
            return Response({"error": "Object does not exist"}, status=404)    

        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)