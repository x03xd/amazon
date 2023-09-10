import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from rest_framework import status
from backend.tests.fixtures_test import create_user
from unittest.mock import patch
from django.core.cache import cache
from backend.serializers import CurrencySerializer
from backend.views_folder.currencies_views import provide_currency_context, CurrencyConverterAPI
from backend.models import User

@pytest.fixture
def api_client():
    return APIClient()


@pytest.mark.django_db
def test_provide_currency_context(create_user):
    
    exchange_rates = {
        'USD': 1.0,
        'EUR': 0.85,
        'GBP': 0.75,
    }
    cache.set("exchange_rates", exchange_rates)
    
    user = create_user
    serializer_context = provide_currency_context(user.id)
    
    assert 'user_preferred_currency' in serializer_context
    
    currency_serializer = CurrencySerializer(user)
    expected_currency = exchange_rates[currency_serializer.data['currency']]
    
    assert serializer_context['user_preferred_currency'] == expected_currency


@pytest.mark.django_db
class TestCurrencyConverterAPI:
    
    def test_patch_200(self, create_user, api_client):
        user = create_user

        url = reverse('currency-converter', kwargs={'id': user.id})  
        data = {'currency': 'USD'}

        response = api_client.patch(url, data, format='json')

        assert response.status_code == status.HTTP_200_OK
        assert response.data == {'Valid currency choice': 'USD'}


    def test_patch_curreny_unavaiable(self, create_user, api_client):
        user = create_user

        url = reverse('currency-converter', kwargs={'id': user.id})  
        data = {'currency': 'BUF'}

        response = api_client.patch(url, data, format='json')

        assert response.status_code == status.HTTP_200_OK
        assert response.data == {"error": "Invalid currency choice"}


    @patch.object(CurrencyConverterAPI, 'patch', side_effect=Exception('Simulated error'))
    def test_patch_500(self, mock_get, create_user, api_client):
        user = create_user

        url = reverse('currency-converter', kwargs={'id': user.id})  
        data = {'currency': 'USD'}

        with pytest.raises(Exception) as exc_info:
            api_client.patch(url, data, format='json')

        assert str(exc_info.value) == 'Simulated error'


    @patch('amazonApp.views_folder.currencies_views.User.objects.get')
    def test_patch_404(self, mock_get, api_client, create_user):
        mock_get.side_effect = User.DoesNotExist('Simulating')
        user = create_user

        url = reverse('currency-converter', kwargs={'id': user.id})  
        data = {'currency': 'USD'}

        response = api_client.patch(url, data, format='json')
 
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert response.data == {'error': 'Error message', 'detail': 'Simulating'}
