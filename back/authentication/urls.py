# file: api/urls.py
from django.contrib import admin
from django.urls import path
from rest_framework.authtoken import views as drf_views

urlpatterns = [
    path('login/', drf_views.obtain_auth_token,name='auth-login'),
    path('logout/', drf_views.obtain_auth_token,name='auth-logout'),
    ]