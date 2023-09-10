from backend.models import Product, Transaction, User
from backend.serializers import ProductSerializer, TransactionSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from backend.views_folder.currencies_views import provide_currency_context
from collections import Counter

class TransactionsAPI(APIView):

    def get(self, request, **kwargs):
        user_id = self.kwargs.get("user_id")
        year = self.kwargs.get("year")

        user = User.objects.get(id=user_id)

        queryset = Transaction.objects.filter(bought_by=user, date__year=year)
        serialized = TransactionSerializer(queryset, many=True, context=provide_currency_context(user_id))

        return Response(serialized.data)


class TransactionProducts(APIView):
   
    def get(self, request, *args, **kwargs):
        try:
            user_id = self.kwargs.get("user_id")
            products_id = self.kwargs.get("products_id")
            products_id = products_id.split(",")
            products_id = [int(product_id) for product_id in products_id]
            table = Counter()

            for x in products_id:
                table[x] += 1

            products = Product.objects.filter(id__in=products_id)
            serialized = ProductSerializer(products, many=True, context=provide_currency_context(user_id))

            for product in serialized.data:
                product["count"] = table[product["id"]]

            return Response(serialized.data)
        
        except Product.DoesNotExist:
            return Response({"error": "Object does not exist"}, status=404)

        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)
