from django.urls import path
from .views import HomePage, Store, Lobby, CartView


urlpatterns = [

    path('', HomePage.as_view(), name = 'home'),
    path('s/', Store.as_view(), name = "s"),
    path('l/<slug:slug>/', Lobby.as_view()),
    path('card/', CartView.as_view()),

]