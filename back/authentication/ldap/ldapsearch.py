import ldap,uuid
from django.conf import settings
from common.utils import CmdbLDAPLogger
from django.contrib.auth import get_user_model
 
logger=CmdbLDAPLogger().get_logger('cmdb_ldap')
Users = get_user_model()

class CmdbLDAP(object):
  """操作LDAP类"""

  def __init__(self):
    self.bindDN=settings.AUTH_LDAP_BIND_DN
    self.bindDNPassword=settings.AUTH_LDAP_BIND_PASSWORD
    self.conn=ldap.initialize(settings.AUTH_LDAP_SERVER_URI)
    self.searchScope = ldap.SCOPE_SUBTREE
    self.conn.set_option(ldap.OPT_REFERRALS,0)
    self.userDN=settings.AUTH_LDAP_SEARCH_OU
    
  def __del__(self):
    self.conn.unbind_s()

  def get_user_list(self,username='*'):
    """ 返回所有LDAP用户列表 """
    try:
      self.conn.simple_bind_s(self.bindDN,self.bindDNPassword)
    except Exception as identifier:
      logger.info(identifier)
      return None
    searchFilter="(&(uid=%s))"%username
    retrieveAttributes=None
    result_id=self.conn.search(self.userDN, self.searchScope, searchFilter, retrieveAttributes)
    result_set = {}
    while 1:
      result_type, result_data = self.conn.result(result_id, 0)
      if(result_data == []):
        break
      else:
        if result_type == ldap.RES_SEARCH_ENTRY:
          result_set[result_data[0][0]]=result_data[0][1]
    return result_set

  def change_self_password(self,data):
    """ 修改自己的密码 """
    userDN="uid=%s,%s"%(data['username'],settings.AUTH_LDAP_SEARCH_OU)
    changeStatus=None
    try:
      self.conn.simple_bind_s(userDN,data['oldpassword'])
      changeStatus=self.conn.passwd_s(userDN,data['oldpassword'],data['newpassword'])
      Users.objects.filter(username=data['username']).update(secretkey=uuid.uuid4())
    except Exception as e:
      logger.info(e)
      logger.info(dir(e))
      logger.info(type(e))
      return "%s"%(e)
    return True

  def change_password(self,args):
    """ 具有管理权限的修改用户的密码 """
    logger.info(dir(logger))
