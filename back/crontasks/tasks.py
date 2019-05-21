
from common.utils import SendEMail,generateQRCode
from celery import shared_task
from django.template.loader import render_to_string
from common.utils import CmdbLDAPLogger


logger=CmdbLDAPLogger().get_logger('cmdb_ldap')

@shared_task
def send_register_email(to,data):
  data['qrcode']=generateQRCode("?token=\"\"&sha1=slkdfjslkdfjsdlkfjsdlkfjsdlk&username=''")
  html_content = render_to_string('add_user.html',data)
  status=SendEMail(to,
    "Hi,{},您的用户信息添加成功。".format(data['sn']),
    html_content,
    './pulic/iwubida.ovpen')
  return status