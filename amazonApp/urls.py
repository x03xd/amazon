from django.urls import path
from . import views


urlpatterns = [
    path("products/", views.ProductsAPI.as_view()),
    path("categories/", views.CategoriesAPI.as_view()),
    path("subcategories/", views.SubCategoriesAPI.as_view()),
]