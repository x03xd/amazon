from django.shortcuts import render

from django.shortcuts import render
from django.views.generic import TemplateView, View
import json
from django.views.generic.base import TemplateResponseMixin
from django.views.generic.detail import DetailView
from .models import User

from django.http.response import JsonResponse, HttpResponse
from django.contrib.auth import login, logout, authenticate
from django.shortcuts import render, redirect

from django.views.generic.edit import CreateView
class HomePage(TemplateView):
    template_name = 'index.html'

class Authentication(TemplateView):
    template_name = 'index.html'

    def post(self, request, *args, **kwargs):

        username = request.POST.get('username')

        try:
            user = User.objects.get(username = username)

        except:
            pass

        user = authenticate(request, username = username, password = "123")
        if user is not None:
            login(request, user)
            return redirect("/")
        return redirect("/")





class LogoutView(View):
    def get(self, request, *args, **kwargs):
        logout(request)
        return redirect("/")
