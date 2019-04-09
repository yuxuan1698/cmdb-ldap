from django.contrib.auth.models import Group
from rest_framework.viewsets import ModelViewSet
from rest_framework import status
from authentication.serializers import UserSerializer, GroupSerializer,ChangePasswordSerializer
from authentication.ldap.ldapsearch import CmdbLDAP
from common.utils import LDAPJSONEncoder
from django.http import JsonResponse
# from rest_framework_jwt.utils import jwt_decode_handler
from django.contrib.auth import get_user_model

from django.conf import settings
Users = get_user_model()

class UserViewSet(ModelViewSet):
  """
  允许用户查看或编辑的API路径。
  """
  def userlist(self,request, *args, **kwargs):
    """ 
    获取所有用户的列表信息
    """
    user_list=CmdbLDAP().get_user_list()
    return JsonResponse(user_list,encoder=LDAPJSONEncoder,safe=False)
  def userattrby(self,request,*args,**kwargs):
    """
    根据用户获取用户信息
    """
    userattrs=CmdbLDAP().get_user_list(request.user)
    return JsonResponse(userattrs,encoder=LDAPJSONEncoder,safe=False)

  def changepassword(self,request,*args,**kwargs):
    """
    修改用户密码
    """
    if str(request.user)!=str(request.data['username']):
      return JsonResponse({'error': '提交用户非法！'},status=status.HTTP_400_BAD_REQUEST,safe=False)
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
    
class GroupViewSet(ModelViewSet):
  """
  允许组查看或编辑的API路径。
  """
  queryset = Group.objects.all()
  serializer_class = GroupSerializer
