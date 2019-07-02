from rest_framework.views import APIView
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.http import JsonResponse
from rest_framework import status
from django_celery_results.models import TaskResult
from django.core.serializers import serialize
from common.utils import CmdbLDAPLogger,CmdbJson
from django.core.cache import cache
from api.backend.aliyun import AliClound
from .serializers import CerificateInvalidSerializer
from common.utils import check_cerificate_invalidtime
from django.conf import settings

aliClound=AliClound()
logger=CmdbLDAPLogger().get_logger('django.server')
# Users = get_user_model()

class getCrontabLogsViewSet(APIView):
  """
  允许用户查看或编辑的API路径test。
  """
  # serializer_class=UserGroupSerializer
  
  def get(self,request, *args, **kwargs):
    pageSize=request.GET.get('pageSize') or 15
    page=request.GET.get('page') or 1
    response = {}
    results = TaskResult.objects.all().order_by('pk')
    paginator = Paginator(results, pageSize)
    response['total'] = paginator.count
    try:
        mailTask = paginator.page(page)
    except PageNotAnInteger:
        mailTask = paginator.page(1)
    except EmptyPage:
        mailTask = paginator.page(paginator.num_pages)
    logger.info(mailTask)
    response['list'] = CmdbJson().encode(serialize("json", mailTask))
    return JsonResponse(response, safe=False)

class getAliCloundEcsListSet(APIView):
  """
  列出阿里云主机列表
  """
  def get(self,request, *args, **kwargs):
    PageSize=request.GET.get('pageSize') or 15
    Page=request.GET.get('page') or 1
    RegionId=request.GET.get('region') or 'cn-shenzhen'
    tagkey=request.GET.get('tagkey') 
    tagvalue=request.GET.get('tagvalue')
    currAccount=request.GET.get('currAccount') or 'wbd'
    Tags=[]
    if tagkey and tagvalue:
      Tags=[{'Key':tagkey,'Value':"" if tagkey==tagvalue else tagvalue}]
    response = {}
    cacheEcs=aliClound.setAccount(currAccount).getAliCloundEcsList(RegionId,PageSize,Page,Tags)
    if cacheEcs:
      data=CmdbJson().decode(cacheEcs)
      response['total']=data.get('TotalCount')
      response['pageSize']=PageSize
      response['ecslist']=data.get('Instances').get('Instance')
      return JsonResponse(response, safe=False)
    else:
      return JsonResponse({'error':'获取ECS列表信息出错，请检查！'},status=status.HTTP_400_BAD_REQUEST,safe=False)

class getAliCloundRegionListSet(APIView):
  """
  列出阿里云主机列表
  """
  def get(self,request, *args, **kwargs):
    cacheRigions=cache.get('cacheRigions')
    if not cacheRigions:
      cacheRigions=aliClound.getAliCloundRegionsList()
      cache.set('cacheRigions',cacheRigions)
    if cacheRigions:
      data=CmdbJson().decode(cacheRigions)
      response = []
      # if 'Regions' in data:
      response=data.get('Regions').get('Region')
      return JsonResponse(response, safe=False)
    else:
      return JsonResponse({'error':'获取Rigion信息出错，请检查！'},status=status.HTTP_400_BAD_REQUEST,safe=False)

class getAliCloundCerificateCountSet(APIView):
  """
  列出阿里云主机列表
  """
  def get(self,request, *args, **kwargs):
    CertificateCount = aliClound.getAliCloundCertificateStatusCount()
    if CertificateCount:
      return JsonResponse(CertificateCount, safe=False)
    else:
      return JsonResponse({'error':'获取Rigion信息出错，请检查！'},status=status.HTTP_400_BAD_REQUEST,safe=False)

class getAliCloundCerificateListSet(APIView):
  """
  列出阿里云证书列表
  """
  def get(self,request, *args, **kwargs):
    certicateStatus = request.GET.get('status') or ''
    PageSize=request.GET.get('pageSize') or 15
    Page=request.GET.get('page') or 1
    currAccount=request.GET.get('currAccount') or 'wbd'

    CertificateList = aliClound.setAccount(currAccount).getAliCloundCertificateList(certicateStatus,PageSize,Page)
    if CertificateList:
      data=CmdbJson().decode(CertificateList)
      return JsonResponse(data, safe=False)
    else:
      return JsonResponse({'error':'获取Rigion信息出错，请检查！'},status=status.HTTP_400_BAD_REQUEST,safe=False)

