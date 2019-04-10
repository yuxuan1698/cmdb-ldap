# file: api/urls.py
from django.contrib import admin
from django.urls import path
# from rest_framework.authtoken import views as drf_views
from rest_framework_jwt.views import obtain_jwt_token
from .views import (
    UserListViewSet,
    UserListByViewSet,
    LoginViewSet,
    UserChangerPasswordSet
)
from rest_framework_jwt.views import obtain_jwt_token

app_name='authentication'

urlpatterns = [
    path('login/', LoginViewSet.as_view(),name='auth-login'),
    path('user/list/', UserListViewSet.as_view(),name='user-list'),
    path('user/attr/', UserListByViewSet.as_view(),name='user-attr'),
    path('user/changepassword/', UserChangerPasswordSet.as_view(),name='user-changepassword'),
    path('logout/', obtain_jwt_token,name='auth-logout'),
    ]