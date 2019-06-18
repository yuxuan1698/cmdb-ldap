from rest_framework.views import APIView
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.http import JsonResponse
from rest_framework import status
from django_celery_results.models import TaskResult
from django.core.serializers import serialize
from common.utils import CmdbLDAPLogger,CmdbJson
from django.core.cache import cache
from api.backend.aliyun import AliClound

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
    response = {}
    logger.info(RegionId)
    # cacheEcs=cache.get('cacheEcs_%s%s'%(Page,PageSize))
    # if not cacheEcs:
    cacheEcs=aliClound.getAliCloundEcsList(RegionId,PageSize,Page)
      # cache.set('cacheEcs_%s%s'%(Page,PageSize),cacheEcs)
    if cacheEcs:
      data=CmdbJson().decode(cacheEcs)
      response['total']=data.get('TotalCount')
      response['pageSize']=PageSize
      response['ecslist']=data.get('Instances').get('Instance')
      return JsonResponse(response, safe=False)
    else:
      return JsonResponse({'error':'获取Rigion信息出错，请检查！'},status=status.HTTP_400_BAD_REQUEST,safe=False)

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



# class GetGroupViewSet(APIView):
#   """
#   允许用户查看或编辑的API路径test。
#   """
#   serializer_class=UserGroupSerializer
  
#   def listgroups():
#     queryset = Users.objects.all()