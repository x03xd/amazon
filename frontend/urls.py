from django.urls import path
from .views import HomePage, LogoutView, Store, Lobby, CartView


urlpatterns = [

    path('', HomePage.as_view(), name = 'home'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('s/', Store.as_view(), name = "s"),
    path('l/<slug:slug>/', Lobby.as_view()),
    path('card/', CartView.as_view()),

]