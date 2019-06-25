# -*- coding: utf-8 -*-

from uuid import uuid4
from django.db import models
from django.utils.translation import ugettext_lazy as _
# from .permission import Permissions

__all__ = ['Cerificate']

class Cerificate(models.Model):
  id = models.UUIDField(default=uuid4, primary_key=True)
  InstanceID = models.CharField(max_length=128, verbose_name=_('InstanceID'))
  Name = models.CharField(max_length=128, verbose_name=_('CerificateName'))
  Domain = models.CharField(max_length=128, verbose_name=_('Domain'))
  BrandName = models.CharField(max_length=128,verbose_name=_('BrandName'))
  CertType = models.CharField(max_length=16,verbose_name=_('CertType'))
  StatusCode = models.CharField(max_length=16, verbose_name=_('StatusCode'))
  AfterDate = models.BigIntegerField(verbose_name=_('AfterDate'))
  BeforeDate = models.BigIntegerField(verbose_name=_('BeforeDate'))
  RemainingDays = models.IntegerField(verbose_name=_('RemainingDays'))
  Year = models.IntegerField(verbose_name=_('Year'))
  Comment = models.TextField(blank=True, verbose_name=_('Comment'))
  ProdInvalidDate = models.DateTimeField(verbose_name=_('ProdInvalidDate'))
  ProdInvalidDays = models.IntegerField(verbose_name=_('ProdInvalidDays'))

  def __str__(self):
      return self.domain

  class Meta:
    ordering = ['BeforeDate']
    verbose_name = _("aliyun 证书管理")

