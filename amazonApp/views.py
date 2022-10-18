from django.shortcuts import render
from django.views.generic import TemplateView, View
import json
from django.views.generic.base import TemplateResponseMixin
from django.views.generic.detail import DetailView
from .models import User
#template = "index.html"
from django.http.response import JsonResponse, HttpResponse
from django.contrib.auth import login, logout, authenticate
from django.shortcuts import render, redirect
from .models import User, Test
class HomePage(TemplateView):
    template_name = "index.html"


class Authentication(TemplateView, View):
    template_name = 'index.html'
    def post(self, request, *args, **kwargs):

        user = User.objects.get(username = 'admin')
        user.email = "siema@o2.pl"
        user.save()
        return redirect("http://127.0.0.1:8000/")


class LogoutView(View):
    def get(self, request, *args, **kwargs):
        logout(request)
        return redirect("/")
