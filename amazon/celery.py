import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "amazon.settings")

app = Celery('amazon')

app.config_from_object('django.conf:settings', namespace='CELERY')

app.conf.broker_url = 'amqp://guest@rabbitmq:5672//'
app.conf.result_backend = 'rpc://'


app.conf.result_persistent = False  

app.autodiscover_tasks()