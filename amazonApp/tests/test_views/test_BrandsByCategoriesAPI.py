import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from amazonApp.models import Category, Brand
from rest_framework import status
from unittest.mock import patch
from collections import OrderedDict


@pytest.fixture
def api_client():
    return APIClient()

@pytest.mark.django_db
class TestBrandsByCategoriesAPI:

    def test_get_ok(self, api_client):
        category = Category.objects.create(name='Category 1')
        Brand.objects.create(brand_name='Brand 1', belongs_to_category=category)

        url = reverse('brands-by-categories', kwargs={'category': category.name})
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data == [OrderedDict([('id', 1), ('brand_name', 'Brand 1'), ('belongs_to_category', 1)])]


    def test_get_no_brands(self, api_client):
        category = Category.objects.create(name='Category 1')

        url = reverse('brands-by-categories', kwargs={'category': category.name})
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data == []


    @patch('amazonApp.views_folder.views.Brand.objects.filter')
    def test_get_internal_server_error(self, mock_get, api_client):
        mock_get.side_effect = Exception("Simulated error")

        category = Category.objects.create(name='Category 1')
        Brand.objects.create(brand_name='Brand 1', belongs_to_category=category)

        url = reverse('brands-by-categories', kwargs={'category': category.name})
        response = api_client.get(url)

        assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
        assert response.data == {'error': 'Internal Server Error', 'detail': 'Simulated error'}


    @patch('amazonApp.views_folder.views.Brand.objects.filter')
    def test_get_internal_not_found(self, mock_get, api_client):
        mock_get.side_effect = Brand.DoesNotExist("Simulated error")

        category = Category.objects.create(name='Category 1')
        Brand.objects.create(brand_name='Brand 1', belongs_to_category=category)

        url = reverse('brands-by-categories', kwargs={'category': category.name})
        response = api_client.get(url)

        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert response.data == {'error': 'Object does not exist'}
        
