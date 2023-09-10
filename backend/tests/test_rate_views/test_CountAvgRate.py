import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from rest_framework import status
from backend.tests.fixtures_test import create_user, create_product, create_rate, create_category, create_brand
from unittest.mock import patch
from django.core.cache import cache
from backend.serializers import CurrencySerializer
from backend.views_folder.currencies_views import provide_currency_context
from collections import OrderedDict

@pytest.fixture
def api_client():
    return APIClient()


@pytest.mark.django_db
class TestCountAvgRate:
    
    def test_queryset_200(self, api_client, create_rate):
        create_rate
        
        url = reverse('avg-rate')
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
