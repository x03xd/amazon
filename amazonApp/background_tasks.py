import threading
import time
import requests
from django.core.cache import cache
'''
def background_task():
    while True:
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
            cache.set("exchange_rates", data["rates"], timeout=3600)
        else:
            print("Current exchange rates cannot be fetched")

        time.sleep(60 * 60)  # Sleep for 60 minutes

def start_background_task():
    background_thread = threading.Thread(target=background_task)
    background_thread.start()

start_background_task()'''