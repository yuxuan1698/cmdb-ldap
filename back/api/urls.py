# from django.contrib import admin
from django.urls import path
from django.conf.urls import include
from rest_framework import routers
# from rest_framework.authtoken import views as drf_views
from .views import getCrontabLogsViewSet
urlpatterns = [
    path('system/cronlogs/', getCrontabLogsViewSet.as_view(),name='system-mailresults'),
    # path('groups/', GetGroupViewSet.as_view({'get':'listgroups'}),name='user-groups'),
]