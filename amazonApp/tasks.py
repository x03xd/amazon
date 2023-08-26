from __future__ import absolute_import, unicode_literals
from celery import shared_task
import requests
from rest_framework.response import Response
from django.conf import settings


@shared_task
def background_task():
   
    API_URL = settings.FIXER_API_KEY
    API_KEY = '3f1d8c17a80596d5a89ba0001f8fa2a5'
        
    params = {
        "access_key": API_KEY,
        "symbols": "EUR, USD, PLN, GBP"
        #base -> EUR
    }

    try:
        response = requests.get(API_URL, params=params)
        response.raise_for_status() 

        data = response.json()
        if "rates" in data:
            return data["rates"]
        else:
            return {}  

    except requests.exceptions.RequestException as e:
        return {}
        