from aliyunsdkcore.client import AcsClient
from aliyunsdkcore.acs_exception.exceptions import ClientException
from aliyunsdkcore.acs_exception.exceptions import ServerException
from aliyunsdkecs.request.v20140526.DescribeInstancesRequest import DescribeInstancesRequest
from aliyunsdkecs.request.v20140526.DescribeRegionsRequest import DescribeRegionsRequest
from aliyunsdkecs.request.v20140526.DescribeTagsRequest import DescribeTagsRequest
from aliyunsdkecs.request.v20140526.DescribeInstanceMonitorDataRequest import DescribeInstanceMonitorDataRequest
from aliyunsdkecs.request.v20140526.DescribeInstancesFullStatusRequest import DescribeInstancesFullStatusRequest
from aliyunsdkecs.request.v20140526.DescribeDisksFullStatusRequest import DescribeDisksFullStatusRequest
from aliyunsdkcas.request.v20180813.DescribeCertificateStatusCountRequest import DescribeCertificateStatusCountRequest
from aliyunsdkcas.request.v20180813.DescribeCertificateListRequest import DescribeCertificateListRequest
from aliyunsdkcas.request.v20180813.DescribeOrderListRequest import DescribeOrderListRequest
from aliyunsdkcas.request.v20180813.DescribeLocationListRequest import DescribeLocationListRequest
from aliyunsdkdomain.request.v20180129.QueryDomainListRequest import QueryDomainListRequest
# rds
from aliyunsdkrds.request.v20140815.DescribeDBInstancesRequest import DescribeDBInstancesRequest
# from rest_framework_jwt.authentication import dT
from datetime import datetime
from django.core.cache import cache
from django.conf import settings
from common.utils import (
    CmdbLDAPLogger,
    CmdbJson
    )
logger=CmdbLDAPLogger().get_logger('django.server')
 
class AliClound():
    Account='wbd'
    def __init__(self):
        self.secreyKey=settings.ALI_CLOUND_API_ACCOUNT.get('wbd').get('accesskey') or ''
        self.accesssecret=settings.ALI_CLOUND_API_ACCOUNT.get('wbd').get('accesssecret') or ''

    # @classmethod
    def setAccount(self,Account='wbd'):
        if Account in settings.ALI_CLOUND_API_ACCOUNT:
            self.secreyKey=settings.ALI_CLOUND_API_ACCOUNT.get(Account).get('accesskey') 
            self.accesssecret=settings.ALI_CLOUND_API_ACCOUNT.get(Account).get('accesssecret') 
        return self
           

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

    def getAliCloundRdsList(self,RegionId='cn-shenzhen',PageSize=15,Page=1,Tags=[]):
        client=AcsClient(self.secreyKey,self.accesssecret,RegionId)
        req=DescribeDBInstancesRequest()
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

    def getAliCloundEcsMonitorDataList(self,InstanceID='',StartTime="",EndTime=""):
        client=AcsClient(self.secreyKey,self.accesssecret)
        req=DescribeInstanceMonitorDataRequest()
        # req.set_PageSize(PageSize)
        # req.set_PageNumber(Page)
        # if len(Tags)>0:
        #     req.set_Tags(Tags)
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
        alldata={}
        for k,v in settings.ALI_CLOUND_API_ACCOUNT.items():
            client=AcsClient(v.get('accesskey'),v.get('accesssecret'))
            req = DescribeCertificateStatusCountRequest()
            req.set_accept_format('json')
            try:
                data=CmdbJson().decode(client.do_action_with_exception(req))
                for s,m in data.items():
                    # logger.info(s)
                    if s in alldata:
                        alldata[s]=alldata[s]+m
                    else:
                        alldata[s]=m
            except Exception as e:
                logger.error(e)
                return False
        return alldata

    def getAliCloundCertificateLocationList(self):
        client=AcsClient(self.secreyKey,self.accesssecret)
        req = DescribeLocationListRequest()
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

    def getAliCloundCertificateList(self,Status='',PageSize=15,Page=1):
        """
        获取证书列表
        """
        client=AcsClient(self.secreyKey,self.accesssecret)
        if Status!='REVOKED':
            req = DescribeCertificateListRequest()
        else:
            req = DescribeOrderListRequest()
        req.set_Status(Status)
        req.set_CurrentPage(Page)
        req.set_ShowSize(PageSize)
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

    def getAliCloundEcsAllStatus(self,RegionIds='cn-shenzhen'):
        """
        获取ECS统计列表
        """
        ecsData=cache.get('ecsData')
        if not ecsData:
            ecsData={"count": 0,
                    "runCount":0,
                    "expireWill":0}
            for user in settings.ALI_CLOUND_API_ACCOUNT:
                ecsList = self.setAccount(user).getAliCloundEcsList(PageSize=100)

                data=CmdbJson().decode(ecsList)
                ecsData['count']+=data.get('TotalCount')
                ecslist=data.get('Instances').get('Instance')
                for a in ecslist:
                    expiredtime=a.get('ExpiredTime')
                    invalidtime = datetime.strptime(expiredtime, '%Y-%m-%dT%H:%MZ')
                    diff_day = invalidtime - datetime.now()
                    if diff_day.days<=30:
                        ecsData['expireWill']+=1
                    if a.get('Status')=='Running':
                        ecsData['runCount']+=1
                cache.set('ecsData',ecsData)
        return ecsData

    def getAliCloundRdsAllStatus(self,RegionIds='cn-shenzhen'):
        """
        获取ECS统计列表
        """
        rdsData=cache.get('rdsData')
        if not rdsData:
            rdsData={"count": 0,
                    "runCount":0,
                    "expireWill":0}
            for user in settings.ALI_CLOUND_API_ACCOUNT:
                rdsList = self.setAccount(user).getAliCloundRdsList(PageSize=100)
                data=CmdbJson().decode(rdsList)
                rdsData['count']+=data.get('PageRecordCount')
                rdsinstance=data.get('Items').get('DBInstance')
                for a in rdsinstance:
                    expiredtime=a.get('ExpireTime')
                    invalidtime = datetime.strptime(expiredtime, '%Y-%m-%dT%H:%M:%SZ')
                    diff_day = invalidtime - datetime.now()
                    if diff_day.days<=30:
                        rdsData['expireWill']+=1
                    if a.get('DBInstanceStatus')=='Running':
                        rdsData['runCount']+=1
                cache.set('rdsData',rdsData)
        return rdsData

    def getAliCloundDomainList(self):
        """
        获取域名列表
        """
        alldata={}
        for k,v in settings.ALI_CLOUND_API_ACCOUNT.items():
            client=AcsClient(v.get('accesskey'),v.get('accesssecret'))
            req = QueryDomainListRequest()
            req.set_PageNum(1)
            req.set_PageSize(100)
            req.set_accept_format('json')
            try:
                data=CmdbJson().decode(client.do_action_with_exception(req))
                if 'Data' in alldata:
                    if type(alldata['Data']['Domain']) == list:
                        alldata['Data']['Domain'].extend(data['Data']['Domain'])
                        alldata['TotalItemNum']+=data['TotalItemNum']
                else:
                    alldata=data
            except Exception as e:
                logger.error(e)
                return False
        return alldata