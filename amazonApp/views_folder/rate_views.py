
from amazonApp.models import Product, Rate, User
from amazonApp.serializers import RateSerializer, GetterRateSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http.response import JsonResponse
from rest_framework.generics import ListAPIView
from django.db.models import Avg
from rest_framework.response import Response



class CountAvgRate(ListAPIView):
    serializer_class = RateSerializer

    def get_queryset(self):
        queryset = Rate.objects.values("rated_products").annotate(average_rate=Avg("rate"))
        return queryset



class RateProduct(APIView):
    def get(self, request, **kwargs):

        try:
            rate_of_product = Rate.objects.get(rated_by__id = self.kwargs.get("id"), rated_products__id = self.kwargs.get("pid"))
            serializer = GetterRateSerializer(rate_of_product)

            return Response(serializer.data["rate"])

        except Rate.DoesNotExist:
            return Response({"error": "Object does not exist"}, status=404)
        
        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)

    
    def patch(self, request, **kwargs):
        created = False

        try:
            try:
                user = User.objects.get(id = self.kwargs.get("id"))

            except User.DoesNotExist:
                return Response({"error": "Object does not exist"}, status=404)
            
            try:
                product = Product.objects.get(id = self.kwargs.get("pid"))
            
            except Product.DoesNotExist:
                return Response({"error": "Object does not exist"}, status=404)
            
            rate_of_user, created = Rate.objects.get_or_create(
                rated_by = user,
                rated_products = product,
                defaults={'rate': self.kwargs.get("rate")}
            )

            if not created:
                rate_of_user.rate = self.kwargs.get("rate")
                rate_of_user.save()

            return Response({"status": True})
    
        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)
        

class DeleteRate(APIView):

    def post(self, request, **kwargs):
        try:
            user_id = request.data.get("user_id")
            product_id = request.data.get("product_id")

            rate = Rate.objects.get(rated_by__id = user_id, rated_products__id = product_id)
            rate.delete()

            return Response('The rate has been restarted')

        except Rate.DoesNotExist:
            return Response({"error": "Object does not exist"}, status=404)

        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)
