from django.db import models
from django.contrib.auth.models import AbstractUser

class Users(AbstractUser):
    '''
    继承Django的AbstractUser 并向里面添加两条数据内容
    '''
    gender = models.CharField(max_length=6,choices=(('male','男'),('female','女')),default='female',verbose_name='性别')
    nickname = models.TextField(null=True, blank=True,verbose_name='昵称')
    memo = models.TextField(null=True, blank=True,verbose_name='便签')
    class Meta(AbstractUser.Meta):
        ordering = ['username']
        verbose_name = "Users"