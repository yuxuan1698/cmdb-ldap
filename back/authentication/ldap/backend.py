import ldap
from django.conf import settings
from django.core.exceptions import ImproperlyConfigured, ObjectDoesNotExist
from django_auth_ldap.backend import _LDAPUser, LDAPBackend
from django_auth_ldap.config import _LDAPConfig, LDAPSearch, LDAPSearchUnion, PosixGroupType, GroupOfNamesType, GroupOfUniqueNamesType, OrganizationalRoleGroupType, NestedGroupOfNamesType, NestedGroupOfUniqueNamesType, NestedOrganizationalRoleGroupType
# from rest_framework.authtoken.models import Token

logger = _LDAPConfig.get_logger()

class LDAPBackendAuthentication(LDAPBackend):
    """docstring for LDAPBackendAuthentication"""

    def authenticate(self, request=None, username=None, password=None, **kwargs):
        if password or self.settings.PERMIT_EMPTY_PASSWORD:
            ldap_user = _LDAPUser(self, username=username.strip(), request=request)
            user = self.authenticate_ldap_user(ldap_user, password)
        else:
            logger.debug("Rejecting empty password for {}".format(username))
            user = None
        # print(user)
        return user
        # print(dir(request.POST.get('Token')))
        # print(dir(request))
        # logger.info("current username=%s,password=%s,request"%(username,password))
        # return (None,)
        # if password or self.settings.PERMIT_EMPTY_PASSWORD:
        #     ldap_user = LDAPUser(self, username=username.strip(), request=request)
        #     user = self.authenticate_ldap_user(ldap_user, password)
        # else:
        #     logger.debug('Rejecting empty password for {}'.format(username))
        #     user = None

        # return user    