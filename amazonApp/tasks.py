
from .views import update_exchange_rates

@shared_task
def update_exchange_rates_task():
    update_exchange_rates()