import ldap
from django.conf import settings
from django.core.exceptions import ImproperlyConfigured, ObjectDoesNotExist
from django_auth_ldap.backend import _LDAPUser, LDAPBackend
from django_auth_ldap.config import _LDAPConfig, LDAPSearch, LDAPSearchUnion, PosixGroupType, GroupOfNamesType, GroupOfUniqueNamesType, OrganizationalRoleGroupType, NestedGroupOfNamesType, NestedGroupOfUniqueNamesType, NestedOrganizationalRoleGroupType
# from rest_framework.authtoken.models import Token

logger = _LDAPConfig.get_logger()

def jwt_response_payload_handler(token,users=None,request=None):
    """为返回的结果添加用户相关信息"""
    
    return {
             'nickname':users.nickname,
             'username':users.username,
             'email':users.email,
             'token_prefix': settings.JWT_AUTH.get('JWT_AUTH_HEADER_PREFIX') or 'JWT',
             'token':token
            }
def reflush_secretkey(userModel):
    """返回用户UUID"""
    return userModel.secretkey         
class LDAPBackendAuthentication(LDAPBackend):
    """docstring for LDAPBackendAuthentication"""

    def authenticate(self, request=None, username=None, password=None,**kwargs):
        return super().authenticate(request,username,password)
        # if password or self.settings.PERMIT_EMPTY_PASSWORD:
        #     ldap_user = _LDAPUser(self, username=username.strip(), request=request)
        #     user = self.authenticate_ldap_user(ldap_user, password)
        # else:
        #     logger.debug("Rejecting empty password for {}".format(username))
        #     user = None
        # logger.error(dir(user))
        # return user