from aliyunsdkcore.client import AcsClient
from aliyunsdkcore.acs_exception.exceptions import ClientException
from aliyunsdkcore.acs_exception.exceptions import ServerException
from aliyunsdkecs.request.v20140526.DescribeInstancesRequest import DescribeInstancesRequest
from aliyunsdkecs.request.v20140526.DescribeRegionsRequest import DescribeRegionsRequest
from aliyunsdkecs.request.v20140526.StopInstanceRequest import StopInstanceRequest
from common.utils import CmdbLDAPLogger
from django.conf import settings
logger=CmdbLDAPLogger().get_logger('django.server')

class AliClound():
    def __init__(self):
        self.secreyKey=settings.ALI_CLOUND.get('ACCESSKEY') or ''
        self.accesssecret=settings.ALI_CLOUND.get('ACCESSSECRET') or ''
    # @staticmethod
    def getAliCloundRegionsList(self):
        client=AcsClient(self.secreyKey,self.accesssecret)
        req=DescribeRegionsRequest()
        req.set_accept_format('json')
        try:
            data=client.do_action(req)
            if data:
                return data
            else:
                return False
        except Exception as e:
            logger.error(e)
            return False
            
    def getAliCloundEcsList(self,RegionId='cn-shenzhen',PageSize=15,Page=1):
        client=AcsClient(self.secreyKey,self.accesssecret,RegionId)
        req=DescribeInstancesRequest()
        req.set_PageSize(PageSize)
        req.set_PageNumber(Page)
        req.set_accept_format('json')
        try:
            data=client.do_action(req)
            if data:
                return data
            else:
                return False
        except Exception as e:
            logger.error(e)
            return False