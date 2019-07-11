import uuid
import ldap
from ldap.ldapobject import ReconnectLDAPObject
from ldap.schema.subentry import SCHEMA_ATTRS
from django.conf import settings
from common.utils import CmdbLDAPLogger
from django.contrib.auth import get_user_model
from authentication.ldap.utils import (
  modifyModList,
  convert_dict_to_tuple_bytes, 
  generate_ldap_dn_prefix,
  convert_string_to_bytes
  )
from datetime import datetime
logger=CmdbLDAPLogger().get_logger('cmdb_ldap')
Users = get_user_model()

class CmdbLDAP(object):
  """操作LDAP类"""

  def __init__(self):
    self.bindDN=settings.AUTH_LDAP_BIND_DN
    self.bindDNPassword=settings.AUTH_LDAP_BIND_PASSWORD
    # self.conn=ldap.initialize(settings.AUTH_LDAP_SERVER_URI)
    self.conn=ReconnectLDAPObject(settings.AUTH_LDAP_SERVER_URI,trace_level=0)
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
    except ldap.SERVER_DOWN:
      self.errorMsg="无法连接到LDAP"
    except ldap.INVALID_CREDENTIALS as e:
      self.errorMsg="连接认证失败,请检查密码是否正确: INVALID_CREDENTIALS"
      return False
    except ldap.LDAPError as e:
      self.errorMsg="%s%s."%(e.args[0]['desc'],",%s"%e.args[0]['info'] if 'info' in e.args[0] else '')
      logger.info("LDAP Error: %s"%e)
      return False
    return True

  def get_user_list(self,username='uid=*',retrieveAttributes=["*","pwdAccountLockedTime"]):
    """ 返回所有LDAP用户列表 """
    if self.connect():
      searchFilter="(&(%s))"%username
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

  def get_dn_attribute(self,dn=settings.AUTH_LDAP_BASE_DN):
    """ 返回所有LDAP DN属性 """
    if self.connect():
      searchFilter="(objectClass=*)"
      result_id=self.conn.search(dn, ldap.SCOPE_BASE, searchFilter, None)
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

  def reset_user_password(self,dn,password):
    """ 重置用户密码 """
    if self.connect() and dn and password :
      modlist=[]
      modlist.append((ldap.MOD_REPLACE,'userPassword',[password]))
      logger.info(modlist)
      try:
        self.conn.modify_s(dn, modlist)
      except ldap.LDAPError as e:
        return False,e.args[0]
      return True, None
    else:
      return None,self.errorMsg


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

  def get_base_ou(self,queryOU=settings.AUTH_LDAP_BASE_DN,ldapType=ldap.SCOPE_ONELEVEL):
    """
    获取Base OU信息
    """
    if self.connect():
      result_id = self.conn.search(
          queryOU,ldapType, "(objectClass=*)", ["*", "hasSubordinates"])
      result_set = []
      while 1:
        try:
          result_type, result_data = self.conn.result(result_id, 0)
        except ldap.NO_SUCH_OBJECT as e:
          logger.info(e.args[0])
          self.errorMsg="没有找到对象: No such object"
          return None,self.errorMsg
        if(result_data == []):
          break
        else:
          if result_type == ldap.RES_SEARCH_ENTRY:
            result_set.append((result_data[0][1],result_data[0][0]))

      if len(result_set)==0 and ldapType==ldap.SCOPE_ONELEVEL:
        newresult,msg=self.get_base_ou(queryOU,ldapType=ldap.SCOPE_BASE)
        if len(newresult)>0:
          return {"notsubdir":True,"data":newresult},None
        else:
          return False,"没有找到DN记录或者属性！"

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
        return False,"用户已经存在。",None,None
      except ldap.INVALID_SYNTAX as e:
        logger.error(e)
        return False,"字段值不合法。%s"%e,None,None
      except ldap.LDAPError as e:
        logger.error(e)
        return False,e.args[0],None,None
    logger.info("create user %s success,dn:%s" % (dn_pre, newuserdn))
    return "添加用户%s成功" % dn_pre, None, newuserdn, dn_pre.split('=')[1]

  def delete_ldap_userdn(self,data):
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

  def lock_unlock_ldap_user(self,data):
    """
    锁定/解锁用户
    """
    
    dn=data['dn']
    now=datetime.utcnow().strftime("%Y%m%d%H%M%SZ")
    # now=datetime.utcnow().strftime("%Y%m%d%H%M%S.%fZ")
    if data['lock']:
      msg="用户锁定成功，此用户将无法登陆！"
      bytesValue = convert_string_to_bytes(
          {'pwdAccountLockedTime': [now]})
      lockUnlockModList=modifyModList({},bytesValue)
    else:
      msg="用户解锁成功，用户恢复可登陆状态！"
      lockUnlockModList = modifyModList({'pwdAccountLockedTime': ''}, {})
    if self.connect():
      try:
        self.conn.modify_s(dn, lockUnlockModList)
      except ldap.LDAPError as e:
        return False, e.args[0]
    return msg,None

  def update_ldap_user(self,data,olddn):
    """
    更新用户属性用户
    """
    returnStatus=False,'字段没有发生变化，修改不成功。'
    rdn_prefix=olddn.split(',')
    rdn_field=rdn_prefix[0].split('=')
    dndata,err=self.get_user_list(rdn_prefix[0])
    modrdn=""
    if dndata:
      if rdn_field[0]!='':
        if rdn_field[0] in data  and data[rdn_field[0]]!=rdn_field[1]:
          modrdn="{}={}".format(rdn_field[0],data[rdn_field[0]])
        del dndata[0][1][rdn_field[0]]
        del data[rdn_field[0]]
    else:
      return False,err
    if dndata:
      olddata=dndata[0][1]
      newdata = convert_string_to_bytes(data)
      modlist=modifyModList(olddata,newdata)
      if len(modlist):
        logger.info("modlist:%s"%modlist)
        try:
          self.conn.modify_s(olddn,modlist)
          returnStatus="更新用户成功",None
        except ldap.LDAPError as e:
          logger.error(e)
          return False,"更新字段失败，失败内容:%s"%(e.args[0]['info'] if e.args[0]['info'] else "")
      if modrdn!='':
        try:
          self.conn.modrdn_s(olddn,modrdn)
        except ldap.LDAPError as e:
          logger.error(e)
          return False,"DN修改失败:%s"%(e.args[0]['info'] if e.args[0]['info'] else "")
        returnStatus="更新用户成功",None
      return returnStatus

  def update_ldap_dn(self,data,olddn):
    """
    更新用户属性用户
    """
    rdn_prefix=olddn.split(',')
    rdn_field=rdn_prefix[0].split('=')
    dndata,err=self.get_dn_attribute(olddn)
    modrdn=""
    if dndata:
      if rdn_field[0]!='':
        if data[rdn_field[0]]!=rdn_field[1]:
          modrdn="{}={}".format(rdn_field[0],data[rdn_field[0]])
        del dndata[0][1][rdn_field[0]]
        del data[rdn_field[0]]
    else:
      return False,err
    if dndata:
      olddata=dndata[0][1]
      newdata = convert_string_to_bytes(data)
      modlist=modifyModList(olddata,newdata)
      if len(modlist):
        logger.info("modlist:%s"%modlist)
        try:
          self.conn.modify_s(olddn,modlist)
          return "更新用户成功",None
        except ldap.NAMING_VIOLATION as e:
          logger.error(e)
          return False,"更新字段失败，失败内容:%s"%(e.args[0]['info'] if e.args[0]['info'] else "")
        except ldap.CONSTRAINT_VIOLATION as e:
          logger.error(e)
          return False,"更新字段失败，失败内容:%s"%(e.args[0]['info'] if e.args[0]['info'] else "")
        except ldap.INVALID_SYNTAX as e:
          logger.error(e)
          return False,"更新字段失败,字段格式不对:%s"%(e.args[0]['info'] if e.args[0]['info'] else "")
        except ldap.LDAPError as e:
          logger.error(e)
          return False,"更新字段失败，失败内容:%s"%(e.args[0]['info'] if e.args[0]['info'] else "")
      if modrdn!='':
        try:
          self.conn.modrdn_s(olddn,modrdn)
          newrdn=rdn_prefix
          newrdn[0]=modrdn
          return {'newdn':','.join(newrdn),'status':"更新用户成功"},None
        except ldap.INVALID_DN_SYNTAX as e:
          logger.error(e)
          return False,"DN修改失败:%s"%(e.args[0]['info'] if e.args[0]['info'] else "")
      return False,'字段没有发生变化，修改不成功。'

  def create_ldap_entry_dn(self,data,parentDn=settings.AUTH_LDAP_BASE_DN):
      """
      创建DN
      """
    
      dn_pre , newdata = generate_ldap_dn_prefix(data)
      modlist=""
      if not dn_pre:
        return False, newdata
      else:
        modlist = convert_dict_to_tuple_bytes(newdata)
      newdn="%s,%s"%(dn_pre,parentDn if parentDn!="" else settings.AUTH_LDAP_BASE_DN )
      if self.connect():
        try:
          self.conn.add_s(newdn,modlist)
        except ldap.ALREADY_EXISTS as e:
          logger.error(e)
          return False,"用户已经存在。"
        except ldap.INVALID_SYNTAX as e:
          logger.error(e)
          return False,"字段值不合法。%s"%e
        except ldap.LDAPError as e:
          logger.error(e)
          return False,e.args[0]
      logger.info("create user %s success,dn:%s" % (dn_pre, newdn))
      return "添加用户%s成功" % dn_pre, None

  def delete_ldap_dn(self, data):
      """
      删除用户
      """
      if self.connect():
        try:
          for dn in data['currentDn']:
            self.conn.delete_s(dn)
        except ldap.NO_SUCH_OBJECT as e:
          return False, "没有找到此EntryDN信息,无法删除。"
        except ldap.LDAPError as e:
          return False, e.args[0]
      return "删除用户%s成功" % (';'.join(data['currentDn'])), None

  def get_user_permissions(self,userdn=""):
    """ 返回所有LDAP DN属性 """
    if self.connect() and userdn:
      searchFilter="(|(member={})(uniqueMember={})(memberUid={}))".format(userdn,userdn,userdn.split(',')[0].split('=')[1])
      result_id=self.conn.search(settings.AUTH_LDAP_GROUP_SEARCH_OU, ldap.SCOPE_SUBTREE, searchFilter, None)
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
  def save_permissions_group(self,permissData={}):
    """ 保存用户的组权限 """
    if self.connect() and permissData:
      for i,v in permissData.items():
        data=convert_string_to_bytes(v)
        modlist=[]
        for it, vl in data.items():
          modlist.append((ldap.MOD_REPLACE,it,vl))
        try:
          self.conn.modify_s(i, modlist)
        except ldap.LDAPError as e:
          return False,e.args[0]
      return "保存用户权限成功!", None
    else:
      return None,self.errorMsg
  def update_sshpublickey(self,data,olddn):
    """
    更新用户属性用户
    """
    returnStatus=False,'字段没有发生变化，修改不成功。'
    dndata,err=self.get_dn_attribute(olddn)
    if dndata:
      modlist=[]
      classObj=set(dndata[0][1]['objectClass'])
      if b"ldapPublicKey" not in classObj:
        classObj.add(b"ldapPublicKey")
        modlist.append((ldap.MOD_REPLACE,"objectClass",list(classObj)))
      if "sshPublicKey" in dndata[0][1]:
        modlist.append((ldap.MOD_REPLACE,"sshPublicKey",[data.get('sshPublicKey').encode('utf8')]))
      else:
        modlist.append((ldap.MOD_ADD,"sshPublicKey",[data.get('sshPublicKey').encode('utf8')]))
        
      if len(modlist)>0:
        logger.info("modlist:%s"%modlist)
        try:
          self.conn.modify_s(olddn,modlist)
          returnStatus="更新用户成功",None
        except ldap.LDAPError as e:
          logger.error(e)
          return False,"更新字段失败，失败内容:%s"%(e.args[0]['info'] if e.args[0]['info'] else "")
      return returnStatus