from django.db import models
# from django.contrib.auth.models import User
# class UserProfile(models.Model):
#     user = models.OneToOneField(User,on_delete=models.CASCADE)    
#     major = models.TextField(default='', blank=True)
#     address = models.CharField(max_length=200,default='',blank=True)

from django.contrib.auth.models import AbstractUser

class UserProfile(AbstractUser):
    '''
    继承Django的AbstractUser 并向里面添加两条数据内容
    '''
    gender = models.CharField(max_length=6,choices=(('male','男'),('female','女')),default='female',verbose_name='性别')
    memo = models.TextField(null=True, blank=True,verbose_name='便签')
    class Meta:
        verbose_name = '用户信息'
        verbose_name_plural = verbose_name #指定模型的复数形式是什么,如果不指定Django会自动在模型名称后加一个’s’
