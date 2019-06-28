# -*- coding: utf-8 -*-

from uuid import uuid4
from django.db import models
from django.contrib.auth.models import AbstractUser
from .usergroups import UserGroups
from django.utils.translation import ugettext_lazy as _

__all__ = ['Users']


class Users(AbstractUser):
    '''
    继承Django的AbstractUser 并向里面添加两条数据内容
    '''

    id = models.UUIDField(default=uuid4, primary_key=True)
    gender = models.CharField(max_length=6, choices=(
        ('male', '男'), ('female', '女')), default='male', verbose_name='性别')
    nickname = models.TextField(
        max_length=32, null=True, blank=True, verbose_name='昵称')
    department = models.CharField(
        max_length=32, null=True, blank=True, verbose_name='部门')
    privatekey = models.TextField(null=True, blank=True, verbose_name='用户私钥')
    publickey = models.TextField(null=True, blank=True, verbose_name='用户公钥')
    secretkey = models.UUIDField(default=uuid4, verbose_name='用户jwt加密秘钥')
    mobile = models.CharField(null=True, blank=True,
                              max_length=16, verbose_name='用户手机')
    userdn = models.CharField(
        max_length=254, null=True, blank=True, verbose_name='用户DN')
    groups = models.ManyToManyField(
        UserGroups,
        verbose_name=_('User groups'),
        blank=True,
        help_text=_(
            'The groups this user belongs to. A user will get all permissions '
            'granted to each of their groups.'
        ),
        related_name="user_set",
        related_query_name="user",
    )

    class Meta(AbstractUser.Meta):
        ordering = ['username']
        verbose_name = _("Users")
        permissions = (
            ('view_user_permission', u'查看管理页面'),
            ('view_ldap_manager', u'查看管理ldap菜单'),
        )
