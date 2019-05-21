import logging,json
from django.core.serializers.json import DjangoJSONEncoder
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from email.header import make_header
import base64
import io
import qrcode

def SendEMail(to,subject,html_content,attack_file):
    logger=CmdbLDAPLogger().get_logger('django.server')
    if not to or not subject or not html_content:
      return False
    try:
      msg = EmailMultiAlternatives(subject, html_content, settings.EMAIL_HOST_USER, [to])
      msg.attach_alternative(html_content, "text/html")
      # filename = make_header([(attack_file, 'utf-8')]).encode('utf-8')
      if attack_file:
        msg.attach_file(attack_file)
      msg.send()
    except Exception as e:
      logger.error(e)
      logger.error("邮件发送失败！")
      return False
    return True

def generateQRCode(encodedata=''):
  qr = qrcode.QRCode(     
      version=1,     
      error_correction=qrcode.constants.ERROR_CORRECT_L,     
      box_size=20,     
      border=1, 
  )
  qr.make(fit=True) 
  qr.add_data("{}/{}".format(settings.CMDB_BASE_URL,encodedata))
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
