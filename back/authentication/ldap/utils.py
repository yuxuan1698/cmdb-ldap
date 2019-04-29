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