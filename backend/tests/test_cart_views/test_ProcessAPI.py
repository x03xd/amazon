import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from backend.models import User, Product
from rest_framework import status
from unittest.mock import patch
from backend.tests.fixtures_test import create_cartItem, create_product, create_cart, create_category, create_user, create_brand
from backend.views_folder.cart_views import ProcessAPI


@pytest.fixture
def api_client():
    return APIClient()


@pytest.mark.django_db
class TestProcessAPI:

    @pytest.mark.parametrize('quantity, product_quantity, total_quantity, exception', [
        (12, 10, 3, 'Quantity exceeds available stock'),
        (12, 13, 3, 'Quantity is not in range 1-10'),
        (3, 13, 8, 'Maximum quantity of single item exceeded'),
        (3, 4, 4, None),
    ])

    def test_validate_conditions(self, quantity, product_quantity, total_quantity, exception):
        result = ProcessAPI.validate_conditions(quantity, product_quantity, total_quantity)

        if result is None:
            assert result == exception
        else:
            assert result.data == exception


    def test_post_200(self, create_cartItem, create_product, create_user, create_cart, api_client):
        create_cartItem
        product = create_product
        user = create_user
        create_cart

        url = reverse('process')
        data = {'product_id': product.id, 'user_id': user.id, 'quantity': 999}

        response = api_client.post(url, data, format='json')

        assert response.status_code == status.HTTP_200_OK
        assert response.data == {"status": True}


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
