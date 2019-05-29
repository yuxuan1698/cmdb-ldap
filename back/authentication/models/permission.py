from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import PermissionManager
from django.utils.translation import gettext_lazy as _
from django.db import models
from uuid import uuid4

class Permissions(models.Model):
    id = models.UUIDField(default=uuid4, primary_key=True)
    name = models.CharField(_('name'), max_length=255)
    content_type = models.ForeignKey(
        ContentType,
        models.CASCADE,
        verbose_name=_('content type'),
    )
    codename = models.CharField(_('codename'), max_length=100)
    objects = PermissionManager()
    created_by = models.CharField(max_length=128, verbose_name=_('Name'))

    class Meta:
        verbose_name = _('permission')
        verbose_name_plural = _('permissions')
        unique_together = (('content_type', 'codename'),)
        ordering = ('content_type__app_label', 'content_type__model',
                    'codename')

    def __str__(self):
        return "%s | %s | %s" % (
            self.content_type.app_label,
            self.content_type,
            self.name,
        )

    def natural_key(self):
        return (self.codename,) + self.content_type.natural_key()
    natural_key.dependencies = ['contenttypes.contenttype']
