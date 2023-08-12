from __future__ import absolute_import, unicode_literals
from celery import shared_task
import requests
from rest_framework.response import Response

@shared_task
def background_task():
    
    API_URL = "http://data.fixer.io/api/latest"
    API_KEY = '3f1d8c17a80596d5a89ba0001f8fa2a5'
        
    params = {
        "access_key": API_KEY,
        "symbols": "EUR, USD, PLN, GBP"
        #base -> EUR
    }

    response = requests.get(API_URL, params=params)

    if response.status_code == 200:
        data = response.json()
        return data["rates"]
    else:
        return Response("Exchange rates have not been loaded initially")


