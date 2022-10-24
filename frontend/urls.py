from django.urls import path
from .views import Authentication, HomePage, LogoutView, Authentication2
from . import views

urlpatterns = [

    path('', HomePage.as_view(), name = 'home'),
    path('login/', Authentication.as_view(), name='login'),
    path('login2/', Authentication2.as_view(), name='login2'),
    path('logout/', LogoutView.as_view(), name='logout'),


]