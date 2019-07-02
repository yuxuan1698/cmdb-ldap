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
    getAliCloundTagsListSet,
    getCheckCerificateInvalidViewSet,
    getAliCloundEcsDomainListSet,
    getAliCloundDashboardStatusSet,
    getAliCloundAcountNameListSet
    )
urlpatterns = [
    path('system/cronlogs/', getCrontabLogsViewSet.as_view(),name='system-mailresults'),
    path('aliclound/account/namelist/', getAliCloundAcountNameListSet.as_view(),name='aliclound-account-list'),
    path('aliclound/dashborad/status/', getAliCloundDashboardStatusSet.as_view(),name='aliclound-dashboard-status'),
    path('aliclound/domain/list/', getAliCloundEcsDomainListSet.as_view(),name='aliclound-domain-list'),
    path('aliclound/ecs/list/', getAliCloundEcsListSet.as_view(),name='aliclound-ecs-list'),
    path('aliclound/ecs/allstatus/', getAliCloundEcsAllStatusSet.as_view(),name='aliclound-ecs-status'),
    path('aliclound/regions/list/', getAliCloundRegionListSet.as_view(),name='aliclound-regions'),
    path('aliclound/tags/list/',getAliCloundTagsListSet.as_view(), name='aliclound-cerificate-list'),
    path('aliclound/cerificate/list/',getAliCloundCerificateListSet.as_view(), name='aliclound-cerificate-list'),
    path('aliclound/cerificate/locations/',getAliCloundCerificateLocationsSet.as_view(), name='aliclound-cerificate-list'),
    path('aliclound/cerificate/count/', getAliCloundCerificateCountSet.as_view(),name='aliclound-cerificate-count'),
    path('aliclound/cerificate/invalid/', getCheckCerificateInvalidViewSet.as_view(),name='aliclound-cerificate-invalid'),
]
