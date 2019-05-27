from django_auth_ldap.backend import _LDAPUser, LDAPBackend
from django_auth_ldap.config import _LDAPConfig
from authentication.models import UserGroups
from django.core.exceptions import ImproperlyConfigured, ObjectDoesNotExist

# LDAPSearch, LDAPSearchUnion, PosixGroupType, GroupOfNamesType, GroupOfUniqueNamesType, OrganizationalRoleGroupType, NestedGroupOfNamesType, NestedGroupOfUniqueNamesType, NestedOrganizationalRoleGroupType

logger = _LDAPConfig.get_logger()
        
class LDAPBackendAuthentication(LDAPBackend):
  """docstring for LDAPBackendAuthentication"""

  def authenticate(self, request=None, username=None, password=None,**kwargs):
    # return super().authenticate(request,username,password)
    if password or self.settings.PERMIT_EMPTY_PASSWORD:
        ldap_user = LDAPUser(self, username=username.strip(), request=request)
        user = self.authenticate_ldap_user(ldap_user, password)
    else:
        logger.debug("Rejecting empty password for {}".format(username))
        user = None
    logger.error(dir(user))
    return user

  def get_user(self, user_id):
    user = None
    try:
        user = self.get_user_model().objects.get(pk=user_id)
        LDAPUser(self, user=user)  # This sets user.ldap_user
    except ObjectDoesNotExist:
        pass

    return user
  def get_group_permissions(self, user, obj=None):
      if not hasattr(user, 'ldap_user') and self.settings.AUTHORIZE_ALL_USERS:
          LDAPUser(self, user=user)  # This sets user.ldap_user

      if hasattr(user, 'ldap_user'):
          permissions = user.ldap_user.get_group_permissions()
      else:
          permissions = set()

      return permissions

  def populate_user(self, username):
      ldap_user = LDAPUser(self, username=username)
      user = ldap_user.populate_user()

      return user

class LDAPUser(_LDAPUser):
  def _mirror_groups(self):
    """
    Mirrors the user's LDAP groups in the Django database and updates the
    user's membership.
    """
    
    target_group_names = frozenset(self._get_groups().get_group_names())
    current_group_names = frozenset(self._user.groups.values_list('name', flat=True).iterator())

    # These were normalized to sets above.
    MIRROR_GROUPS_EXCEPT = self.settings.MIRROR_GROUPS_EXCEPT
    MIRROR_GROUPS = self.settings.MIRROR_GROUPS

    # If the settings are white- or black-listing groups, we'll update
    # target_group_names such that we won't modify the membership of groups
    # beyond our purview.
    if isinstance(MIRROR_GROUPS_EXCEPT, (set, frozenset)):
        target_group_names = (
            (target_group_names - MIRROR_GROUPS_EXCEPT) |
            (current_group_names & MIRROR_GROUPS_EXCEPT)
        )
    elif isinstance(MIRROR_GROUPS, (set, frozenset)):
        target_group_names = (
            (target_group_names & MIRROR_GROUPS) |
            (current_group_names - MIRROR_GROUPS)
        )

    if target_group_names != current_group_names:
        existing_groups = list(UserGroups.objects.filter(name__in=target_group_names).iterator())
        existing_group_names = frozenset(group.name for group in existing_groups)

        new_groups = [UserGroups.objects.get_or_create(name=name)[0] for name
                        in target_group_names if name not in existing_group_names]

        self._user.groups.set(existing_groups + new_groups)
