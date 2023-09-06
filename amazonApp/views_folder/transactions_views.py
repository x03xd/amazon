from amazonApp.models import Product, Transaction
from amazonApp.serializers import ProductSerializer, TransactionSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.response import Response
from rest_framework.generics import ListAPIView



class TransactionsAPI(ListAPIView):
    serializer_class = TransactionSerializer

    def get_queryset(self):
        queryset = Transaction.objects.filter(bought_by__id=self.kwargs.get("id"))
        return queryset


class ProductsFromTransactions(APIView):

    def adding_products(self, end, table):
        counter, lst_f = 0, []

        for (index, date), count in table.items():
            product = Product.objects.get(id=index)
            serializer = ProductSerializer(product)
            lst_f.append((count, serializer.data, date))
            counter += 1
                
            if counter == end:
                break
        
        return lst_f


    def post(self, request):
        table = {}

        try:
            pages = request.data.get("pages")
            lst = request.data.get("lst")
            
            flattened_lst = [[item, sublist["date"]] for sublist in lst for item in sublist["bought_products"]]
            _, end = pages, pages + 5

            for index, date in flattened_lst:
                table[(index, date)] = table.get((index, date), 0) + 1

            lst_result = self.adding_products(end, table)

            return Response(lst_result)

        except Product.DoesNotExist:
            return Response({"error": "Object does not exist"}, status=404)
        
        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)
        