class getAliCloundCerificateLocationsSet(APIView):
  """
  列出阿里云证书列表
  """
  def get(self,request, *args, **kwargs):
    status = request.GET.get('status') or ''
    CertificateLocation = aliClound.getAliCloundCertificateLocationList()
    if CertificateLocation:
      data=CmdbJson().decode(CertificateLocation)
      return JsonResponse(data, safe=False)
    else:
      return JsonResponse({'error':'获取Certificate Location信息出错，请检查！'},status=status.HTTP_400_BAD_REQUEST,safe=False)

class getAliCloundTagsListSet(APIView):
  """
  列出阿里云ECS Tags列表
  """
  def get(self,request, *args, **kwargs):
    RegionId = request.GET.get('region') or ''
    currAccount = request.GET.get('currAccount') or 'wbd'
    TagsList = aliClound.setAccount(currAccount).getAliCloundTagsList(RegionId)
    if TagsList:
      data=CmdbJson().decode(TagsList)
      return JsonResponse(data, safe=False)
    else:
      return JsonResponse({'error':'获取Tags信息出错，请检查！'},status=status.HTTP_400_BAD_REQUEST,safe=False)

class getAliCloundEcsAllStatusSet(APIView):
  """
  列出阿里云ECS Tags列表
  """
  def get(self,request, *args, **kwargs):
    TagsList = aliClound.getAliCloundEcsAllStatus()
    if TagsList:
      return JsonResponse(TagsList, safe=False)
    else:
      return JsonResponse({'error':'获取Tags信息出错，请检查！'},status=status.HTTP_400_BAD_REQUEST,safe=False)



class getCheckCerificateInvalidViewSet(APIView):
  """
  检查证书过期时间
  """
  def get(self,request, *args, **kwargs):
    serializer = CerificateInvalidSerializer(instance=request, data=request.GET)
    if serializer.is_valid():
      domain = serializer.validated_data.get('domain')
      port = serializer.validated_data.get('port')
      if port:
        invalid= check_cerificate_invalidtime(domain,port)
      else:
        invalid,msg= check_cerificate_invalidtime(domain)
      if invalid:
        return JsonResponse(msg, safe=False)
      else:
        return JsonResponse({'error':msg},status=status.HTTP_400_BAD_REQUEST,safe=False)
    else:
      return JsonResponse(serializer.errors,status=status.HTTP_400_BAD_REQUEST,safe=False)
    return JsonResponse({'error':'获取域名信息出错或者超时，请检查！'},status=status.HTTP_400_BAD_REQUEST,safe=False)


class getAliCloundEcsDomainListSet(APIView):
  """
  列出阿里云域名列表
  """
  def get(self,request, *args, **kwargs):
    DomainList = aliClound.getAliCloundDomainList()
    if DomainList:
      return JsonResponse(DomainList, safe=False)
    else:
      return JsonResponse({'error':'获取domain信息出错，请检查！'},status=status.HTTP_400_BAD_REQUEST,safe=False)

class getAliCloundDashboardStatusSet(APIView):
  """
  列出面板数据
  """
  def get(self,request, *args, **kwargs):
    DashboardData = aliClound.getAliCloundDashboardStatus()
    if DashboardData:
      data=CmdbJson().decode(DashboardData)
      return JsonResponse(data, safe=False)
    else:
      return JsonResponse({'error':'获取Dashboard信息出错，请检查！'},status=status.HTTP_400_BAD_REQUEST,safe=False)

class getAliCloundAcountNameListSet(APIView):
  """
  列出面板数据
  """
  def get(self,request, *args, **kwargs):
    aliaccount=[{'key':s,'name':v.get('Name')} for s,v in settings.ALI_CLOUND_API_ACCOUNT.items()]
    aliaccount.reverse()
    if aliaccount:
      return JsonResponse(aliaccount, safe=False)
    else:
      return JsonResponse({'error':'获取多个阿里云帐号列表信息出错，请检查！'},status=status.HTTP_400_BAD_REQUEST,safe=False)
