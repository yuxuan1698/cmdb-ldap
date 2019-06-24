# from django.contrib import admin
from django.urls import path
from django.conf.urls import include
from rest_framework import routers
# from rest_framework.authtoken import views as drf_views
from .views import (
    getCrontabLogsViewSet,
    getAliCloundEcsListSet,
    getAliCloundEcsAllStatusSet,
    getAliCloundRegionListSet,
    getAliCloundCerificateCountSet,
    getAliCloundCerificateListSet,
    getAliCloundCerificateLocationsSet,
    getAliCloundTagsListSet
    )
urlpatterns = [
    path('system/cronlogs/', getCrontabLogsViewSet.as_view(),name='system-mailresults'),
    path('aliclound/ecs/list/', getAliCloundEcsListSet.as_view(),name='aliclound-ecs'),
    path('aliclound/ecs/allstatus/', getAliCloundEcsAllStatusSet.as_view(),name='aliclound-ecs'),
    path('aliclound/regions/list/', getAliCloundRegionListSet.as_view(),name='aliclound-regions'),
    path('aliclound/tags/list/',getAliCloundTagsListSet.as_view(), name='aliclound-cerificate-list'),
    path('aliclound/cerificate/list/',getAliCloundCerificateListSet.as_view(), name='aliclound-cerificate-list'),
    path('aliclound/cerificate/locations/',getAliCloundCerificateLocationsSet.as_view(), name='aliclound-cerificate-list'),
    path('aliclound/cerificate/count/', getAliCloundCerificateCountSet.as_view(),name='aliclound-cerificate-count'),
]
