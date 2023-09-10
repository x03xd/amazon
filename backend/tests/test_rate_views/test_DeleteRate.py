import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from rest_framework import status
from backend.tests.fixtures_test import create_user, create_product, create_rate, create_category, create_brand
from unittest.mock import patch
from django.core.cache import cache
from backend.views_folder.currencies_views import provide_currency_context
from collections import OrderedDict
from backend.models import Rate
from backend.views_folder.rate_views import DeleteRate


@pytest.fixture
def api_client():
    return APIClient()


@pytest.mark.django_db
class TestDeleteRate:
    
    def test_post_200(self, api_client, create_rate, create_user, create_product):
        create_rate
        user = create_user
        product = create_product
        
        url = reverse('delete-rate')

        data = {'user_id': user.id, 'product_id': product.id}
        response = api_client.post(url, data, format='json')

        assert response.status_code == status.HTTP_200_OK
        assert response.data == 'The rate has been restarted'



    @patch('amazonApp.views_folder.rate_views.Rate.objects.get')
    def test_post_404(self, mock_post, api_client, create_rate, create_user, create_product):
        mock_post.side_effect = Rate.DoesNotExist('Simulation error')
        create_rate
        user = create_user
        product = create_product
        
        url = reverse('delete-rate')

        data = {'user_id': user.id, 'product_id': product.id}
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert response.data == {"error": "Object does not exist"}

    
    @patch.object(DeleteRate, 'post', side_effect=Exception('Simulating 500 status error'))
    def test_post_500(self, mcok_post, api_client, create_rate, create_user, create_product):
    
        user = create_user
        product = create_product
        create_rate
        
        url = reverse('delete-rate')
        data = {'user_id': user.id, 'product_id': product.id}

        with pytest.raises(Exception) as exc_info:
            api_client.post(url, data, format='json')

        assert str(exc_info.value) == 'Simulating 500 status error'