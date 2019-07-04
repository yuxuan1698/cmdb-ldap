from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from celery.schedules import crontab
# set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cmdb.settings')

app = Celery('crontasks')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

# app.conf.beat_schedule = {
#     # 设置定时任务的参数,key可以自定义,见名知义,value为定时任务的相关参数的字典
#     'getAliyunCerificateList-every-1-minute': {
#         # 指定要执行的任务函数
#         'task': 'crontasks.tasks.getAliyunCerificateList',
#         # 设置定时启动的频率,没分钟执行一次任务函数
#         'schedule': crontab(minute='*/1'),
#         # 传入任务函数的参数,可以是一个列表或元组,如果函数没参数则为空列表或空元组
#         'args': []
#     },
# }
# Load task modules from all registered Django app configs.
app.autodiscover_tasks()


@app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))


