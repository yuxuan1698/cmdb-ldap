# from django.shortcuts import render
from django.contrib.auth.models import Group
# from rest_framework import viewsets
from rest_framework.viewsets import ModelViewSet
from django.contrib.auth import get_user_model
from .serializers import UserGroupSerializer

Users = get_user_model()

class GetGroupViewSet(ModelViewSet):
  """
  允许用户查看或编辑的API路径test。
  """
  serializer_class=UserGroupSerializer
  
  def listgroups():
    queryset = Users.objects.all()