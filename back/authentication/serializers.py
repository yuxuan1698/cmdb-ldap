from django.contrib.auth.models import Group
from rest_framework import serializers
from django.contrib.auth import get_user_model
 
Users = get_user_model()

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Users
        fields = ('url', 'username', 'email', 'groups','password','nickname')


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('name',)