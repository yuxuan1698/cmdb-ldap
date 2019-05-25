
from common.utils import SendEMail,generateQRCode
from celery import shared_task
from django.template.loader import render_to_string
from common.utils import CmdbLDAPLogger
from rest_framework_jwt.utils import jwt_payload_handler,jwt_encode_handler
from django.contrib.auth import get_user_model
from django.conf import settings
import os

logger=CmdbLDAPLogger().get_logger('cmdb_ldap')
Users = get_user_model()

@shared_task
def send_register_email(to,data,username):
  user=Users.objects.get(username=username)
  if user:
    payload=jwt_payload_handler(user)
    changepassword_url = "{}?username={}&tokenPrefix={}&token={}&md5={}".format(\
        settings.CMDB_BASE_URL,
        username,
        settings.JWT_AUTH.get(
            'JWT_AUTH_HEADER_PREFIX'),
        jwt_encode_handler(
            payload),
        "md5"
    )
    logger.info(changepassword_url)
    mail=SendEMail()
    data['qrcode']=generateQRCode(changepassword_url)
    data['changepassword_url'] = changepassword_url
    html_content = render_to_string('add_user.html',data)
    status=mail.mailto([to])\
      .title("Hi,{},您的用户信息添加成功。".format(data['sn']))\
      .content(html_content)\
      .attach_file(['crontasks/public/iwubida.ovpn', 'crontasks/public/ca.crt'])\
      .send()
    return status
  return False
