# from django.contrib.auth.models import Group
from django.http import JsonResponse
from authentication.serializers import (
  LdapUserSerializer, 
  GroupSerializer,
  LdapSerializer,
  ChangePasswordSerializer,
  ResetPasswordSerializer,
  DeleteUserSerializer,
  CreateUserSerializer,
  UpdateDNSerializer,
  CreateDNSerializer,
  DeleteDNSerializer,
  UpdateUserSerializer,
  LockUnLockUserSerializer,
  LDIFScriptsSerializer
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

from common.utils import CmdbLDAPLogger,LDAPJSONEncoder,generat_random_password
from authentication.utils import user_payload_handler
from crontasks.tasks import send_register_email,send_reset_password_email,send_reset_sshkey_email
from django.contrib.auth.decorators import permission_required
logger=CmdbLDAPLogger().get_logger('cmdb_ldap')


Users = get_user_model()

# cmdbldap = CmdbLDAP()
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
    user_list, errorMsg = CmdbLDAP().get_user_list()
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
      changeStatus,errorMsg,newUserDn,newUser = CmdbLDAP().create_ldap_user(request.data)
      if changeStatus:
        returnData = {"status": changeStatus}
        dbdata=user_payload_handler(request.data,newUserDn,newUser)
        dbUsers = Users(**dbdata)
        dbUsers.set_password(request.data['userPassword'])
        dbUsers.save()
        if 'mail' in request.data and changeStatus :
          reqdata={
            "sn":request.data['sn'],
            "userPassword":request.data['userPassword'],
            "username": newUser
            }
          send_register_email.delay(request.data['mail'],reqdata)
          logger.info("正发送用户的注册相关信息到用户[%s]"%newUser)
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
      userid=olddn.split(",")[0].split("=")[0]
      username=olddn.split(",")[0].split("=")[1]
      newUserid=request.data[userid]
      changeStatus, errorMsg = CmdbLDAP().update_ldap_user(request.data,olddn)
      if changeStatus:
        if newUserid == username:
          newdn=olddn
        else:
          try:
            Users.objects.get(username=username,userdn=olddn).delete()
          except Exception as e:
            logger.warn(e)
          username=newUserid
          newdn=olddn.replace("=%s,"%username,"%s,"%newUserid)
        if "sshPublicKey" in request.data and cache.get("user_%s_public_key"%username):
          dbdata={
            "username":username,
            "userdn": newdn, 
            "publickey":cache.get("user_%s_public_key"%username),
            "privatekey":cache.get("user_%s_private_key"%username),
            }
          if "mail" in request.data:
            dbdata['email']=request.data['mail']
            sendmailuser={
              "username":username,
              "email":request.data.get("mail"),
              }
            send_reset_sshkey_email.delay(sendmailuser)
          Users.objects.update_or_create(defaults=dbdata,username=username)
          
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
      changeStatus, errorMsg = CmdbLDAP().delete_ldap_userdn(request.data)
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
    userattrs=CmdbLDAP().get_user_list(username,['*','+'])
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
    userattrs,errMsg=CmdbLDAP().get_user_permissions(userdn)
    # return JsonResponse(userattrs[0],encoder=LDAPJSONEncoder,safe=False)
    if userattrs:
      return JsonResponse(userattrs,encoder=LDAPJSONEncoder,safe=False)
    else:
      return JsonResponse(errMsg,encoder=LDAPJSONEncoder,status=status.HTTP_400_BAD_REQUEST,safe=False)

class SavePermissionListByViewSet(APIView):
  """
  获取用户权限列表
  """
  def post(self,request,*args,**kwargs):
    """
    根据用户获取用户信息
    """
    permissionData=request.data
    success,errmsg = CmdbLDAP().save_permissions_group(permissionData)
    if success:
      return JsonResponse({'status':success},encoder=LDAPJSONEncoder,safe=False)
    else:
      return JsonResponse(errmsg,encoder=LDAPJSONEncoder,status=status.HTTP_400_BAD_REQUEST,safe=False)

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
      attrsOrClass,errorMsg=CmdbLDAP().get_attrsorclass_list()
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
      queryOU=kwargs.get('baseou')
    else:
      queryOU=settings.AUTH_LDAP_BASE_DN
    ous,errorMsg=CmdbLDAP().get_base_ou(queryOU)
    if errorMsg:
      logger.error(errorMsg)
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
    if errorMsg:
      logger.error(errorMsg)
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
      changeStatus,errorMsg=CmdbLDAP().change_self_password(request.data)
      if changeStatus==True:
        returnData={"status":"密码修改成功！"}
        returnStatus=status.HTTP_200_OK
      else:
        returnData={"error":errorMsg}
        returnStatus=status.HTTP_400_BAD_REQUEST
    else:
      returnData=serializer.errors
      returnStatus=status.HTTP_400_BAD_REQUEST
    return JsonResponse(returnData,status=returnStatus,safe=False)

class UserResetPasswordSet(APIView):
  """
  重置用户密码
  """
  # serializer_class=ChangePasswordSerializer
  def post(self,request,*args,**kwargs):
    
    serializer=ResetPasswordSerializer(instance=request,data=request.data)
    if serializer.is_valid():
      userdn=serializer.validated_data.get('userdn')
      newpassword=generat_random_password(encode=True)
      resetStatus,errorMsg=CmdbLDAP().reset_user_password(userdn,newpassword)
      if resetStatus==True:
        returnData={"status":"用户密码重置成功，请在参见邮件进行密码修改。"}
        returnStatus=status.HTTP_200_OK
        username=userdn.split(',')[0].split('=')[1]
        if username:
          send_reset_password_email.delay(username,newpassword)
          logger.info("发送重置密码的邮件到用户[%s]"%username)
      else:
        returnData={"error":errorMsg}
        returnStatus=status.HTTP_400_BAD_REQUEST
    else:
      returnData=serializer.errors
      returnStatus=status.HTTP_400_BAD_REQUEST

    
    return JsonResponse(returnData,status=returnStatus,safe=False)

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
      changeStatus, errorMsg = CmdbLDAP().update_ldap_dn(request.data,olddn)
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
      changeStatus, errorMsg = CmdbLDAP().create_ldap_entry_dn(request.data,parentDn)
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
      changeStatus, errorMsg = CmdbLDAP().delete_ldap_dn(
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
  # serializer_class = LockUnLockUserSerializer
  def post(self,request, *args, **kwargs):
    """
    锁定/解锁用户
    """
    serializer = LockUnLockUserSerializer(instance=request, data=request.data)
    if serializer.is_valid():
      changeStatus, errorMsg = CmdbLDAP().lock_unlock_ldap_user(request.data)
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

class LdifScriptViewSet(APIView):
  """
  锁定/解锁用户
  """
  # serializer_class = LockUnLockUserSerializer
  def post(self,request, *args, **kwargs):
    """
    锁定/解锁用户
    """
    serializer = LDIFScriptsSerializer(instance=request, data=request.data)
    if serializer.is_valid():
      ldif=request.data.get('ldif')
      changeStatus, errorMsg = CmdbLDAP().ldif_script(ldif)
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
