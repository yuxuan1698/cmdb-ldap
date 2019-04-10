from django.contrib.auth.models import Group
from rest_framework import serializers
# from django.contrib.auth import get_user_model
 
# Users = get_user_model()

class UserGroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model  = Group
        fields = ('name',)