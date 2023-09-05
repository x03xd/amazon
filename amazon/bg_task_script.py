
import os
import django
from amazonApp.tasks import background_task
import eventlet
from rest_framework.response import Response
from django.core.cache import cache

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "your_project.settings")
django.setup()

result = background_task.delay()

task_result = result
print(task_result)

if task_result is not None:
    cache.set("exchange_rates", task_result, timeout=None)
else:
    Response("Exchange rates have not been uploaded")