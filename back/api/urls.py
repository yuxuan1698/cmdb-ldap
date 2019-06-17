# from django.contrib import admin
from django.urls import path
from django.conf.urls import include
from rest_framework import routers
# from rest_framework.authtoken import views as drf_views
from .views import (
    getCrontabLogsViewSet,
    getAliCloundEcsListSet,
    getAliCloundRegionListSet
    )
urlpatterns = [
    path('system/cronlogs/', getCrontabLogsViewSet.as_view(),name='system-mailresults'),
    path('device/aliclound/ecs/', getAliCloundEcsListSet.as_view(),name='device-aliclound-ecs'),
    path('device/aliclound/regions/', getAliCloundRegionListSet.as_view(),name='device-aliclound-regions'),
]