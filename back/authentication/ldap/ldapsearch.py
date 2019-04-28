import uuid
import ldap
from ldap.schema import urlfetch
from ldap.schema.subentry import SCHEMA_ATTRS
from django.conf import settings
from common.utils import CmdbLDAPLogger
from django.contrib.auth import get_user_model
from authentication.utils import convert_dict_to_tuple_bytes, generate_ldap_dn_prefix,convert_string_to_bytes,convert_bytes_to_string
from ldap.modlist import modifyModlist

logger=CmdbLDAPLogger().get_logger('cmdb_ldap')
Users = get_user_model()

class CmdbLDAP(object):
  """操作LDAP类"""

  def __init__(self):
    self.bindDN=settings.AUTH_LDAP_BIND_DN
    self.bindDNPassword=settings.AUTH_LDAP_BIND_PASSWORD
    self.conn=ldap.initialize(settings.AUTH_LDAP_SERVER_URI)
    self.searchScope = ldap.SCOPE_ONELEVEL
    self.conn.set_option(ldap.OPT_REFERRALS,0)
    self.conn.set_option(ldap.OPT_PROTOCOL_VERSION,ldap.VERSION3)
    self.userDN=settings.AUTH_LDAP_SEARCH_OU
    self.errorMsg=None
    self.schema=None
    
  def __del__(self):
    self.conn.unbind_s()
    self.errorMsg=None

  # @classmethod
  def connect(self,dn=None,password=None):
    try:
      self.conn.simple_bind_s(dn or self.bindDN,password or self.bindDNPassword)
    except ldap.INVALID_CREDENTIALS as e:
      self.errorMsg="连接认证失败,请检查密码是否正确: INVALID_CREDENTIALS"
      return False
    except ldap.LDAPError as e:
      self.errorMsg="%s%s."%(e.args[0]['desc'],",%s"%e.args[0]['info'] if 'info' in e.args[0] else '')
      logger.info("LDAP Error: %s"%e)
      return False
    return True

  def get_user_list(self,username='uid=*'):
    """ 返回所有LDAP用户列表 """
    if self.connect():
      searchFilter="(&(%s))"%username
      retrieveAttributes=["*"]
      result_id=self.conn.search(self.userDN, self.searchScope, searchFilter, retrieveAttributes)
      result_set = []
      while 1:
        result_type, result_data = self.conn.result(result_id, 0)
        if(result_data == []):
          break
        else:
          if result_type == ldap.RES_SEARCH_ENTRY:
            result_set.append(result_data[0])
      return result_set,None
    else:
      return None,self.errorMsg
  def change_self_password(self,data):
    """ 修改自己的密码 """
    userDN="uid=%s,%s"%(data['username'],settings.AUTH_LDAP_SEARCH_OU)
    if not self.connect(userDN,data['oldpassword']):
      return None,self.errorMsg
    try:
      self.conn.passwd_s(userDN,data['oldpassword'],data['newpassword'])
      Users.objects.filter(username=data['username']).update(secretkey=uuid.uuid4())
    except ldap.INVALID_CREDENTIALS as e:
      logger.info("LDAP Auth Error: %s"%e.args[0].get('desc'))
      return None,"提交的原凭证无效！%s"%errmsg
    except ldap.CONSTRAINT_VIOLATION as e:
      logger.info("LDAP Error: %s"%e)
      return None,"违反了LDAP服务器端策略约束！%s"%e.args[0].get('info')
    except ldap.LDAPError as e:
      logger.info("LDAP Error: %s"%e)
      return None,"%s"%e
      
    return True,None

  def getobjectclasses(self):
        """
        trae la listas de objectclasses de un servidor dado
        """
        oc = self.schema.tree(ldap.schema.ObjectClass) 
        allobjc = {}
        for a in oc.keys():
            objc = self.schema.get_obj(ldap.schema.ObjectClass, a)
            if objc != None:
                allobjc[objc.names[0]] = ({'sup':objc.sup},{'must':objc.must},{'may':objc.may})
                # allobjc[objc.oid] = (objc.names, objc.must, objc.may, objc.sup, objc.obsolete)
        return allobjc

  def getatributes(self):
    """
    trae la lista de atributos de un servidor dado
    """
    allatt= {}
    o = []
    attr_tm = self.schema.tree(ldap.schema.AttributeType) 
    for a in  attr_tm.keys():
      att = self.schema.get_obj(ldap.schema.AttributeType, a)
      if att != None:
        allatt[att.names[0]] = att.single_value
        # allatt[att.oid] = (att.names, att.syntax, att.syntax_len, att.desc, att.collective, att.equality, att.single_value)
    return allatt 

  def get_attrsorclass_list(self,type=''):
    """ 获取 schema 列表 """
    if self.connect():
      self.conn.set_option(ldap.OPT_DEBUG_LEVEL,0)
      subschemasubentry_dn = self.conn.search_subschemasubentry_s(self.bindDN)
      if subschemasubentry_dn is None:
        s_temp = {}
      else:
        s_temp = self.conn.read_subschemasubentry_s(
          subschemasubentry_dn,attrs=SCHEMA_ATTRS
        )
      subschemasubentry_entry = ldap.cidict.cidict()
      for at,av in s_temp.items():
        if at in SCHEMA_ATTRS:
          try:
            subschemasubentry_entry[at].extend(av)
          except KeyError:
            subschemasubentry_entry[at] = av
      # Finally parse the schema
      self.schema = ldap.schema.SubSchema(subschemasubentry_entry)
      if type=='attr':
        attrOrclass=self.getatributes()
      else:
        attrOrclass=self.getobjectclasses()
      return attrOrclass,None
    else:
      return None,self.errorMsg

  def get_base_ou(self,queryOU=settings.AUTH_LDAP_BASE_DN):
    """
    获取Base OU信息
    """
    if self.connect():
      result_id=self.conn.search_s(queryOU, ldap.SCOPE_ONELEVEL, "(objectClass=*)", None)
      result_set = []
      while 1:
        try:
          result_type, result_data = self.conn.result(result_id, 0)
        except ldap.NO_SUCH_OBJECT as e:
          self.errorMsg="没有找到对象: No such object"
          return None,self.errorMsg
        if(result_data == []):
          break
        else:
          if result_type == ldap.RES_SEARCH_ENTRY:
            result_set.append((result_data[0][1],result_data[0][0]))
      return result_set,None

  def create_ldap_user(self,data):
    """
    创建用户
    """
  
    dn_pre , newdata = generate_ldap_dn_prefix(data)
    modlist=""
    if not dn_pre:
      return False, newdata
    else:
      modlist = convert_dict_to_tuple_bytes(newdata)
    newuserdn="%s,%s"%(dn_pre,self.userDN)
    if self.connect():
      try:
        self.conn.add_s(newuserdn,modlist)
      except ldap.ALREADY_EXISTS as e:
        logger.error(e)
        return False,"用户已经存在。"
      except ldap.INVALID_SYNTAX as e:
        logger.error(e)
        return False,"字段值不合法。%s"%e
      except ldap.LDAPError as e:
        logger.error(e)
        return False,e.args[0]
    logger.info("create user %s success,dn:%s" % (dn_pre, newuserdn))
    return "添加用户%s成功" % dn_pre, None

  def delete_ldap_user(self,data):
    """
    删除用户
    """
    if self.connect():
      try:
        for dn in data['userdn']:
          self.conn.delete_s(dn)
      except ldap.NO_SUCH_OBJECT as e:
        return False,"没有找到此用户,无法删除。"
      except ldap.LDAPError as e:
        return False,e.args[0]
    return "删除用户%s成功" % (';'.join(data['userdn'])), None

  def update_ldap_user(self,data,olddn):
    """
    更新用户属性用户
    """
    # newdata = { k:v if isinstance(v,list) else [v] for k,v in data.items() }
    dndata,err=self.get_user_list(olddn.split(',')[0])
    if dndata:
      olddata=convert_bytes_to_string(dndata[0][1])
      newdata=convert_string_to_bytes(data)
      # newdata=convert_string_to_bytes(data)
    

      logger.info(olddata)
      logger.info(newdata)
      logger.info(data)
      logger.info(ldap.MOD_ADD)
      logger.info(ldap.MOD_REPLACE)
    return "更新用户成功",None
