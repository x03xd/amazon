import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from amazonApp.models import Product, CartItem
from rest_framework import status
from unittest.mock import patch
from collections import OrderedDict
from amazonApp.tests.fixtures_test import create_product, create_cart, create_cartItem, create_brand, create_user, create_category, valid_access_token
from amazonApp.views_folder.cart_views import CartAPI


@pytest.fixture
def api_client():
    return APIClient()


@pytest.mark.django_db
class TestCartAPI:


    def test_delete_200(self, api_client, create_cartItem, create_user, create_product, valid_access_token):
        cartItem = create_cartItem
        user = create_user
        product = create_product
        api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {valid_access_token}')

        url = reverse('cart-remove', kwargs={'product_id': product.id})

        response = api_client.post(url, format='json')

        assert response.status_code == status.HTTP_200_OK
        assert response.data == {"status": True, "product_id": product.id}

    

'''    @patch.object(CartAPI, 'post', side_effect=Exception('Simulated error'))
    def test_delete_500(self, mock_post, api_client, create_cartItem, create_user, create_product):
        cartItem = create_cartItem
        user = create_user
        product = create_product

        url = reverse('cart-remove')

        data = {'user_id': user.id, 'item_id': product.id}

        with pytest.raises(Exception) as exc_info:
           api_client.post(url, data, format='json')

        assert str(exc_info.value) == "Simulated error"'''




'''    def test_patch_200(self, api_client, create_product, create_user, create_cartItem, valid_access_token):
        product = create_product
        user = create_user
        cartItem = create_cartItem

        api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {valid_access_token}')
        url = reverse('cart')

        data = {'product_id': product.id, 'quantity': 1}
        response = api_client.patch(url, data, format='json')

        print(response.data)

        assert response.status_code == status.HTTP_200_OK
        assert response.data == {"status": True, "message": product.id}



    def test_patch_quantity_exceeds(self, api_client, create_product, create_user, create_cartItem):
        product = create_product
        user = create_user
        cartItem = create_cartItem
        
        api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {valid_access_token}')
        url = reverse('cart')

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
'''

    






'''
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


import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from amazonApp.models import User, Product
from rest_framework import status
from unittest.mock import patch
from amazonApp.tests.fixtures_test import create_cartItem, create_product, create_cart, create_category, create_user, create_brand
from amazonApp.views_folder.cart_views import ProcessAPI


@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def process_instance():
    return ProcessAPI()


@pytest.mark.django_db
class TestProcessAPI:

    @pytest.mark.parametrize('quantity, product_quantity, total_quantity, exception', [
        (12, 10, 3, {"status": False, "info": "Quantity exceeds available stock"}),
        (12, 13, 3, {"status": False, "info": "Quantity is not in the range of 1-10"}),
        (3, 13, 8, {"status": False, "info": "Maximum quantity of your cart items exceeded"}),
        (3, 4, 4, None),
    ])
    def test_validate_conditions(process_api_instance, quantity, product_quantity, total_quantity, exception, process_instance):
        valid, response =  process_instance.validate_conditions(quantity, product_quantity, total_quantity)

        if not valid:
            assert response == exception
        else:
            assert response is None


    def test_post_200(self, create_cartItem, create_product, create_user, create_cart, api_client):
        create_cartItem
        product = create_product
        user = create_user
        create_cart

        url = reverse('process')
        data = {'product_id': product.id, 'user_id': user.id, 'quantity': 1}

        response = api_client.post(url, data, format='json')

        assert response.status_code == status.HTTP_200_OK
        assert response.data == {"status": True, "info": "Produkt pomyślnie dodano do koszyka"}


    @pytest.mark.parametrize('mock_object, exception', [
        (User, User.DoesNotExist('Simulating 404 status error -> no user')),
        (Product, Product.DoesNotExist('Simulating 404 status error -> no product')),
    ])
    def test_post_404_no_user(self, mock_object, exception, create_cartItem, create_product, create_user, create_cart, api_client):
        with patch(f'amazonApp.views_folder.cart_views.{mock_object.__name__}.objects.get') as mock_post:
            mock_post.side_effect = exception

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
'''