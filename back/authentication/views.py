from django.contrib.auth.models import Group
from django.http import JsonResponse
from authentication.serializers import (
  LdapUserSerializer, 
  GroupSerializer,
  LdapSerializer,
  ChangePasswordSerializer,
  DeleteUserSerializer,
  CreateUserSerializer,
  UpdateDNSerializer,
  CreateDNSerializer,
  DeleteDNSerializer,
  UpdateUserSerializer,
  LockUnLockUserSerializer
)
from authentication.ldap.ldapsearch import CmdbLDAP

# from rest_framework_jwt.utils import jwt_decode_handler
from django.contrib.auth import get_user_model
from django.conf import settings

from rest_framework_jwt.views import ObtainJSONWebToken
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView
from rest_framework import status
from django.core.cache import cache

from common.utils import CmdbLDAPLogger,LDAPJSONEncoder
from authentication.utils import user_payload_handler
from crontasks.tasks import send_register_email
from django.contrib.auth.decorators import permission_required

logger=CmdbLDAPLogger().get_logger('cmdb_ldap')


Users = get_user_model()

cmdbldap={
  "getClasses":CmdbLDAP(),
  "getUsers":CmdbLDAP(),
  "getOUDN":CmdbLDAP(),
  "updateDN":CmdbLDAP(),
  "createDN":CmdbLDAP(),
  "deleteDN":CmdbLDAP(),
  "all":CmdbLDAP()
}
# threadlock=False
class LoginViewSet(ObtainJSONWebToken):
  """用户登陆接口"""
  
class UserListViewSet(APIView):
  """
  允许用户查看或编辑的API路径。
  """
  # serializer_class=LdapSerializer
  # @permission_required('user.change_permission')
  def get(self,request, *args, **kwargs):
    """ 
    获取所有用户的列表信息
    """
    user_list,errorMsg=cmdbldap['getUsers'].get_user_list()
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
      # serializer.validated_data
      changeStatus,errorMsg,newUserDn,newUser = cmdbldap['all'].create_ldap_user(request.data)
      if changeStatus:
        returnData = {"status": changeStatus}
        dbdata=user_payload_handler(request.data,newUserDn,newUser)
        dbUsers = Users(**dbdata)
        dbUsers.set_password(request.data['userPassword'])
        dbUsers.save()
        if 'mail' in request.data and changeStatus :
          reqdata={
            "mail":request.data['mail'],
            "sn":request.data['sn'],
            "userPassword":request.data['userPassword'],
            "username": newUser
            }
          send_register_email.delay(reqdata['mail'],reqdata,newUser)
        returnStatus = status.HTTP_200_OK
      else:
        returnData = {"error": errorMsg}
        returnStatus = status.HTTP_400_BAD_REQUEST
    else:
      returnData = serializer.errors
      returnStatus = status.HTTP_400_BAD_REQUEST
    return JsonResponse(returnData, status=returnStatus, safe=False)

