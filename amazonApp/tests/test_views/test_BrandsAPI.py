import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from amazonApp.models import Brand
from rest_framework import status
from unittest.mock import patch
from amazonApp.tests.fixtures_test import create_category, create_brand
from amazonApp.views_folder.views import BrandsAPI
from collections import OrderedDict


@pytest.fixture
def api_client():
    return APIClient()


@pytest.mark.django_db
class TestBrandsAPI:
    
    def test_get_ok(self, create_brand, api_client):
        brand = create_brand
        url = reverse('brands-by-id', kwargs={'id': brand.id})  
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data == {'id': 1, 'brand_name': 'Default Brand', 'belongs_to_category': 1}


    @patch('amazonApp.views_folder.views.Brand.objects.get')
    def test_get_404(self, mock_get, api_client, create_brand):
        mock_get.side_effect = Brand.DoesNotExist("Simulated error")
   
        brand = create_brand
        url = reverse('brands-by-id', kwargs={'id': brand.id})  
        response = api_client.get(url)

        assert response.status_code == status.HTTP_404_NOT_FOUND

    
    @patch.object(BrandsAPI, 'get', side_effect=Exception("Simulated error"))
    def test_get_500(self, mock_get, api_client, create_brand):
   
        brand = create_brand
        url = reverse('brands-by-id', kwargs={'id': brand.id})  

        with pytest.raises(Exception) as exc_info:
            api_client.get(url)

        assert str(exc_info.value) == 'Simulated error'


    def test_get_category_ok(self, api_client, create_category, create_brand):
        category = create_category
        create_brand

        url = reverse('brands-by-category', kwargs={'category': category.name})
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data == [OrderedDict([('id', 1), ('brand_name', 'Default Brand'), ('belongs_to_category', 1)])]
                                

    def test_get_category_no_brands(self, api_client, create_category):
        category = create_category

        url = reverse('brands-by-category', kwargs={'category': category.name})
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data == []


    @patch.object(BrandsAPI, 'get', side_effect=Exception('Simulated error'))
    def test_get_category_500(self, mock_get, api_client, create_category, create_brand):
        category = create_category
        create_brand

        url = reverse('brands-by-category', kwargs={'category': category.name})

        with pytest.raises(Exception) as exc_info:
            api_client.get(url)

        assert str(exc_info.value) == 'Simulated error'


















'''import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from amazonApp.models import Category, Brand
from rest_framework import status
from unittest.mock import patch
from collections import OrderedDict
from amazonApp.tests.fixtures_test import create_category, create_brand
from amazonApp.views_folder.views import BrandsByCategoriesAPI



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
     '''