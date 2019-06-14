from rest_framework.views import APIView
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.http import JsonResponse
from rest_framework import status
from django_celery_results.models import TaskResult
from django.core.serializers import serialize
from common.utils import CmdbLDAPLogger
import json
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
    response['list'] = json.loads(serialize("json", mailTask))
    return JsonResponse(response, safe=False)


# class GetGroupViewSet(APIView):
#   """
#   允许用户查看或编辑的API路径test。
#   """
#   serializer_class=UserGroupSerializer
  
#   def listgroups():
#     queryset = Users.objects.all()