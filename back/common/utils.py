import logging,json
from django.core.serializers.json import DjangoJSONEncoder
from django.core.mail import EmailMultiAlternatives
from email.header import make_header
import base64
import io,os
import qrcode



class SendEMail(EmailMultiAlternatives):
  """docstring for SendEMail"""
  def __init__(self):
    super().__init__(
      subject='', 
      body='', 
      from_email=None, 
      to=None,
      bcc=None,
      connection=None,
      attachments=None,
      headers=None,
      cc=None,
      reply_to=None)
  def title(self,val):
    self.subject=val
    return self
  def content(self,val):
    self.body=val
    self.attach_alternative(self.body, "text/html")
    return self
  def mailto(self,val):
    self.to=val
    return self
  def mailcc(self,val):
    self.cc=val
    return self

  def attach_file(self,files):
    if isinstance(files,list):
      for file in files:
        super().attach_file(os.path.realpath(file))
    else:
        super().attach_file(os.path.realpath(files))
    return self
  def send(self):
    try:
      status=super().send()
      return status
    except Exception as e:
      raise e


def generateQRCode(encodedata=''):
  qr = qrcode.QRCode(     
      version=1,     
      error_correction=qrcode.constants.ERROR_CORRECT_L,     
      box_size=20,     
      border=1, 
  )
  qr.make(fit=True) 
  qr.add_data(encodedata)
  img = qr.make_image()

  buf = io.BytesIO()
  img.save(buf,format='PNG')
  image_stream = buf.getvalue()
  heximage = base64.b64encode(image_stream)
  return 'data:image/png;base64,' + heximage.decode()
  
class LDAPJSONEncoder(DjangoJSONEncoder):
  """
  解码Byte to STRING 的JSON转换
  JSONEncoder subclass that knows how to encode date/time, decimal types, and
  UUIDs.
  """
  def default(self, o):
    # See "Date Time String Format" in the ECMA-262 specification.
    if isinstance(o, bytes):
      return str(o, encoding='utf-8')
    else:
      return super().default(o)

class CmdbLDAPLogger():
  """ 
  日志输出部分
  """
  logger = None
  @classmethod
  def get_logger(cls,logger_name="django.server"):
    """
    Initializes and returns our logger instance.
    """
    if cls.logger is None:
      cls.logger = logging.getLogger(logger_name)
      cls.logger.addHandler(logging.NullHandler())
    return cls.logger

class CmdbJson(LDAPJSONEncoder):
    """
    JSON数据格式化
    """
    # @staticmethod
    def encode(self,data):
      return json.loads(data)
      
    # @staticmethod
    def decode(self,data):
      return json.loads(self.default(data))

def Sign_Url_By_MD5(data):
  import hashlib
  m5=hashlib.md5()
  md5str=""
  if isinstance(data,dict):
    keys=sorted(data.keys())
    for n in keys:
      md5str="{}{}={}&".format(md5str,n,data.get(n))
  else:
    md5str=data
  m5.update(md5str.encode('utf-8'))
  md5str="{}{}={}".format(md5str,'sign',m5.hexdigest())
  return md5str

def generat_random_password(data='',encode=False):
  import string
  import random
  salt = ''.join(random.sample(string.ascii_letters + string.digits+'_$#@!%^&*()', 12))
  if encode:
    return salt.encode('utf-8')
  return salt