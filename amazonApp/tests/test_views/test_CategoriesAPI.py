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
class TestCategoriesAPI:
    

    def test_get_queryset_ok(self, api_client):
        Category.objects.create(name='Category 1')
        Category.objects.create(name='Category 2')

        url = reverse('categories')
        response = api_client.get(url)

        print(response.data)

        assert response.status_code == status.HTTP_200_OK
        assert response.data == [OrderedDict([('id', 5), ('name', 'Category 1')]), OrderedDict([('id', 6), ('name', 'Category 2')])]


    def test_get_queryset_no_categories(self, api_client):
        url = reverse('categories')
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data == []


   
