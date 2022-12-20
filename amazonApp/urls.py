from django.urls import path
from . import views



urlpatterns = [
    path("products/", views.ProductsAPI.as_view()),
    path("categories/", views.CategoriesAPI.as_view()),
    path("subcategories/", views.SubCategoriesAPI.as_view()),
    path("process/", views.ProcessAPI.as_view()),
    path("login/", views.LoginAPI.as_view()),
    path("login2/", views.Login2API.as_view()),
    path("cart/", views.CardAPI.as_view()),
    path("products-by-subs/", views.ProductsBySubsAPI.as_view()),
    path("registration/", views.RegisterSystem.as_view()),

    path('get-user/', views.getUser.as_view()),

]
