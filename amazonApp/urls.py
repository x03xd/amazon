from django.urls import path
from .views import Authentication, HomePage, LogoutView


urlpatterns = [

    path('', HomePage.as_view(), name = 'home'),
    path('login/', Authentication.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
]