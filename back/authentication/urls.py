# file: api/urls.py
from django.contrib import admin
from django.urls import path
from django.conf.urls import url
# from rest_framework.authtoken import views as drf_views
from rest_framework_jwt.views import obtain_jwt_token
from .views import (
    UserListViewSet,
    UserListByViewSet,
    LoginViewSet,
    getLDAPOUListViewSet,
    GetLdapAllCLassListViewSet,
    GetLdapAllAttrsListViewSet,
    UserChangerPasswordSet
)
from rest_framework_jwt.views import obtain_jwt_token

app_name='authentication'

urlpatterns = [
    path('login/', LoginViewSet.as_view(),name='auth-login'),
    url(r'ldap/ous/$', getLDAPOUListViewSet.as_view(),name='ldap-classes'),
    url(r'ldap/ous/(?P<ou>\w+)/$', getLDAPOUListViewSet.as_view(),name='ldap-classes'),
    path('ldap/classes/', GetLdapAllCLassListViewSet.as_view(),name='ldap-classes'),
    path('ldap/attrs/', GetLdapAllAttrsListViewSet.as_view(),name='ldap-attrs'),
    path('ldap/user/list/', UserListViewSet.as_view(),name='ldap-userlist'),
    path('ldap/user/attr/', UserListByViewSet.as_view(),name='ldap-userattr'),
    path('ldap/user/changepassword/', UserChangerPasswordSet.as_view(),name='ldap-changepassword'),
    path('logout/', obtain_jwt_token,name='auth-logout'),
    ]