import ldap
import operator



def modifyModList(olddata={},newdata={}):
  modlist=[]
  old_keys=olddata.keys()
  new_keys=newdata.keys()
  diff_old_new = list(set(old_keys).difference(set(new_keys)))
  for k in diff_old_new:
    modlist.append((ldap.MOD_DELETE,k,None))
  diff_new_old = list(set(new_keys).difference(set(old_keys)))
  for s in diff_new_old:
    modlist.append((ldap.MOD_ADD, s, newdata[s]))
  for i, v in newdata.items():
    if isinstance(v,list) and i in old_keys:
      if i == 'userPassword' and v==[b'']:
        continue
      if not operator.eq(v, olddata[i]):
        modlist.append((ldap.MOD_REPLACE, i, v))
      continue
    if i in old_keys and v != olddata[i][0]:
      modlist.append((ldap.MOD_REPLACE,i,v))
  return modlist


def generate_ldap_dn_prefix(data):
  """
    生成LDAP的DN前缀
  """
  dn_prefix = ""
  popid = ""
  if 'uid' in data.keys():
    dn_prefix = "uid=%s" % data['uid']
    popid = 'uid'
  elif 'cn' in data.keys():
    dn_prefix = "cn=%s" % data['cn']
    popid = 'cn'
  elif 'ou' in data.keys():
    dn_prefix = "ou=%s" % data['ou']
    popid = 'ou'
  elif 'o' in data.keys():
    dn_prefix = "o=%s" % data['o']
    popid = 'o'
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