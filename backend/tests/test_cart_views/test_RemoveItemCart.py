import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from backend.models import User, CartItem, Product
from rest_framework import status
from unittest.mock import patch
from backend.tests.fixtures_test import create_user, create_cartItem, create_product, create_cart, create_category, create_brand
from backend.views_folder.cart_views import CartAPI, RemoveItemCart

@pytest.fixture
def api_client():
    return APIClient()

@pytest.mark.django_db
class TestRemoveItemCart:

    def test_post_200(self, api_client, create_cartItem, create_user, create_product):
        cartItem = create_cartItem
        user = create_user
        product = create_product

        url = reverse('remove-item')

        data = {'user_id': user.id, 'item_id': product.id}
        response = api_client.post(url, data, format='json')

        assert response.status_code == status.HTTP_200_OK
        assert response.data == {"done": True, "product_id": product.id}


    
    @patch.object(RemoveItemCart, 'post', side_effect=Exception('Simulated error'))
    def test_post_500(self, mock_post, api_client, create_cartItem, create_user, create_product):
        cartItem = create_cartItem
        user = create_user
        product = create_product

        url = reverse('remove-item')

        data = {'user_id': user.id, 'item_id': product.id}

        with pytest.raises(Exception) as exc_info:
           api_client.post(url, data, format='json')

        assert str(exc_info.value) == "Simulated error"


    @patch('amazonApp.views_folder.cart_views.CartItem.objects.get')
    def test_post_404(self, mock_get, api_client, create_cartItem, create_user, create_product):
        mock_get.side_effect = CartItem.DoesNotExist('Simulated error')

        cartItem = create_cartItem
        user = create_user
        product = create_product

        url = reverse('remove-item')

        data = {'user_id': user.id, 'item_id': product.id}
        response = api_client.post(url, data, format='json')

        assert response.status_code == status.HTTP_404_NOT_FOUND

