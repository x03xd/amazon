from django.shortcuts import render

from django.shortcuts import render
from django.views.generic import TemplateView, View
import json
from django.views.generic.base import TemplateResponseMixin
from django.views.generic.detail import DetailView
from .models import User, Product, Test

from django.http.response import JsonResponse, HttpResponse
from django.contrib.auth import login, logout, authenticate
from django.shortcuts import render, redirect
from django.db.models import Q, F
from django.views.generic.edit import CreateView
from django.views.generic.edit import FormView, CreateView, UpdateView
from django.db.models.signals import post_save
from django.dispatch import receiver


@receiver(post_save, sender=User)
def create_favorites(sender, instance, created, **kwargs):
    if created:
        Cart.objects.create(owner=instance)



class Store(TemplateView):
    template_name = "index.html"


class HomePage(TemplateView):
    template_name = 'index.html'

class Authentication(TemplateView):
    template_name = 'index.html'


    def post(self, request, *args, **kwargs):

        json_data = json.load(request)

        try:
            user_object = User.objects.get(username = json_data['username'])
            return JsonResponse({'authenticated': 'true', 'email': user_object.email, 'username': json_data['username']})

        except User.DoesNotExist:

            return JsonResponse({'authenticated':'false'})


class Authentication2(TemplateView):
    template_name = 'index.html'

    def post(self, request, *args, **kwargs):

        json_data = json.load(request)

        try:
            user = User.objects.get(username = json_data['username'])

        except:
            pass

        user = authenticate(request, username = json_data['username'], password= json_data['password'])

        if user is not None:
            login(request, user)
            return JsonResponse({'password': 'correct'})

        else:
            return JsonResponse({'password': 'wrong'})

class LogoutView(View):
    def get(self, request, *args, **kwargs):
        logout(request)
        return redirect("/")


class Lobby(TemplateView):
    template_name = 'index.html'




class Cart(TemplateView):
    template_name = 'index.html'



class Process(TemplateView):
    template_name = 'index.html'

    def post(self, request, *args, **kwargs):

        try:
            json_data = json.load(request)["id"]
            product = Product.objects.get(id = json_data)

            cart = Test.objects.get(owner__username = "admin")
            cart.products.add(product)

            return JsonResponse({"done": True})

        except:
            return JsonResponse({"done": False})


