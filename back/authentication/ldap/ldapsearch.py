import ldap
import logging,json
from django.conf import settings
from django.core.exceptions import ImproperlyConfigured, ObjectDoesNotExist
class CmdbLDAPConfig():
  logger = None
  @classmethod
  def get_logger(cls):
    """
    Initializes and returns our logger instance.
    """
    if cls.logger is None:
      cls.logger = logging.getLogger('cmdb_ldap')
      cls.logger.addHandler(logging.NullHandler())
    return cls.logger
logger=CmdbLDAPConfig().get_logger()

class CmdbLDAP(object):
  def __init__(self):
    self.bindDN=settings.AUTH_LDAP_BIND_DN
    self.bindDNPassword=settings.AUTH_LDAP_BIND_PASSWORD
    self.conn=ldap.initialize(settings.AUTH_LDAP_SERVER_URI)
    self.searchScope = ldap.SCOPE_SUBTREE
    self.conn.set_option(ldap.OPT_REFERRALS,0)
    self.userDN=settings.AUTH_LDAP_SEARCH_OU

  def get_all_user_list(self):
    """ 返回所有LDAP用户列表 """
    try:
      self.conn.simple_bind_s(self.bindDN,self.bindDNPassword)
    except Expression as identifier:
      logger.info(identifier)
      return None
    searchFilter="(&(uid=*))"
    retrieveAttributes=None
    result_id=self.conn.search(self.userDN, self.searchScope, searchFilter, retrieveAttributes)
    result_set = []
 
    while 1:
      result_type, result_data = self.conn.result(result_id, 0)
      if(result_data == []):
        break
      else:
        if result_type == ldap.RES_SEARCH_ENTRY:
          logger.error(json.dumps(result_data))
          result_set.append(result_data)
    # logger.info(result_set)
    return result_set
  def get_user_attr_by(self,args):
    """ 返回指定LDAP用户列表 """
    logger.info(dir(logger))
  def change_self_password(self,args):
    """ 修改自己的密码 """
    logger.info(dir(logger))
  def change_password(self,args):
    """ 具有管理权限的修改用户的密码 """
    logger.info(dir(logger))
