<<<<<<< HEAD
from __future__ import absolute_import, unicode_literals
=======
>>>>>>> dockerizing-2
import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "amazon.settings")

<<<<<<< HEAD
app = Celery('amazon', backend='rpc://', broker='amqp://guest@localhost//')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.conf.broker_url = 'pyamqp://guest@localhost//' 
app.conf.result_backend = 'rpc://'

app.autodiscover_tasks()

=======
app = Celery('amazon')

app.config_from_object('django.conf:settings', namespace='CELERY')

app.conf.broker_url = 'amqp://guest@rabbitmq:5672//'
app.conf.result_backend = 'rpc://'
app.conf.result_persistent = False  

app.autodiscover_tasks()
>>>>>>> dockerizing-2