class UpdateUserViewSet(APIView):
  """
  更新用户
  """
  serializer_class = UpdateUserSerializer
  def post(self,request, *args, **kwargs):
    """
    提交用户数据
    """
    serializer = UpdateUserSerializer(instance=request, data=request.data)
    if serializer.is_valid():
      olddn=request.data['userdn']
      request.data.pop('userdn')
      changeStatus, errorMsg = cmdbldap['all'].update_ldap_user(request.data,olddn)
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
    删除用户
    """
    serializer = DeleteUserSerializer(instance=request, data=request.data)
    if serializer.is_valid():
      changeStatus, errorMsg = cmdbldap['all'].delete_ldap_userdn(request.data)
      if changeStatus:
        usernames = []
        for udn in request.data.get('userdn'):
          usernames.append(udn.split(',')[0].split("=")[1])
        Users.objects.filter(username__in=usernames).delete()
        returnData = {"status": changeStatus}
        returnStatus = status.HTTP_200_OK
      else:
        returnData = {"error": errorMsg}
        returnStatus = status.HTTP_400_BAD_REQUEST
    else:
      returnData = serializer.errors
      returnStatus = status.HTTP_400_BAD_REQUEST
    return JsonResponse(returnData, status=returnStatus, safe=False)

class UserAttributeByViewSet(APIView):
  """
  允许用户查看或编辑的API路径。
  """
  # serializer_class=LdapUserSerializer
  def get(self,request,*args,**kwargs):
    """
    根据用户获取用户信息
    """
    username=kwargs.get('username')
    userattrs=cmdbldap['all'].get_user_list(username,['*','+'])
    return JsonResponse(userattrs[0],encoder=LDAPJSONEncoder,safe=False)

class UserPermissionListByViewSet(APIView):
  """
  获取用户权限列表
  """
  # serializer_class=LdapUserSerializer
  def get(self,request,*args,**kwargs):
    """
    根据用户获取用户信息
    """
    userdn=kwargs.get('userdn')
    userattrs=CmdbLDAP().get_user_permissions(userdn)
    return JsonResponse(userattrs[0],encoder=LDAPJSONEncoder,safe=False)

class SavePermissionListByViewSet(APIView):
  """
  获取用户权限列表
  """
  def post(self,request,*args,**kwargs):
    """
    根据用户获取用户信息
    """
    logger.info(request.data)
    # userdn=kwargs.get('userdn')
    # userattrs=CmdbLDAP().get_user_permissions(userdn)
    return JsonResponse('a',encoder=LDAPJSONEncoder,safe=False)

class GetLdapAllCLassListViewSet(APIView):
  """
  获取所有LDAP的CLASSES名称及字段信息
  """
  # serializer_class=LdapUserSerializer
  def get(self,request,*args,**kwargs):
    """
    获取所有LDAP的CLASSES名称及字段信息
    """
    attrsOrClass=cache.get('attrsOrClass')
    if not attrsOrClass:
      attrsOrClass,errorMsg=cmdbldap['getClasses'].get_attrsorclass_list()
      cache.set('attrsOrClass',attrsOrClass)
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
    attrsOrClass,errorMsg=cmdbldap['all'].get_attrsorclass_list(type='attr')
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
      queryOU=kwargs.get('baseou')
    else:
      queryOU=settings.AUTH_LDAP_BASE_DN
    ous,errorMsg=CmdbLDAP().get_base_ou(queryOU)
    logger.info(errorMsg)
    if len(ous)>0:
      return JsonResponse(ous,encoder=LDAPJSONEncoder,safe=False)
    else:
      return JsonResponse({"error":errorMsg},encoder=LDAPJSONEncoder,status=status.HTTP_400_BAD_REQUEST,safe=False)
class getLDAPPermissionGroupsListViewSet(APIView):
  """
  获取 权限控制Groups OU信息
  """
  def get(self,request,*args,**kwargs):
    queryOU=settings.AUTH_LDAP_GROUP_SEARCH_OU
    ous,errorMsg=CmdbLDAP().get_base_ou(queryOU)
    logger.info(errorMsg)
    if len(ous)>0:
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
      changeStatus,errorMsg=cmdbldap['all'].change_self_password(request.data)
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


class UpdateDNViewSet(APIView):
  """
  更新用户
  """
  serializer_class = UpdateDNSerializer
  def post(self,request, *args, **kwargs):
    """
    提交用户数据
    """
    serializer = UpdateDNSerializer(instance=request, data=request.data)
    if serializer.is_valid():
      olddn=request.data['currentDn']
      request.data.pop('currentDn')
      changeStatus, errorMsg = cmdbldap['updateDN'].update_ldap_dn(request.data,olddn)
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

class CreateDNViewSet(APIView):
  """
  更新用户
  """
  serializer_class = CreateDNSerializer
  def post(self,request, *args, **kwargs):
    """
    提交用户数据
    """
    serializer = CreateDNSerializer(instance=request, data=request.data)
    if serializer.is_valid():
      parentDn=request.data['currentDn']
      request.data.pop('currentDn')
      changeStatus, errorMsg = cmdbldap['createDN'].create_ldap_entry_dn(request.data,parentDn)
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


class DeleteDNViewSet(APIView):
  """
  删除用户
  """
  serializer_class = DeleteDNSerializer

  def post(self, request, *args, **kwargs):
    """
    删除用户
    """
    serializer = DeleteDNSerializer(instance=request, data=request.data)
    if serializer.is_valid():
      changeStatus, errorMsg = cmdbldap['deleteDN'].delete_ldap_dn(
          request.data)
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


class LockUnLockUserViewSet(APIView):
  """
  锁定/解锁用户
  """
  serializer_class = LockUnLockUserSerializer
  def post(self,request, *args, **kwargs):
    """
    锁定/解锁用户
    """
    serializer = LockUnLockUserSerializer(instance=request, data=request.data)
    if serializer.is_valid():
      logger.info(request.data)
      changeStatus, errorMsg = cmdbldap['all'].lock_unlock_ldap_user(request.data)
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
