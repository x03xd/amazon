from django.urls import path

from amazonApp.views_folder import views
from amazonApp.views_folder import auth_views
from amazonApp.views_folder import rate_views
from amazonApp.views_folder import edit_user_views
from amazonApp.views_folder import cart_views
from amazonApp.views_folder import currencies_views
from amazonApp.views_folder import transactions_views
from amazonApp.views_folder import filter_products_views

from amazonApp.views_folder.auth_views import MyTokenObtainPairView
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)


urlpatterns = [
    #PRODUCTS FILTER
    path("products/<id>/", filter_products_views.ProductsAPI.as_view()),

    #AUTHENTICATION
    path("registration/", auth_views.RegisterSystem.as_view(), name="register"),
    path('logout/', auth_views.LogoutView.as_view(), name="logout"),
    path("login/<data>", auth_views.LoginAPI.as_view(), name="login"),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    #RATE
    path('avg-rate/', rate_views.CountAvgRate.as_view(), name="avg-rate"),
    path('rate-product/<id>/<pid>/<rate>', rate_views.RateProduct.as_view(), name='rate-product'),
    path("delete-rate/", rate_views.DeleteRate.as_view(), name='delete-rate'),

    #USER_EDIT
    path("edit-username/<id>", edit_user_views.EditUsername.as_view()),
    path("edit-email/<id>", edit_user_views.EditEmail.as_view()),
    path("change-password/<id>", edit_user_views.EditPassword.as_view()),
    path("access-to-change-status/<id>", edit_user_views.AccessToChangeStatus.as_view()),

    #CART
    path("process/", cart_views.ProcessAPI.as_view(), name="process"),
    path("remove-item/", cart_views.RemoveItemCart.as_view(), name="remove-item"),
    path("cart/<user_id>", cart_views.CartAPI.as_view(), name="cart"),

    #TRANSACTIONS
    path("finalize-order/", transactions_views.FinalizeOrder.as_view()),
    path("transactions/<id>", transactions_views.TransactionsAPI.as_view()),
    path("products-from-transactions/", transactions_views.ProductsFromTransactions.as_view()),

    #CURRENCIES
    path("currency-converter/<id>", currencies_views.CurrencyConverterAPI.as_view(), name="currency-converter"),

    #REST
    path("categories/", views.CategoriesAPI.as_view(), name="categories"),
    path("brands/<category>", views.BrandsByCategoriesAPI.as_view(), name="brands-by-categories"),
    path("brand/<id>", views.BrandsByIdAPI.as_view(), name="brand-by-id"),
    path("recommendations/<username>/<id>/<user_id>", views.Recommendations.as_view(), name="recommendations"),
    path("lobby-price-mod/<user_id>/<product_id>", views.LobbyPriceMod.as_view(), name="lobby-price"),
]

