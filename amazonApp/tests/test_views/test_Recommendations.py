import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from rest_framework import status
from unittest.mock import patch
from amazonApp.tests.fixtures_test import create_product, create_user, create_brand, create_category
from amazonApp.models import Product

@pytest.fixture
def api_client():
    return APIClient()

@pytest.mark.django_db
class TestRecommendaions:

    def test_get_200(self, api_client, create_product, create_user):
        product = create_product
        user = create_user
        
        url = reverse('recommendations', kwargs={'user_id': user.id, 'username': user.username, 'id': product.id})
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK



    @patch('amazonApp.views_folder.views.Product.objects.filter')
    def test_get_404(self, mock_get, api_client, create_product, create_user):
        mock_get.side_effect = Exception("Simulated error")

        product = create_product
        user = create_user
        
        url = reverse('recommendations', kwargs={'user_id': user.id, 'username': user.username, 'id': product.id})
        response = api_client.get(url)

        assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
        assert response.data == {'error': 'Internal Server Error', 'detail': 'Simulated error'}



    @patch('amazonApp.views_folder.views.Product.objects.filter')
    def test_get_500(self, mock_get, api_client, create_product, create_user):
        mock_get.side_effect = Product.DoesNotExist("Simulated error")

        product = create_product
        user = create_user
        
        url = reverse('recommendations', kwargs={'user_id': user.id, 'username': user.username, 'id': product.id})
        response = api_client.get(url)

        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert response.data == {'error': 'Object does not exist'}
