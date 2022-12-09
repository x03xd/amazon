from django.urls import path
from . import views


urlpatterns = [
    path("products/", views.ProductsAPI.as_view()),
    path("products-by-subs/", views.ProductsBySubsAPI.as_view()),
    path("categories/", views.CategoriesAPI.as_view()),
    path("subcategories/", views.SubCategoriesAPI.as_view()),
    path("test/", views.TestAPI.as_view()),
    path("process/", views.ProcessAPI.as_view())
]