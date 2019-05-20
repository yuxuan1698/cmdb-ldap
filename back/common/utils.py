import logging,json
from django.core.serializers.json import DjangoJSONEncoder
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.template import Context
from django.conf import settings
import base64
import io
import qrcode

def SendEMail(to,subject,data):
    logger=CmdbLDAPLogger().get_logger('django.server')
    # try:
    # content=Context({'username': 'username'})
    text_content = render_to_string('add_user.html',{'username': 'username'})
    html_content = render_to_string('add_user.html',{'username': 'username'})
    msg = EmailMultiAlternatives(subject, text_content, settings.EMAIL_HOST_USER, [to])
    msg.attach_alternative(html_content, "text/html")
    msg.send()
    # except Exception as e:
    #   logger.error(e)
    #   logger.error("邮件发送失败！")
    #   return False
    return True

def generateQRCode(encodedata='https://www.baidu.com'):
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
    def encode(self,data):
      return json.loads(data)
    def decode(self,data):
      return json.loads(self.default(data))
