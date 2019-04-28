from django.conf import settings
from hashlib import sha1
from base64 import (b64encode as encode,
                   b64encode as decode)
import os

from common.utils import CmdbLDAPLogger

logger=CmdbLDAPLogger().get_logger('cmdb_ldap')

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

def generate_ldap_password(password):
    """
    SSHA密码生成
    """
    salt = os.urandom(4)
    shapass = sha1(password.encode('utf-8'))
    shapass.update(salt)
    return str(b"{SSHA}" + encode(shapass.digest() + salt), encoding='utf-8')

def check_ldap_password(ldap_password, password):
    """
    验证密码
    """
    ldap_password_bytes = decode(ldap_password[6:])
    digest = ldap_password_bytes[:20]
    salt = ldap_password_bytes[20:]
    hr = sha1(password)
    hr.update(salt)
    return digest == hr.digest()


def generate_ldap_dn_prefix(data):
  """
    生成LDAP的DN前缀
  """
  dn_prefix = ""
  popid = ""
  if 'cn' in data.keys():
    dn_prefix = "cn=%s" % data['cn']
    popid = 'cn'
  if 'ou' in data.keys():
    dn_prefix = "ou=%s" % data['ou']
    popid = 'ou'
  if 'uid' in data.keys():
    dn_prefix = "uid=%s" % data['uid']
    popid = 'uid'
  data.pop(popid)
  return dn_prefix,data

def convert_dict_to_tuple_bytes(val,turnList=False):
  """
  转换ldap需要的对象
  """
  dict_to_tuple=[]
  if isinstance(val,dict) or isinstance(val,tuple):
    for k,v in val.items():
        dict_to_tuple.append((k,convert_dict_to_tuple_bytes(v)))
  
  if isinstance(val, list):
    for i in val:
      dict_to_tuple.append(convert_dict_to_tuple_bytes(i,True))

  if isinstance(val,int):
    if turnList:
      return ("%s"%val).encode('utf-8')
    dict_to_tuple.append(("%s"%val).encode('utf-8'))
  if isinstance(val,str):
    if turnList:
      return val.encode('utf-8')
    dict_to_tuple.append(val.encode('utf-8'))

  return dict_to_tuple   

def convert_string_to_bytes(val,onlist=True):
  bytes_dict={}
  if isinstance(val,dict) or isinstance(val,tuple):
    for k,v in val.items():
      bytes_dict[k]=convert_string_to_bytes(v)
  if isinstance(val, list):
    return [ convert_string_to_bytes(i,False) for i in val]
  if isinstance(val, int) or isinstance(val, str):
    if onlist:
      return [("%s"%val).encode('utf-8')]
    else:
      return ("%s"%val).encode('utf-8')
  return bytes_dict


def convert_bytes_to_string(val,onlist=True):
  bytes_dict={}
  if isinstance(val,dict) or isinstance(val,tuple):
    for k,v in val.items():
      bytes_dict[k] = convert_bytes_to_string(v)
  if isinstance(val, list):
    return [convert_bytes_to_string(i, False) for i in val]
  if isinstance(val,bytes):
    if onlist:
      return [val.decode('utf-8')]
    else:
      return val.decode('utf-8')
  return bytes_dict


      
