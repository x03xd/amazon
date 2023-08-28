import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from amazonApp.models import Category, Brand
from rest_framework import status
from unittest.mock import patch
from collections import OrderedDict
from amazonApp.tests.fixtures_test import create_category, create_brand

@pytest.fixture
def api_client():
    return APIClient()

@pytest.mark.django_db
class TestBrandsByCategoriesAPI:

    def test_get_ok(self, api_client, create_category, create_brand):
        category = create_category
        create_brand

        url = reverse('brands-by-categories', kwargs={'category': category.name})
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data == [OrderedDict([('id', 1), ('brand_name', 'Default Brand'), ('belongs_to_category', 1)])]
                                

    def test_get_no_brands(self, api_client, create_category):
        category = create_category

        url = reverse('brands-by-categories', kwargs={'category': category.name})
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data == []


    @patch('amazonApp.views_folder.views.Brand.objects.filter')
    def test_get_500(self, mock_get, api_client, create_category, create_brand):
        mock_get.side_effect = Exception("Simulated error")

        category = create_category
        create_brand

        url = reverse('brands-by-categories', kwargs={'category': category.name})
        response = api_client.get(url)

        assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
        assert response.data == {'error': 'Internal Server Error', 'detail': 'Simulated error'}


    @patch('amazonApp.views_folder.views.Brand.objects.filter')
    def test_get_404(self, mock_get, api_client, create_category, create_brand):
        mock_get.side_effect = Brand.DoesNotExist("Simulated error")

        category = create_category
        create_brand

        url = reverse('brands-by-categories', kwargs={'category': category.name})
        response = api_client.get(url)

        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert response.data == {'error': 'Object does not exist'}
        
