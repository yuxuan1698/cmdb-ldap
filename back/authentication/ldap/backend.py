from django_auth_ldap.backend import _LDAPUser, LDAPBackend
from authentication.models import UserGroups
from django.core.exceptions import ImproperlyConfigured, ObjectDoesNotExist
from common.utils import CmdbLDAPLogger
import django.dispatch
import ldap 

logger=CmdbLDAPLogger.get_logger('cmdb_ldap')

# Allows clients to perform custom user population.
populate_user = django.dispatch.Signal(providing_args=["user", "ldap_user"])

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

  def authenticate(self, password):
    """
    Authenticates against the LDAP directory and returns the corresponding
    User object if successful. Returns None on failure.
    """
    user = None

    try:
        self._authenticate_user_dn(password)
        self._check_requirements()
        self._get_or_create_user()
        if self.group_names:
            user = self._user
    except self.AuthenticationFailed as e:
        logger.debug(
            "Authentication failed for {}: {}".format(self._username, e))
    except ldap.LDAPError as e:
        results = ldap_error.send(self.backend.__class__,
                                  context='authenticate', user=self._user,
                                  exception=e)
        if len(results) == 0:
            logger.warning(
                "Caught LDAPError while authenticating {}: {}".format(
                    self._username, pprint.pformat(e)
                )
            )
    except Exception as e:
        logger.warning(
            "{} while authenticating {}".format(e, self._username)
        )
        raise

    return user
#   def _get_group_permissions(self, user_obj):
#     user_groups_field = get_user_model()._meta.get_field('groups')
#     user_groups_query = 'usergroups__%s' % user_groups_field.related_query_name()
#     return Permission.objects.filter(**{user_groups_query: user_obj})
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

        new_groups = [UserGroups.objects.get_or_create(name=name,created_by='LDAP',comment="Sync by LDAP")[0] for name
                        in target_group_names if name not in existing_group_names]

        self._user.groups.set(existing_groups + new_groups)
        
  def _get_or_create_user(self, force_populate=False):
      """
      Loads the User model object from the database or creates it if it
      doesn't exist. Also populates the fields, subject to
      AUTH_LDAP_ALWAYS_UPDATE_USER.
      """
      save_user = False

      username = self.backend.ldap_to_django_username(self._username)

      self._user, built = self.backend.get_or_build_user(username, self)
      self._user.ldap_user = self
      self._user.ldap_username = self._username

      should_populate = force_populate or self.settings.ALWAYS_UPDATE_USER or built

      if built:
          logger.debug("Creating Django user {}".format(username))
          self._user.set_unusable_password()
          save_user = True

      if should_populate:
          logger.debug("Populating Django user {}".format(username))
          self._populate_user()
          save_user = True

          # Give the client a chance to finish populating the user just
          # before saving.
          populate_user.send(self.backend.__class__, user=self._user, ldap_user=self)

      if save_user:
          self._user.userdn=self.dn
          self._user.save()

      # This has to wait until we're sure the user has a pk.
      if self.settings.MIRROR_GROUPS or self.settings.MIRROR_GROUPS_EXCEPT:
          self._normalize_mirror_settings()
          self._mirror_groups()