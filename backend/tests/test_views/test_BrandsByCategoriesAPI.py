import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from backend.models import Category, Brand
from rest_framework import status
from unittest.mock import patch
from collections import OrderedDict
from backend.tests.fixtures_test import create_category, create_brand
from backend.views_folder.views import BrandsByCategoriesAPI

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


    @patch.object(BrandsByCategoriesAPI, 'get', side_effect=Exception('Simulated error'))
    def test_get_500(self, mock_get, api_client, create_category, create_brand):
        category = create_category
        create_brand

        url = reverse('brands-by-categories', kwargs={'category': category.name})

        with pytest.raises(Exception) as exc_info:
            api_client.get(url)

        assert str(exc_info.value) == 'Simulated error'
     