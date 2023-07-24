from django.urls import path
from . import views
from .views import MyTokenObtainPairView
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)


urlpatterns = [
    path("products/", views.ProductsAPI.as_view()),
    path("categories/", views.CategoriesAPI.as_view()),

    path("process/", views.ProcessAPI.as_view()),
    path("remove-item/", views.RemoveItemCart.as_view()),
    path("cart/", views.CartAPI.as_view()),

    path("brands/<category>", views.BrandsByCategoriesAPI.as_view()),
    path("brand/<id>", views.BrandsByIdAPI.as_view()),

    path('token/',MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path("registration/", views.RegisterSystem.as_view()),
    path('logout/', views.LogoutView.as_view()),
    path("login/", views.LoginAPI.as_view()),

    path('avg-rate/', views.CountAvgRate.as_view()),
    path('rate-product/<id>/<pid>/<rate>', views.RateProduct.as_view()),
    path("delete-rate/", views.DeleteRate.as_view()),
    path("edit-username/<id>", views.EditUsername.as_view()),
    path("edit-email/<id>", views.EditEmail.as_view()),
    path("edit-password/<id>", views.EditPassword.as_view()),

    path("finalize-order/", views.FinalizeOrder.as_view()),
    path("transactions/<id>", views.TransactionsAPI.as_view()),


    path("access-to-change-status/<id>", views.AccessToChangeStatus.as_view()),

    path("products-from-transactions/", views.ProductsFromTransactions.as_view())

]
