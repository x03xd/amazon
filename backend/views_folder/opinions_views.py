
from backend.models import Opinion, User, Product, Rate
from backend.serializers import OpinionSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from django.shortcuts import get_object_or_404
from rest_framework import status


class DisplayOpinions(ListAPIView):
    serializer_class = OpinionSerializer

    def get_queryset(self):
        product_id = self.kwargs.get("product_id")
        page = int(self.kwargs.get("page"))

        queryset = Opinion.objects.filter(reviewed_product=product_id)
        return queryset[page:page+5]
    
    
class CreateOpinion(APIView):
    
    def post(self, request, *args, **kwargs):
        try:
            product_id = self.kwargs.get("product_id")
            user_id = self.kwargs.get("user_id")

            user = get_object_or_404(User, id=user_id)
            product = get_object_or_404(Product, id=product_id)

            people_who_bought = product.bought_by_rec.filter(id=user_id).exists()
            if not people_who_bought:
                return Response({"status": False, "info": "You have to buy the product to be able to rate it"})
            
            exists = Opinion.objects.filter(reviewed_by=user_id, reviewed_product=product_id).exists()
            if exists:
                return Response({"status": False, "detail": "Your opinion for this product exists already!"})
            
            text = request.data.get("text")
            title = request.data.get("title")

            if not text or not title:
                return Response({"status": False, "detail": "Make sure that title and text are not empty!"})
            
            rate = None

            try:
                rate = Rate.objects.get(rated_products=product, rated_by=user)

            except:
                pass

            Opinion.objects.create(
                rate = rate if rate else None,
                title = title,
                text = text,
                reviewed_product = product,
                reviewed_by = user,
            )

            return Response({"status": True, "detail": "The opinion has been created"})

        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class RemoveOpinion(APIView):
    
    def post(self, request, *args, **kwargs):
        try:
            opinion_id = self.kwargs.get("opinion_id")

            opinion = get_object_or_404(Opinion, id=opinion_id)
            opinion.delete()
            
            return Response({"status": True, "detail": "The opinion has been removed"})

        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)