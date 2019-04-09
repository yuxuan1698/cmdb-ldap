import logging,json
from django.core.serializers.json import DjangoJSONEncoder

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