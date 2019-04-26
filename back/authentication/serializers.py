from django.contrib.auth.models import Group
from rest_framework.serializers import (
  CharField,
  EmailField,
  ListField,
  IntegerField,
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


class DeleteUserSerializer(Serializer):
  """
    效验删除用户的字段
  """
  uid = ListField(
      required=True,
      child=CharField(
        required=True,
        min_length=4,
        error_messages={
          'min_length': '用户名(uid)不能小于4个字符',
        }
      ),
      error_messages={
        'required': '请填写用户名(uid)字段'
      })

class CreateUserSerializer(Serializer):
  """
    效验创建用户的字段
  """
  uid = CharField(
      required=False,
      min_length=4,
      error_messages={
        'min_length': '用户名(uid)不能小于4个字符',
      })
  sn = CharField(
      required=False,
      error_messages={
        'required': '请填写用户姓名(sn)字段'
      })
  mail = EmailField(
      required=False,
      error_messages={
        'required': '请填写用户姓名(mail)字段'
      })
  userPassword = CharField(
      required=True,
      min_length=6,
      error_messages={
        'min_length': '用户密码(userPassword)不能小于6个字符',
        'required': '请填写用户密码(userPassword)字段'
      })
  uidNumber = IntegerField(
    required       = False, 
  )
  gidNumber = IntegerField(
    required       = False, 
  )
  objectClass = ListField(
      child=CharField(),
      required=True,
      error_messages={
        'required': '请填写字段归属(objectClass)字段'
      })

class ChangePasswordSerializer(Serializer):
  """
    效验用户密码字段
  """
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

