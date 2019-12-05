from django.contrib.auth.models import Group
from rest_framework.serializers import (
    CharField,
    EmailField,
    ListField,
    IntegerField,
    NullBooleanField,
    Serializer,
    HyperlinkedModelSerializer)
from rest_framework.exceptions import ValidationError
from django.contrib.auth import get_user_model
from authentication.utils import generate_ldap_password
from common.utils import CmdbLDAPLogger
import re

logger = CmdbLDAPLogger().get_logger('cmdb_ldap')

Users = get_user_model()

class BaseSerializer(Serializer):
    sign = CharField(
      required=True,
      min_length=31,
      max_length=32,
      allow_blank=False,
      error_messages={
          'min_length': '签名(sign)长度不是规范的HASH长度',
          'max_length': '签名(sign)长度不是规范的HASH长度',
          'blank': "字段(sign)不能为空。"
      })
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
    model = Users
    fields = ('url', 'username', 'email', 'groups', 'password', 'nickname')


class GroupSerializer(HyperlinkedModelSerializer):
  class Meta:
    model = Group
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
              'blank': "uid不允许为空"

          }
      ),
      error_messages={
          'required': '请填写用户名(uid)字段'
      })


class LockUnLockUserSerializer(Serializer):
  """
    效验创建用户的字段
  """
  dn = CharField(
      required=True,
      min_length=4,
      allow_blank=False,
      error_messages={
          'min_length': '用户名(dn)不能小于4个字符',
          'blank': "字段(dn)不能为空。"
      })
  lock = NullBooleanField(required=True)

class LDIFScriptsSerializer(Serializer):
  """
  效验ldif脚本字段
  """
  ldif = CharField(
      required=True,
      min_length=4,
      allow_blank=False,
      error_messages={
          'min_length': 'ldif字段不能小于4个字符',
          'blank': "字段(ldif)不能为空。"
      })


class CreateUserSerializer(BaseSerializer):
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
          'blank': "字段(cn)不能为空。"
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
      required=False,
  )
  gidNumber = IntegerField(
      required=False,
  )
  objectClass = ListField(
      child=CharField(),
      required=True,
      error_messages={
          'required': '请填写字段归属(objectClass)字段'
      })

  def validate(self, data):
    if 'mobile' in self.instance.data.keys():
      if not re.match(r"^1[35789]\d{9}$", self.instance.data['mobile']):
        raise ValidationError("手机号码不合法，请检查！")
    return data


class UpdateUserSerializer(BaseSerializer):
  """
    效验更新用户的字段
  """
  uid = CharField(
      required=False,
      min_length=3,
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
          'required': "用户(userdn)字段为空，提交非法。",
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
          'blank': "字段(cn)不能为空。"
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
      required=False,
  )
  gidNumber = IntegerField(
      required=False,
  )
  objectClass = ListField(
      child=CharField(),
      required=True,
      error_messages={
          'required': '请填写字段归属(objectClass)字段'
      })

  def validate(self, data):
    if 'mobile' in self.instance.data.keys():
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
      required=True,
      min_length=4,
      error_messages={
          'min_length': '用户名不能小于6个字符',
          'required': '请填写名字'
      })
  oldpassword = CharField(
      required=True,
      min_length=6,
      error_messages={
          'min_length': '密码不能小于6个字符',
          'required': '请填写旧密码'
      })
  newpassword = CharField(
      required=True,
      min_length=6,
      error_messages={
          'min_length': '密码不能小于6个字符',
          'required': '请填输入新密码'
      })
  repassword = CharField(
      required=True,
      min_length=6,
      error_messages={
          'min_length': '密码确认不能小于6个字符',
          'required': '请输入确认密码'
      })


class ResetPasswordSerializer(Serializer):
  """
  效验重置用户密码字段
  """
  userdn = CharField(
      required=True,
      min_length=4,
      error_messages={
          'min_length': '用户名不能小于6个字符',
          'required': '缺少用户DN字段'
      })

  def validate(self, data):
    if not re.match(r"^[^,]+(,.+)+,dc=.+$", data.get('userdn')):
      raise ValidationError("userdn字段格式不正确!例:cn=xxxx,dc=xxxxxxx,dc=xxx")
    return data

class ReSendChangePasswordSerializer(BaseSerializer):
  """
  效验重置用户密码字段
  """
  userdn = CharField(
      required=True,
      min_length=4,
      error_messages={
          'min_length': '用户名不能小于6个字符',
          'required': '缺少用户DN字段'
      })
  username = CharField(
      required=True,
      min_length=4,
      error_messages={
          'min_length': '用户名不能小于6个字符',
          'required': '缺少用户名username字段'
      })
  email = EmailField(
      required=False,
      error_messages={
          'required': '请填写用户邮件(email)字段'
      })
  def validate(self, data):
    if not re.match(r"^[^,]+(,.+)+,dc=.+$", data.get('userdn')):
      raise ValidationError("userdn字段格式不正确!例:cn=xxxx,dc=xxxxxxx,dc=xxx")
    if not re.match(r"^[A-Za-z0-9_\u4e00-\u9fa5]+$", data.get('username')):
      raise ValidationError("username字段格式不正确,不能有特殊字符。")
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
          'required': "用户(currentDn)字段为空，提交非法。",
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
          'blank': "字段(cn)不能为空。"
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
      required=False,
  )
  gidNumber = IntegerField(
      required=False,
  )
  objectClass = ListField(
      child=CharField(),
      required=True,
      error_messages={
          'required': '请填写字段归属(objectClass)字段'
      })


class CreateDNSerializer(Serializer):
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
      allow_blank=True,
      error_messages={
          'required': "用户(currentDn)字段为空，提交非法。",
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
          'blank': "字段(cn)不能为空。"
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
      required=False,
  )
  gidNumber = IntegerField(
      required=False,
  )
  objectClass = ListField(
      child=CharField(),
      required=True,
      error_messages={
          'required': '请填写字段归属(objectClass)字段'
      })


class DeleteDNSerializer(Serializer):
  """
    效验删除用户的字段
  """
  currentDn = ListField(
      required=True,
      child=CharField(
          allow_blank=False,
          min_length=4,
          error_messages={
              'min_length': 'DN不能小于4个字符,或者格式不正确。',
              'blank': "DN不允许为空"

          }
      ),
      error_messages={
          'required': '请填写用户名(currentDn)字段'
      })
