# from django.shortcuts import render
from django.contrib.auth.models import Group
from rest_framework import viewsets
# Create your views here.
from django.contrib.auth import get_user_model
 
Users = get_user_model()

class GetUserViewSet(viewsets.ModelViewSet):
  """
  允许用户查看或编辑的API路径test。
  """
  queryset = Users.objects.all()