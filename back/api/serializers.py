from django.contrib.auth.models import Group
from rest_framework import serializers
from rest_framework.serializers import CharField,IntegerField,Serializer
# from django.contrib.auth import get_user_model
 
# Users = get_user_model()

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