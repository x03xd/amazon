import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from amazonApp.models import Category, Brand, User, Cart, CartItem, Product
from rest_framework import status
from unittest.mock import patch
from collections import OrderedDict
from amazonApp.tests.fixtures_test import create_cartItem, create_product, create_cart, create_category, create_user, create_brand
from amazonApp.views_folder.cart_views import ProcessAPI, RemoveItemCart

@pytest.fixture
def api_client():
    return APIClient()

@pytest.mark.django_db
class TestProcessAPI:

    def test_post_200(self, create_cartItem, create_product, create_user, create_cart, api_client):
        create_cartItem
        product = create_product
        user = create_user
        create_cart

        url = reverse('process')
        data = {'product_id': product.id, 'user_id': user.id, 'quantity': 10}

        response = api_client.post(url, data, format='json')

        assert response.status_code == status.HTTP_200_OK
        assert response.data == {"status": True}

    
    @patch('amazonApp.views_folder.cart_views.User.objects.get')
    def test_post_404_no_user(self, mock_get, create_cartItem, create_product, create_user, create_cart, api_client):
        mock_get.side_effect = User.DoesNotExist('Simulated error')

        create_cartItem
        product = create_product
        user = create_user
        create_cart

        url = reverse('process')
        data = {'product_id': product.id, 'user_id': user.id, 'quantity': 10}

        response = api_client.post(url, data, format='json')

        print(response.data)
        print(response.status_code)

        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert response.data == {'error': 'Object does not exist'}


    @patch('amazonApp.views_folder.cart_views.Product.objects.get')
    def test_post_404_no_product(self, mock_get, create_cartItem, create_product, create_user, create_cart, api_client):
        mock_get.side_effect = Product.DoesNotExist('Simulated error')

        create_cartItem
        product = create_product
        user = create_user
        create_cart

        url = reverse('process')
        data = {'product_id': product.id, 'user_id': user.id, 'quantity': 10}

        response = api_client.post(url, data, format='json')

        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert response.data == {'error': 'Object does not exist'}



    @patch.object(ProcessAPI, 'post', side_effect=Exception('Simulated error'))
    def test_post_500(self, mock_post, create_cartItem, create_product, create_user, create_cart, api_client):

        create_cartItem
        product = create_product
        user = create_user
        create_cart

        url = reverse('process')
        data = {'product_id': product.id, 'user_id': user.id, 'quantity': 10}

        with pytest.raises(Exception) as exc_info:
            api_client.post(url, data, format='json')

        assert str(exc_info.value) == 'Simulated error'
