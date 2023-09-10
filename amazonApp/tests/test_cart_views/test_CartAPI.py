import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from amazonApp.models import Category, Brand, Product, User, CartItem
from rest_framework import status
from unittest.mock import patch
from collections import OrderedDict
from amazonApp.tests.fixtures_test import create_product, create_cart, create_cartItem, create_brand, create_user, create_category
from amazonApp.views_folder.cart_views import CartAPI


@pytest.fixture
def api_client():
    return APIClient()


@pytest.mark.django_db
class TestCartAPI:

    def test_patch_200(self, api_client, create_product, create_user, create_cartItem):
        product = create_product
        user = create_user
        cartItem = create_cartItem
        
        url = reverse('cart', kwargs={'user_id': user.id})

        data = {'product_id': product.id, 'quantity': 1}
        response = api_client.patch(url, data, format='json')

        print(response.data)
        print(response.status_code)

        assert response.status_code == status.HTTP_200_OK
        assert response.data == product.id


    def test_patch_quantity_exceeds(self, api_client, create_product, create_user, create_cartItem):
        product = create_product
        user = create_user
        cartItem = create_cartItem
        
        url = reverse('cart', kwargs={'user_id': user.id})

        data = {'product_id': product.id, 'quantity': 1000}
        response = api_client.patch(url, data, format='json')

        assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
        assert response.data == {'error': 'Internal Server Error', 'detail': 'Quantity exceeds available stock'}



    
    @pytest.mark.parametrize('mock_object, exception, detail', [
        (CartItem, CartItem.DoesNotExist('Simulating 404 status error -> no cartItem'), 'no cartItem'),
        (Product, Product.DoesNotExist('Simulating 404 status error -> no product'), 'no product'),
    ])
    def test_patch_404_cartItem(self, mock_object, exception, detail, api_client, create_product, create_user, create_cartItem):
        with patch(f'amazonApp.views_folder.cart_views.{mock_object.__name__}.objects.get') as mock_patch:
            mock_patch.side_effect = exception

            product = create_product
            user = create_user
            create_cartItem
            
            url = reverse('cart', kwargs={'user_id': user.id})

            data = {'product_id': product.id, 'quantity': 1}
            response = api_client.patch(url, data, format='json')

            assert response.status_code == status.HTTP_404_NOT_FOUND
            assert response.data == {'error': 'Error message', 'detail': f'Simulating 404 status error -> {detail}'}



    @patch.object(CartAPI, 'patch', side_effect=Exception("Simulate status 500"))
    def test_patch_500(self, mock_patch, api_client, create_product, create_user, create_cartItem):
        product = create_product
        user = create_user
        create_cartItem
        
        url = reverse('cart', kwargs={'user_id': user.id})

        data = {'product_id': product.id, 'quantity': 1000}

        with pytest.raises(Exception) as exc_info:
            api_client.patch(url, data, format='json')

        assert str(exc_info.value) == "Simulate status 500"