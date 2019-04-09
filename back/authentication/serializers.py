from django.contrib.auth.models import Group
from rest_framework import serializers
from django.contrib.auth import get_user_model
 
Users = get_user_model()

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model  = Users
        fields = ('url', 'username', 'email', 'groups','password','nickname')


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model  = Group
        fields = ('name',)

class ChangePasswordSerializer(serializers.Serializer):
  username = serializers.CharField(
    required       = True, 
    min_length     = 4,
    error_messages = {
        'min_length': '用户名不能小于6个字符',
        'required'  : '请填写名字'
      })
  oldpassword = serializers.CharField(
    required       = True, 
    min_length     = 6,
    error_messages = {
        'min_length': '密码不能小于6个字符',
        'required'  : '请填写旧密码'
      })
  newpassword = serializers.CharField(
    required       = True, 
    min_length     = 6,
    error_messages = {
        'min_length': '密码不能小于6个字符',
        'required'  : '请填输入新密码'
      })
  repassword = serializers.CharField(
    required       = True, 
    min_length     = 6,
    error_messages = {
        'min_length': '密码确认不能小于6个字符',
        'required'  : '请输入确认密码'
      })
  def validate(self, data):
    # 传进来什么参数，就返回什么参数，一般情况下用attrs
        if data['newpassword'] != data['repassword']:
            raise serializers.ValidationError({"password":"两次输入的密码不一致！"})
        return data

