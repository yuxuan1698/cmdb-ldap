from django.conf import settings
from django.core.cache import cache
from common.utils import (
    CmdbLDAPLogger,
    CmdbJson
    )
from io import StringIO
from paramiko.rsakey import RSAKey
from paramiko.ecdsakey import ECDSAKey

from paramiko.dsskey import DSSKey
# from paramiko.ed25519key import Ed25519Key
import os

logger=CmdbLDAPLogger().get_logger('django.server')

class GenerateSSHKey():
    def __init__(self,obj):
        self.username=obj.get('username')
        self.basename=obj.get('email') or "%s@%s"%(obj.get('username') or "cmdbuser",os.uname()[1])
        self.keytype=obj.get('keytype') or 'ecdsa'
        self.rsabits=obj.get('rsabits') or 2048
        self.ecdsabits=obj.get('ecdsabits') or 384
        self.dssbits=obj.get('dssbits') or 2048

    def generatekey(self):
        public_key=StringIO()
        private_key=StringIO()
        public_key_value=None
        private_key_value=None
        try:
            if self.keytype=='rsa':
                key=RSAKey.generate(self.rsabits)
            elif self.keytype == 'ecdsa':
                key=ECDSAKey.generate(bits=self.ecdsabits)
            elif self.keytype == 'dss':
                key=DSSKey.generate(bits=self.dssbits)
            else:
                return None,"sshkey暂时不支持其它类型 %s"%self.keytype
            key.write_private_key(private_key)
            public_key.write("%s %s %s"%(
                key.get_name(),
                key.get_base64(),
                self.basename
            ))
            public_key_value=public_key.getvalue()
            private_key_value=private_key.getvalue()
            cache.set("user_%s_private_key"%self.username,private_key_value)
            cache.set("user_%s_public_key"%self.username,public_key_value)
            
        except Exception as e:
            logger.error(e.args)
            return None,e.args
        finally:
            public_key.close()
            private_key.close()
        return {"publickey":public_key_value,"privatekey":private_key_value},None
        

