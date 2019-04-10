# from django.contrib import admin
from django.urls import path
from django.conf.urls import include
from rest_framework import routers
# from rest_framework.authtoken import views as drf_views
from .views import GetGroupViewSet
urlpatterns = [
    path('groups/', GetGroupViewSet.as_view({'get':'listgroups'}),name='user-groups'),
]