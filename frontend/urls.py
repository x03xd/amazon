from django.urls import path
from .views import Authentication, HomePage, LogoutView, Authentication2, Store, Lobby, Card, Process
from . import views

urlpatterns = [

    path('', HomePage.as_view(), name = 'home'),
    path('login/', Authentication.as_view(), name='login'),
    path('login2/', Authentication2.as_view(), name='login2'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('s/', Store.as_view()),
    path('l/<slug:slug>/', Lobby.as_view()),
    path('card/', Card.as_view(), name = 'card'),
    path('process/', Process.as_view(), name = 'process'),
]