import json
from django.contrib.auth.models import Group
from rest_framework.viewsets import ModelViewSet
from .serializers import UserSerializer, GroupSerializer
from django.contrib.auth import get_user_model
from authentication.ldap.ldapsearch import CmdbLDAP,CmdbLDAPConfig
# from django.http import HttpResponse
from django.http import JsonResponse
logger=CmdbLDAPConfig.get_logger()
User = get_user_model()

class LDAPJSONEncoder(json.JSONEncoder):
    """
    JSONEncoder subclass that knows how to encode date/time, decimal types, and
    UUIDs.
    """
    def default(self, o):
        # See "Date Time String Format" in the ECMA-262 specification.
        if isinstance(o, datetime.datetime):
            r = o.isoformat()
            if o.microsecond:
                r = r[:23] + r[26:]
            if r.endswith('+00:00'):
                r = r[:-6] + 'Z'
            return r
        elif isinstance(o, datetime.date):
            return o.isoformat()
        elif isinstance(o, datetime.time):
            if is_aware(o):
                raise ValueError("JSON can't represent timezone-aware times.")
            r = o.isoformat()
            if o.microsecond:
                r = r[:12]
            return r
        elif isinstance(o, datetime.timedelta):
            return duration_iso_string(o)
        elif isinstance(o, (decimal.Decimal, uuid.UUID, Promise)):
            return str(o)
        elif isinstance(obj, bytes):
            return str(obj, encoding='utf-8')
        else:
            return super().default(o)
class UserViewSet(ModelViewSet):
    """
    允许用户查看或编辑的API路径。
    """
    def userlist(request, *args, **kwargs):
        user_list=CmdbLDAP().get_all_user_list()
        # logger.info(dir(request.META))
        return JsonResponse(user_list,encoder=LDAPJSONEncoder,safe=False)

class GroupViewSet(ModelViewSet):
    """
    允许组查看或编辑的API路径。
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer