import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from rest_framework import status
from unittest.mock import patch
from amazonApp.tests.fixtures_test import create_product, create_user, create_category, create_brand
from decimal import Decimal
from amazonApp.models import Product
from amazonApp.views_folder.views import LobbyPriceMod


@pytest.fixture
def api_client():
    return APIClient()

@pytest.mark.django_db
class TestLobbyPriceMod:

    def test_get_200(self, api_client, create_product, create_user):
        product = create_product
        user = create_user

        url = reverse('lobby-price', kwargs={'user_id': user.id, 'product_id': product.id})
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data == {'modified_price': Decimal('100.00')}


    @patch.object(LobbyPriceMod, 'get', side_effect=Exception("Simulated error"))
    def test_get_500(self, mock_get, api_client, create_product, create_user):
        product = create_product
        user = create_user

        url = reverse('lobby-price', kwargs={'user_id': user.id, 'product_id': product.id})

        with pytest.raises(Exception) as exc_info:
            response = api_client.get(url)

        assert str(exc_info.value) == 'Simulated error'


    @patch('amazonApp.views_folder.views.Product.objects.get')
    def test_get_400(self, mock_get, api_client, create_product, create_user):
        mock_get.side_effect = Product.DoesNotExist("Simulated error")
        product = create_product
        user = create_user

        url = reverse('lobby-price', kwargs={'user_id': user.id, 'product_id': product.id})
        response = api_client.get(url)

        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert response.data == {'error': 'Object does not exist'}