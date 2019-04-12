from django.contrib.auth.models import Group
from rest_framework.serializers import (
  CharField,
  Serializer,
  HyperlinkedModelSerializer)
from rest_framework.exceptions import ValidationError
from django.contrib.auth import get_user_model
 
Users = get_user_model()

class LdapUserSerializer(Serializer):
  """
  LdapUserSerializer 
  """
  class Meta:
        fields = ('username',)

class LdapSerializer(Serializer):
  """
  LdapSerializer 
  """
  class Meta:
        fields = "__all__"
        
class UserSerializer(HyperlinkedModelSerializer):
    class Meta:
        model  = Users
        fields = ('url', 'username', 'email', 'groups','password','nickname')


class GroupSerializer(HyperlinkedModelSerializer):
    class Meta:
        model  = Group
        fields = ('name',)

class ChangePasswordSerializer(Serializer):
  username = CharField(
    required       = True, 
    min_length     = 4,
    error_messages = {
        'min_length': '用户名不能小于6个字符',
        'required'  : '请填写名字'
      })
  oldpassword = CharField(
    required       = True, 
    min_length     = 6,
    error_messages = {
        'min_length': '密码不能小于6个字符',
        'required'  : '请填写旧密码'
      })
  newpassword = CharField(
    required       = True, 
    min_length     = 6,
    error_messages = {
        'min_length': '密码不能小于6个字符',
        'required'  : '请填输入新密码'
      })
  repassword = CharField(
    required       = True, 
    min_length     = 6,
    error_messages = {
        'min_length': '密码确认不能小于6个字符',
        'required'  : '请输入确认密码'
      })
  def validate(self, data):
    # 传进来什么参数，就返回什么参数，一般情况下用attrs
      if not self.instance.user.is_superuser and str(self.instance.user)!=str(data['username']):
        raise ValidationError("提交的用户非法！")
      if data['newpassword'] != data['repassword']:
        raise ValidationError("两次输入的密码不一致！")
      return data

