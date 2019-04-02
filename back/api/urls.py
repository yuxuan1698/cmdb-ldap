# file: api/urls.py
from django.contrib import admin
from django.urls import path
from rest_framework.authtoken import views as drf_views

urlpatterns = [
    path('groups/', admin.site.urls,name='api-groups'),]