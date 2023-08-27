from amazonApp.models import User
from amazonApp.serializers import CurrencySerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.cache import cache
from rest_framework.response import Response



def provide_currency_context(user_id):
    serializer_context = {}
        
    if user_id != "undefined":
        user = User.objects.get(id=user_id)
        serialized_currency = CurrencySerializer(user)
        cache_dict = cache.get("exchange_rates")

        preferred_curr = cache_dict.get(serialized_currency.data["currency"])
        serializer_context['user_preferred_currency'] = preferred_curr

    return serializer_context



class CurrencyConverterAPI(APIView):
    def patch(self, request, *args, **kwargs):

        try:
            currency = request.data.get("currency")

            if currency not in {"USD", "GBP", "PLN", "EUR"}:
                return Response({"error": "Invalid currency choice"})

            user = User.objects.get(id = self.kwargs.get("id"))
            user.currency = currency 
            user.save()

            return Response({"Valid currency choice": currency})

        except User.DoesNotExist:
            return Response({"error": "Error message", "detail": str(e)}, status=404)

        except Exception as e:
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=500)

