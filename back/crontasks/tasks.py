
from common.utils import SendEMail,generateQRCode
from celery import shared_task
from django.template.loader import render_to_string
from common.utils import CmdbLDAPLogger
from rest_framework_jwt.utils import jwt_payload_handler,jwt_encode_handler
from django.contrib.auth import get_user_model
from django.conf import settings
from common.utils import Sign_Url_By_MD5
import os

logger=CmdbLDAPLogger().get_logger('cmdb_ldap')
Users = get_user_model()

@shared_task
def send_register_email(to,data,username):
  user=Users.objects.get(username=username)
  if user:
    payload=jwt_payload_handler(user)
    urldata ={
        "username":username,
        "tokenPrefix":settings.JWT_AUTH.get(
            'JWT_AUTH_HEADER_PREFIX'),
        "token":jwt_encode_handler(payload)
    }
    sign_uri=Sign_Url_By_MD5(urldata)
    changepassword_url="{}/user/changepassword?{}".format(settings.CMDB_BASE_URL,sign_uri)
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
