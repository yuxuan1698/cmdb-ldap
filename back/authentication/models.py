from uuid import uuid4
from django.db import models
from django.contrib.auth.models import AbstractUser

class Users(AbstractUser):
    '''
    继承Django的AbstractUser 并向里面添加两条数据内容
    '''
    gender = models.CharField(max_length=6,choices=(('male','男'),('female','女')),default='male',verbose_name='性别')
    nickname = models.TextField(
        max_length=32,null=True, blank=True, verbose_name='昵称')
    department = models.CharField(
        max_length=32,null=True, blank=True, verbose_name='部门')
    secretkey = models.UUIDField(default=uuid4, verbose_name='用户jwt加密秘钥')
    mobile = models.CharField(null=True, blank=True,max_length=16, verbose_name='用户手机')
    userdn = models.CharField(max_length=254, null=True, blank=True,verbose_name='用户DN')
    class Meta(AbstractUser.Meta):
        ordering = ['username']
        verbose_name = "Users"
