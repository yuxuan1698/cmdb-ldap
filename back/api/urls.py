# file: api/urls.py
from django.contrib import admin
from django.urls import path
from django.conf.urls import url, include
from rest_framework import routers
# from rest_framework.authtoken import views as drf_views
from . import views
router = routers.DefaultRouter()
router.register(r'get', views.GetUserViewSet)
urlpatterns = [
    path('groups/', include(router.urls)),]