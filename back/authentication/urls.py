# file: api/urls.py
from django.contrib import admin
from django.urls import path
from django.conf.urls import url
# from rest_framework.authtoken import views as drf_views
from rest_framework_jwt.views import obtain_jwt_token
from .views import (
    UserListViewSet,
    UserAttributeByViewSet,
    LoginViewSet,
    getLDAPOUListViewSet,
    GetLdapAllCLassListViewSet,
    GetLdapAllAttrsListViewSet,
    UserChangerPasswordSet,
    CreateUserViewSet,
    UpdateUserViewSet,
    UpdateDNViewSet,
    DeleteUserViewSet
)
from rest_framework_jwt.views import obtain_jwt_token

app_name='authentication'

urlpatterns = [
    path('login/', LoginViewSet.as_view(),name='auth-login'),
    url(r'ldap/ous/$', getLDAPOUListViewSet.as_view(),name='ldap-ous'),
    url(r'ldap/ous/(?P<baseou>[^/]+)/$', getLDAPOUListViewSet.as_view(),name='ldap-ous-other'),
    path('ldap/classes/', GetLdapAllCLassListViewSet.as_view(),name='ldap-classes'),
    path('ldap/attrs/', GetLdapAllAttrsListViewSet.as_view(),name='ldap-attrs'),
    path('ldap/user/createuser/', CreateUserViewSet.as_view(),name='ldap-createuser'),
    path('ldap/user/updateuser/', UpdateUserViewSet.as_view(),name='ldap-updateuser'),
    path('ldap/user/deleteuser/', DeleteUserViewSet.as_view(),name='ldap-deleteuser'),
    path('ldap/user/list/', UserListViewSet.as_view(),name='ldap-userlist'),
    url(r'ldap/user/attr/(?P<username>[^/]+)/', UserAttributeByViewSet.as_view(),name='ldap-userattr'),
    url(r'ldap/dn/update/', UpdateDNViewSet.as_view(),name='ldap-dnupdate'),
    path('ldap/user/changepassword/', UserChangerPasswordSet.as_view(),name='ldap-changepassword'),
    path('logout/', obtain_jwt_token,name='auth-logout'),
    ]