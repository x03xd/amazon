
from amazonApp.models import Opinion
from amazonApp.serializers import OpinionSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import ListAPIView




class DisplayOpinions(ListAPIView):
    serializer_class = OpinionSerializer

    def get_queryset(self):
        product_id = self.kwargs.get('product_id')
        page = self.kwargs.get('page')

        page = int(page)

        queryset = Opinion.objects.filter(reviewed_product=product_id)
        return queryset[page:page+5]