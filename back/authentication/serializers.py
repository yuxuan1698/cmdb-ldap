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
from authentication.utils import generate_ldap_password
from common.utils import CmdbLDAPLogger
import re

logger=CmdbLDAPLogger().get_logger('cmdb_ldap')

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
  userdn = ListField(
      required=True,
      child=CharField(
        allow_blank=False,
        min_length=4,
        error_messages={
          'min_length': '用户名(uid)不能小于4个字符',
          'blank':"uid不允许为空"

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
      allow_blank=False,
      error_messages={
        'min_length': '用户名(uid)不能小于4个字符',
        'blank': "字段(uid)不能为空。"
      })
  sn = CharField(
      required=False,
      error_messages={
        'required': '请填写用户姓名(sn)字段'
      })
  cn = CharField(
      required=False,
      allow_blank=False,
      error_messages={
        'required': '请填写用户别名(cn)字段',
        'blank':"字段(cn)不能为空。"
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

  def validate(self, data):
    if 'mobile' in  self.instance.data.keys() :
      if not re.match(r"^1[35789]\d{9}$", self.instance.data['mobile']):
        raise ValidationError("手机号码不合法，请检查！")
    return data

class UpdateUserSerializer(Serializer):
  """
    效验更新用户的字段
  """
  uid = CharField(
      required=False,
      min_length=4,
      allow_blank=False,
      error_messages={
        'min_length': '用户名(uid)不能小于4个字符',
        'blank': "字段(uid)不能为空。"
      })
  userdn = CharField(
      required=True,
      min_length=4,
      allow_blank=False,
      error_messages={
        'required':"用户(userdn)字段为空，提交非法。",
        'min_length': '用户名(userdn)不能小于4个字符',
        'blank': "字段(userdn)不能为空。"
      })
  sn = CharField(
      required=False,
      error_messages={
        'required': '请填写用户姓名(sn)字段'
      })
  cn = CharField(
      required=False,
      allow_blank=False,
      error_messages={
        'required': '请填写用户别名(cn)字段',
        'blank':"字段(cn)不能为空。"
      })
  mail = EmailField(
      required=False,
      error_messages={
        'required': '请填写用户姓名(mail)字段'
      })
  userPassword = CharField(
      required=False,
      allow_blank=True,
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

  def validate(self, data):
    if 'mobile' in  self.instance.data.keys() :
      if not re.match(r"^1[35789]\d{9}$", self.instance.data['mobile']):
        raise ValidationError("手机号码不合法，请检查！")
    if not re.match(r"^(cn|uid|ou)=[^,]+(,(ou|cn)=[^,]+)*(,dc=[^,]+)+$", self.instance.data['userdn']):
      raise ValidationError("用户的[userdn]不合法.请无随意提交数据！")
    return data

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

class UpdateDNSerializer(Serializer):
  """
    效验更新用户的字段
  """
  uid = CharField(
      required=False,
      min_length=4,
      allow_blank=False,
      error_messages={
        'min_length': '用户名(uid)不能小于4个字符',
        'blank': "字段(uid)不能为空。"
      })
  currentDn = CharField(
      required=True,
      min_length=4,
      allow_blank=False,
      error_messages={
        'required':"用户(currentDn)字段为空，提交非法。",
        'min_length': '用户名(currentDn)不能小于4个字符',
        'blank': "字段(currentDn)不能为空。"
      })
  sn = CharField(
      required=False,
      error_messages={
        'required': '请填写用户姓名(sn)字段'
      })
  cn = CharField(
      required=False,
      allow_blank=False,
      error_messages={
        'required': '请填写用户别名(cn)字段',
        'blank':"字段(cn)不能为空。"
      })
  mail = EmailField(
      required=False,
      error_messages={
        'required': '请填写用户姓名(mail)字段'
      })
  userPassword = CharField(
      required=False,
      allow_blank=True,
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
