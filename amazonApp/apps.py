from django.apps import AppConfig
from amazonApp.tasks import background_task 
from rest_framework.response import Response
from django.core.cache import cache

class AmazonppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'amazonApp'

    def ready(self):
        result = background_task.delay()
        task_result = result.result

        if task_result is not None:
            cache.set("exchange_rates", task_result, timeout=None)
        else:
            return Response("Exchange rates have not been uploaded")