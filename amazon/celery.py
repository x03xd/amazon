from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from celery.schedules import crontab


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "amazon.settings")

app = Celery('amazon', backend='rpc://', broker='amqp://guest@localhost//')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.conf.broker_url = 'pyamqp://guest@localhost//' 
app.conf.result_backend = 'rpc://'

app.autodiscover_tasks()
