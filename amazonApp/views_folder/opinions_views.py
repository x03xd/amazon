
from amazonApp.models import Opinion, User, Product, Rate
from amazonApp.serializers import OpinionSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import ListAPIView



class DisplayOpinions(ListAPIView):
    serializer_class = OpinionSerializer

    def get_queryset(self):
        product_id = self.kwargs.get("product_id")
        page = int(self.kwargs.get("page"))

        queryset = Opinion.objects.filter(reviewed_product=product_id)
        return queryset[page:page+5]
    
    
class CreateOpinion(APIView):
    
    def post(self, request, *args, **kwargs):
        product_id = self.kwargs.get("product_id")
        user_id = self.kwargs.get("user_id")
        
        exists = Opinion.objects.filter(reviewed_by=user_id, reviewed_product=product_id).exists()

        if exists:
            return Response({"status": False, "detail": "Your opinion for this product exists already!"})
        
        text = request.data.get("text")
        title = request.data.get("title")

        if not text or not title:
            return Response({"status": False, "detail": "Make sure that title and text are not empty!"})
        
        user = User.objects.get(id=user_id)
        product = Product.objects.get(id=product_id)

        rate = Rate.objects.get(rated_products=product, rated_by=user)

        Opinion.objects.create(
            rate = rate if rate else None,
            title = title,
            text = text,
            reviewed_product = product,
            reviewed_by = user,
        )

        return Response({"status": True, "detail": text})