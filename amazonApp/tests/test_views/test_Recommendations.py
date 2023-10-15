import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from rest_framework import status
from unittest.mock import patch
from amazonApp.tests.fixtures_test import create_product, create_user, create_brand, create_category, valid_access_token
from amazonApp.models import Product
from amazonApp.views_folder.views import Recommendations


@pytest.fixture
def api_client():
    return APIClient()

@pytest.mark.django_db
class TestRecommendations:

    def test_get_200(self, api_client, create_product, create_user, valid_access_token):
        product = create_product
        user = create_user

        api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {valid_access_token}')
        
        url = reverse('recommendations', kwargs={'id': product.id})
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK


    @patch.object(Recommendations, 'get', side_effect=Exception("Simulated error"))
    def test_get_500(self, mock_get, api_client, create_product, create_user):

        product = create_product
        user = create_user
        
        url = reverse('recommendations', kwargs={'id': product.id})

        with pytest.raises(Exception) as exc_info:
            api_client.get(url)

        assert str(exc_info.value) == 'Simulated error'



    @patch('amazonApp.views_folder.views.Product.objects.filter')
    def test_get_404(self, mock_get, api_client, create_product, create_user, valid_access_token):
        mock_get.side_effect = Product.DoesNotExist()

        product = create_product
        user = create_user

        api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {valid_access_token}')
        
        url = reverse('recommendations', kwargs={'id': product.id})
        response = api_client.get(url)

        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert response.data == {'error': 'Object does not exist'}
