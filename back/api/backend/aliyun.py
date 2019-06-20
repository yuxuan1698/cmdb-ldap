from aliyunsdkcore.client import AcsClient
from aliyunsdkcore.acs_exception.exceptions import ClientException
from aliyunsdkcore.acs_exception.exceptions import ServerException
from aliyunsdkecs.request.v20140526.DescribeInstancesRequest import DescribeInstancesRequest
from aliyunsdkecs.request.v20140526.DescribeRegionsRequest import DescribeRegionsRequest
from aliyunsdkecs.request.v20140526.DescribeTagsRequest import DescribeTagsRequest
from aliyunsdkecs.request.v20140526.DescribeInstanceStatusRequest import DescribeInstanceStatusRequest
from aliyunsdkcas.request.v20180813.DescribeCertificateStatusCountRequest import DescribeCertificateStatusCountRequest
from aliyunsdkcas.request.v20180813.DescribeCertificateListRequest import DescribeCertificateListRequest
# from aliyunsdkots.request.v20160620.ListTagsRequest import ListTagsRequest

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
        # req.set_AcceptLanguage(language)
        req.set_accept_format('json')
        try:
            data=client.do_action_with_exception(req)
            if data:
                return data
            else:
                return False
        except Exception as e:
            logger.error(e)
            return False
            
    def getAliCloundEcsList(self,RegionId='cn-shenzhen',PageSize=15,Page=1,Tags=[]):
        client=AcsClient(self.secreyKey,self.accesssecret,RegionId)
        req=DescribeInstancesRequest()
        req.set_PageSize(PageSize)
        req.set_PageNumber(Page)
        if len(Tags)>0:
            req.set_Tags(Tags)
        req.set_accept_format('json')
        try:
            data=client.do_action_with_exception(req)
            if data:
                return data
            else:
                return False
        except Exception as e:
            logger.error(e)
            return False

    def getAliCloundCertificateStatusCount(self):
        client=AcsClient(self.secreyKey,self.accesssecret)
        req = DescribeCertificateStatusCountRequest()
        req.set_accept_format('json')
        try:
            data=client.do_action_with_exception(req)
            if data:
                return data
            else:
                return False
        except Exception as e:
            logger.error(e)
            return False

    def getAliCloundCertificateList(self,status=''):
        """
        获取证书列表
        """
        client=AcsClient(self.secreyKey,self.accesssecret)
        req = DescribeCertificateListRequest()
        if status!='':
            req.set_Status(status)
        req.set_accept_format('json')
        try:
            data=client.do_action_with_exception(req)
            if data:
                return data
            else:
                return False
        except Exception as e:
            logger.error(e)
            return False

    def getAliCloundTagsList(self,RegionId='cn-shenzhen'):
        """
        获取标签列表
        """
        client=AcsClient(self.secreyKey,self.accesssecret,RegionId)
        req = DescribeTagsRequest()
        req.set_ResourceType('instance')
        req.set_accept_format('json')
        try:
            data=client.do_action_with_exception(req)
            if data:
                return data
            else:
                return False
        except Exception as e:
            logger.error(e)
            return False

    def getAliCloundEcsAllStatus(self,RegionIds=['cn-shenzhen']):
        """
        获取标签列表
        """
        client=AcsClient(self.secreyKey,self.accesssecret)
        req = DescribeInstanceStatusRequest()
        # req.set_ResourceType('instance')
        req.set_accept_format('json')
        try:
            data=client.do_action_with_exception(req)
            if data:
                return data
            else:
                return False
        except Exception as e:
            logger.error(e)
            return False
