import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from rest_framework import status
from amazonApp.tests.fixtures_test import create_user, create_product, create_rate, create_category, create_brand, valid_access_token
from unittest.mock import patch
from django.core.cache import cache
from amazonApp.views_folder.currencies_views import provide_currency_context
from collections import OrderedDict
from amazonApp.models import Rate, User, Product
from amazonApp.views_folder.rate_views import RatesAPI
from django.core.exceptions import ObjectDoesNotExist

@pytest.fixture
def api_client():
    return APIClient()


@pytest.mark.django_db
class TestRatesAPI:

    def test_get_id_200(self, api_client, create_rate, create_user, create_product):
        user = create_user
        product = create_product
        
        url = reverse('rate-by-id', kwargs={'user_id': user.id, 'pid': product.id})
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data == 3


    @patch.object(RatesAPI, 'get', side_effect=Exception('Simulated 500 status error'))
    def test_get_id_500(self, mock_get, api_client, create_user, create_product):
        user = create_user
        product = create_product
        
        url = reverse('rate-by-id', kwargs={'user_id': user.id, 'pid': product.id})

        with pytest.raises(Exception) as exc_info:
            api_client.get(url)

        assert str(exc_info.value) == 'Simulated 500 status error'


    
    @patch.object(RatesAPI, 'patch', side_effect=Exception('Simulated 500 status error'))
    def test_patch_id_500(self, mock_patch, api_client, create_rate, create_user, create_product):
        rate = create_rate
        user = create_user
        product = create_product
        
        url = reverse('rate-update', kwargs={'pid': product.id, 'rate': rate.rate})

        with pytest.raises(Exception) as exc_info:
            api_client.patch(url)
   
        assert str(exc_info.value) == 'Simulated 500 status error'



    @pytest.mark.parametrize('mock_object, exception', [
        (User, User.DoesNotExist()),
        (Product, Product.DoesNotExist()),
    ])
    def test_patch_404_id_no_object(self, mock_object, exception, api_client, create_rate, create_user, create_product):

        with patch(f'amazonApp.views_folder.rate_views.{mock_object.__name__}.objects.get') as mock_patch:
            mock_patch.side_effect = exception

            rate = create_rate
            product = create_product

            url = reverse('rate-update', kwargs={'pid': product.id, 'rate': rate.rate})

            with pytest.raises(Exception) as exc_info:
                response = api_client.patch(url, format='json')

                assert response.status_code == status.HTTP_404_NOT_FOUND
                assert str(exc_info.value) == 'Simulated error'  


'''    def test_patch_200(self, api_client, create_rate, create_user, create_product, valid_access_token):
        rate = create_rate
        user = create_user
        product = create_product

        # Ensure that the user has bought the product
        product.bought_by_rec.set([user])
        print(product.bought_by_rec)

        api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {valid_access_token}')
        url = reverse('rate-update', kwargs={'pid': product.id, 'rate': rate.rate})

        response = api_client.patch(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data == {"status": True}


    @patch('amazonApp.views_folder.rate_views.Rate.objects.get')
    def test_get_id_404(self, mock_get, api_client, create_user, create_product):
        user = create_user
        product = create_product

        mock_get.side_effect = Rate.DoesNotExist("Object does not exist")

        url = reverse('rate-by-id', kwargs={'user_id': user.id, 'pid': product.id})
        response = api_client.get(url)

        print(response.data)

        assert response.data == {"error": "Object does not exist"}

        '''
