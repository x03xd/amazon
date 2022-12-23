from django.urls import path
from . import views
from .views import MyTokenObtainPairView
from rest_framework_simplejwt.views import (

    TokenRefreshView,
)

urlpatterns = [
    path("products/", views.ProductsAPI.as_view()),
    path("categories/", views.CategoriesAPI.as_view()),
    path("subcategories/", views.SubCategoriesAPI.as_view()),
    path("process/", views.ProcessAPI.as_view()),
    path("login/", views.LoginAPI.as_view()),
  #  path("login2/", views.Login2API.as_view()),
    path("cart/", views.CardAPI.as_view()),
    path("products-by-subs/", views.ProductsBySubsAPI.as_view()),
    path("registration/", views.RegisterSystem.as_view()),
    path('logout/', views.LogoutView.as_view()),

    path('token/',MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
