
from django.views.generic import TemplateView



class Store(TemplateView):
    template_name = "index.html"


class HomePage(TemplateView):
    template_name = 'index.html'



class Lobby(TemplateView):
    template_name = 'index.html'


class CartView(TemplateView):
    template_name = 'index.html'




