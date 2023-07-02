from django.shortcuts import render

from django.shortcuts import render
from django.views.generic import TemplateView, View
import json
from django.views.generic.base import TemplateResponseMixin
from django.views.generic.detail import DetailView
from .models import User, Product, Cart

from django.http.response import JsonResponse, HttpResponse
from django.contrib.auth import login, logout, authenticate
from django.shortcuts import render, redirect
from django.db.models import Q, F
from django.views.generic.edit import CreateView
from django.views.generic.edit import FormView, CreateView, UpdateView
from django.db.models.signals import post_save
from django.dispatch import receiver

from rest_framework.response import Response
from django.http.response import JsonResponse



class Store(TemplateView):
    template_name = "index.html"


class HomePage(TemplateView):
    template_name = 'index.html'



class Lobby(TemplateView):
    template_name = 'index.html'


class CartView(TemplateView):
    template_name = 'index.html'




