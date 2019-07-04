from django.contrib.auth.models import Group
from rest_framework import serializers
from rest_framework.serializers import (
    CharField, BooleanField, IntegerField, ChoiceField, 
    EmailField, Serializer
    )
from rest_framework.exceptions import ValidationError
import re 

class UserGroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model  = Group
        fields = ('name',)

class CerificateInvalidSerializer(Serializer):
    """
    效验DOMAIN
    """
    domain = CharField(
        required=True,
        allow_blank=False,
        error_messages={
            'required': '请填写域名信息。',
            'blank':"域名信息不能为空。"
        })
    port = IntegerField(
        required=False,
        # allow_null=True,
        error_messages={
            'required': '请填写端口信息。',
            'blank':"端口信息不能为空。"
        })


class GenerateSSHKeySerializer(Serializer):
    """
    效验生成SSHKEY的参数是否合法
    """
    email = EmailField(
        required=False,
        allow_blank=False,
        error_messages={
            'required': '请传入email字段。',
            'blank':"email字段信息不能为空。"
        })
    username = CharField(
        required=True,
        allow_blank=False,
        error_messages={
            'required': '请填写用户名username字段。',
            'blank':"用户名username不能为空。"
        })
    userdn = CharField(
      required=False,
      min_length=4,
      error_messages={
          'min_length': '用户DN不能小于6个字符',
      })
    # 是否保存到数据库及LDAP
    writetable = BooleanField(
        required=False,
        )
    keytype = ChoiceField(
        required=False,
        initial='rsa',
        choices=(('rsa','rsa'), ('ecdsa','ecdsa'),('dss','dss'),('ed25519','ed25519')),
        )
    rsabits = ChoiceField(
        required=False,
        initial=2048,
        choices=((512,512),(1024,1024),(2048,2048),(4096,4096)),
        )
    ecdsabits = ChoiceField(
        required=False,
        initial=384,
        choices=((256,256), (384,384),(521,521)),
        )

    def validate(self, data):
        if not re.match(r"^[^,]+(,.+)+,dc=.+$", data.get('userdn')):
            raise ValidationError("userdn字段格式不正确!例:cn=xxxx,dc=xxxxxxx,dc=xxx")
        return data