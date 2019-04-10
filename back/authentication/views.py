from django.contrib.auth.models import Group
from rest_framework.viewsets import GenericViewSet
from rest_framework import status
from authentication.serializers import (
  LdapUserSerializer, 
  GroupSerializer,
  ChangePasswordSerializer
)

from authentication.ldap.ldapsearch import CmdbLDAP
from common.utils import LDAPJSONEncoder
from django.http import JsonResponse
# from rest_framework_jwt.utils import jwt_decode_handler
from django.contrib.auth import get_user_model
from rest_framework.serializers import HyperlinkedModelSerializer
from django.conf import settings
from rest_framework_jwt.views import ObtainJSONWebToken
Users = get_user_model()

from rest_framework.views import APIView

class LoginViewSet(ObtainJSONWebToken):
  """用户登陆接口"""
  
class UserListViewSet(APIView):
  """
  允许用户查看或编辑的API路径。
  """
  # serializer_class=LdapUserSerializer
  def get(self,request, *args, **kwargs):
    """ 
    获取所有用户的列表信息
    """
    user_list=CmdbLDAP().get_user_list()
    return JsonResponse(user_list,encoder=LDAPJSONEncoder,safe=False)
class UserListByViewSet(APIView):
  """
  允许用户查看或编辑的API路径。
  """
  # serializer_class=LdapUserSerializer
  def get(self,request,*args,**kwargs):
    """
    根据用户获取用户信息
    """
    userattrs=CmdbLDAP().get_user_list(request.user)
    return JsonResponse(userattrs,encoder=LDAPJSONEncoder,safe=False)

class UserChangerPasswordSet(APIView):
  """
  修改用户密码
  """
  serializer_class=ChangePasswordSerializer
  def post(self,request,*args,**kwargs):
    if request.data.get('username')==None or str(request.user)!=str(request.data['username']):
      return JsonResponse({'error': '提交的用户非法！'},status=status.HTTP_400_BAD_REQUEST,safe=False)
    serializer=ChangePasswordSerializer(data=request.data)
    if serializer.is_valid():
      # todo
      changeStatus=CmdbLDAP().change_self_password(request.data)
      if changeStatus==True:
        returnData={"status":"success"}
        returnStatus=status.HTTP_200_OK
      else:
        # logger.info(changeStatus)
        returnData={"error":changeStatus}
        returnStatus=status.HTTP_400_BAD_REQUEST
    else:
      returnData={'error':serializer.errors}
      returnStatus=status.HTTP_400_BAD_REQUEST
    return JsonResponse(returnData,status=returnStatus,safe=False)
    
class GroupViewSet(GenericViewSet):
  """
  允许组查看或编辑的API路径。
  """
  queryset = Group.objects.all()
  serializer_class = GroupSerializer
