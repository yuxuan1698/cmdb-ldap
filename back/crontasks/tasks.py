
from common.utils import SendEMail,generateQRCode
from celery import shared_task
from django.template.loader import render_to_string
from common.utils import CmdbLDAPLogger
import os

logger=CmdbLDAPLogger().get_logger('cmdb_ldap')

@shared_task
def send_register_email(to,data):
  logger.info(os.path.realpath(__file__))
  mail=SendEMail()
  data['qrcode']=generateQRCode("?token=\"\"&sha1=slkdfjslkdfjsdlkfjsdlkfjsdlk&username=''")
  html_content = render_to_string('add_user.html',data)
  status=mail.mailto([to])\
    .title("Hi,{},您的用户信息添加成功。".format(data['sn']))\
    .content(html_content)\
    .attach_file(['crontasks/public/iwubida.ovpn', 'crontasks/public/ca.crt'])\
    .send()
  return status
