# file: api/urls.py
from django.contrib import admin
from django.urls import path
# from rest_framework.authtoken import views as drf_views
from rest_framework_jwt.views import obtain_jwt_token
from .views import UserViewSet,GroupViewSet

urlpatterns = [
    path('login/', obtain_jwt_token,name='auth-login'),
    path('user-list/', UserViewSet.as_view({'get': 'userlist'}),name='user-list'),
    path('user-attr/', UserViewSet.as_view({'get': 'userattrby'}),name='user-attr'),
    path('user-changepassword/', UserViewSet.as_view({'post': 'changepassword'}),name='user-changepassword'),
    path('logout/', obtain_jwt_token,name='auth-logout'),
    ]