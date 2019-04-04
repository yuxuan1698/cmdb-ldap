# from django.shortcuts import render
from django.contrib.auth.models import User, Group
from rest_framework import viewsets
# Create your views here.


class GetUserViewSet(viewsets.ModelViewSet):
  """
  允许用户查看或编辑的API路径test。
  """
  queryset = User.objects.all()