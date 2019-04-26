from django.contrib.auth.models import Group
from django.http import JsonResponse
from authentication.serializers import (
  LdapUserSerializer, 
  GroupSerializer,
  LdapSerializer,
  ChangePasswordSerializer,
  DeleteUserSerializer,
  CreateUserSerializer
)
from authentication.ldap.ldapsearch import CmdbLDAP
from common.utils import LDAPJSONEncoder

# from rest_framework_jwt.utils import jwt_decode_handler
from django.contrib.auth import get_user_model
from django.conf import settings

from rest_framework_jwt.views import ObtainJSONWebToken
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView
from rest_framework import status

from common.utils import CmdbLDAPLogger


logger=CmdbLDAPLogger().get_logger('cmdb_ldap')


Users = get_user_model()

class LoginViewSet(ObtainJSONWebToken):
  """用户登陆接口"""
  
class UserListViewSet(APIView):
  """
  允许用户查看或编辑的API路径。
  """
  # serializer_class=LdapSerializer
  def get(self,request, *args, **kwargs):
    """ 
    获取所有用户的列表信息
    """
    user_list,errorMsg=CmdbLDAP().get_user_list()
    if user_list:
      page=PageNumberPagination()
      page_roles=page.paginate_queryset(queryset=user_list,request=request,view=self)
      return JsonResponse(user_list,encoder=LDAPJSONEncoder,safe=False)
    else:
      return JsonResponse({'error':errorMsg},encoder=LDAPJSONEncoder,status=status.HTTP_400_BAD_REQUEST,safe=False)

class CreateUserViewSet(APIView):
  """
  创建用户
  """
  serializer_class = CreateUserSerializer
  def post(self,request, *args, **kwargs):
    """
    提交用户数据
    """
    serializer = CreateUserSerializer(instance=request, data=request.data)
    if serializer.is_valid():
      changeStatus, errorMsg = CmdbLDAP().create_ldap_user(request.data)
      if changeStatus:
        returnData = {"status": changeStatus}
        returnStatus = status.HTTP_200_OK
      else:
        returnData = {"error": errorMsg}
        returnStatus = status.HTTP_400_BAD_REQUEST
    else:
      returnData = serializer.errors
      returnStatus = status.HTTP_400_BAD_REQUEST
    return JsonResponse(returnData, status=returnStatus, safe=False)

class DeleteUserViewSet(APIView):
  """
  删除用户
  """
  serializer_class = DeleteUserSerializer
  def post(self,request, *args, **kwargs):
    """
    提交用户数据
    """
    serializer = DeleteUserSerializer(instance=request, data=request.data)
    if serializer.is_valid():
      changeStatus, errorMsg = CmdbLDAP().delete_ldap_user(request.data)
      if changeStatus:
        returnData = {"status": changeStatus}
        returnStatus = status.HTTP_200_OK
      else:
        returnData = {"error": errorMsg}
        returnStatus = status.HTTP_400_BAD_REQUEST
    else:
      returnData = serializer.errors
      returnStatus = status.HTTP_400_BAD_REQUEST
    return JsonResponse(returnData, status=returnStatus, safe=False)

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

class GetLdapAllCLassListViewSet(APIView):
  """
  允许用户查看或编辑的API路径。
  """
  # serializer_class=LdapUserSerializer
  def get(self,request,*args,**kwargs):
    """
    根据用户获取用户信息
    """
    attrsOrClass,errorMsg=CmdbLDAP().get_attrsorclass_list()
    if attrsOrClass:
      return JsonResponse(attrsOrClass,encoder=LDAPJSONEncoder,safe=False)
    else:
      return JsonResponse(errorMsg,encoder=LDAPJSONEncoder,status=status.HTTP_400_BAD_REQUEST,safe=False)

class GetLdapAllAttrsListViewSet(APIView):
  """
  允许用户查看或编辑的API路径。
  """
  # serializer_class=LdapUserSerializer
  def get(self,request,*args,**kwargs):
    """
    根据用户获取用户信息
    """
    attrsOrClass,errorMsg=CmdbLDAP().get_attrsorclass_list(type='attr')
    if attrsOrClass:
      return JsonResponse(attrsOrClass,encoder=LDAPJSONEncoder,safe=False)
    else:
      return JsonResponse(errorMsg,encoder=LDAPJSONEncoder,status=status.HTTP_400_BAD_REQUEST,safe=False)
class getLDAPOUListViewSet(APIView):
  """
  获取 Base OU信息
  """
  def get(self,request,*args,**kwargs):
    if kwargs:
      queryOU='ou=%s,%s'%(kwargs.get('ou'),settings.AUTH_LDAP_BASE_DN)
    else:
      queryOU=settings.AUTH_LDAP_BASE_DN
    ous,errorMsg=CmdbLDAP().get_base_ou(queryOU)
    if ous:
      return JsonResponse(ous,encoder=LDAPJSONEncoder,safe=False)
    else:
      return JsonResponse({"error":errorMsg},encoder=LDAPJSONEncoder,status=status.HTTP_400_BAD_REQUEST,safe=False)
    
class UserChangerPasswordSet(APIView):
  """
  修改用户密码
  """
  serializer_class=ChangePasswordSerializer
  def post(self,request,*args,**kwargs):
    serializer=ChangePasswordSerializer(instance=request,data=request.data)
    if serializer.is_valid():
      changeStatus,errorMsg=CmdbLDAP().change_self_password(request.data)
      if changeStatus==True:
        returnData={"status":"密码修改成功！"}
        returnStatus=status.HTTP_200_OK
      else:
        # logger.info(changeStatus)
        returnData={"error":errorMsg}
        returnStatus=status.HTTP_400_BAD_REQUEST
    else:
      returnData=serializer.errors
      returnStatus=status.HTTP_400_BAD_REQUEST
    return JsonResponse(returnData,status=returnStatus,safe=False)
    
class GroupViewSet(APIView):
  """
  允许组查看或编辑的API路径。
  """
  queryset = Group.objects.all()
  serializer_class = GroupSerializer
