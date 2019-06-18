# from django.contrib import admin
from django.urls import path
from django.conf.urls import include
from rest_framework import routers
# from rest_framework.authtoken import views as drf_views
from .views import (
    getCrontabLogsViewSet,
    getAliCloundEcsListSet,
    getAliCloundRegionListSet,
    getAliCloundCerificateCountSet,
    getAliCloundCerificateListSet
    )
urlpatterns = [
    path('system/cronlogs/', getCrontabLogsViewSet.as_view(),name='system-mailresults'),
    path('aliclound/ecs/', getAliCloundEcsListSet.as_view(),name='aliclound-ecs'),
    path('aliclound/regions/', getAliCloundRegionListSet.as_view(),name='aliclound-regions'),
    path('aliclound/cerificate/list/',getAliCloundCerificateListSet.as_view(), name='aliclound-cerificate-list'),
    path('aliclound/cerificate/count/', getAliCloundCerificateCountSet.as_view(),name='aliclound-cerificate-count'),
]
