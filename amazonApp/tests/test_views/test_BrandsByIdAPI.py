import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from amazonApp.models import Brand
from rest_framework import status
from unittest.mock import patch
from amazonApp.tests.fixtures_test import create_category, create_brand
from amazonApp.views_folder.views import BrandsByIdAPI


@pytest.fixture
def api_client():
    return APIClient()

@pytest.mark.django_db
class TestBrandsByIdAPI:
    
    def test_get_ok(self, create_brand, api_client):
        brand = create_brand
        url = reverse('brand-by-id', kwargs={'id': brand.id})  
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data == {'id': 1, 'brand_name': 'Default Brand', 'belongs_to_category': 1}


    @patch('amazonApp.views_folder.views.Brand.objects.get')
    def test_get_404(self, mock_get, api_client, create_brand):
        mock_get.side_effect = Brand.DoesNotExist("Simulated error")
   
        brand = create_brand
        url = reverse('brand-by-id', kwargs={'id': brand.id})  
        response = api_client.get(url)

        assert response.status_code == status.HTTP_404_NOT_FOUND

    
    @patch.object(BrandsByIdAPI, 'get', side_effect=Exception("Simulated error"))
    def test_get_500(self, mock_get, api_client, create_brand):
   
        brand = create_brand
        url = reverse('brand-by-id', kwargs={'id': brand.id})  

        with pytest.raises(Exception) as exc_info:
            api_client.get(url)

        assert str(exc_info.value) == 'Simulated error'