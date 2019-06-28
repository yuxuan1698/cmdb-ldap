# -*- coding: utf-8 -*-

from uuid import uuid4
from django.db import models
# from  django.contrib.auth.models import Group
from django.contrib.auth.models import AbstractUser, GroupManager, Permission
from django.utils.translation import ugettext_lazy as _
# from .permission import Permissions
from .u
__all__ = ['UserGroups']


class UserGroups(models.Model):
  id = models.UUIDField(default=uuid4, primary_key=True)
  name = models.CharField(max_length=128, verbose_name=_('Name'))
  permissions = models.ManyToManyField(
      Permission,
      verbose_name=_('permissions'),
      blank=True,
  )

  comment = models.TextField(blank=True, verbose_name=_('Comment'))
  date_created = models.DateTimeField(auto_now_add=True, null=True,
                                      verbose_name=_('Date created'))
  created_by = models.CharField(max_length=100, null=True, blank=True)

  objects = GroupManager()

  def __str__(self):
    return self.name

  class Meta:
    ordering = ['name']
    verbose_name = _("User groups")
