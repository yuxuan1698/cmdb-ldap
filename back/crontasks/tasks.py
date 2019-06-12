
from common.utils import SendEMail,generateQRCode
from django.template.loader import render_to_string
from rest_framework_jwt.utils import jwt_payload_handler,jwt_encode_handler
from django.contrib.auth import get_user_model
from django.conf import settings
from celery import shared_task
from common.utils import CmdbLDAPLogger,Sign_Url_By_MD5
import os

logger=CmdbLDAPLogger().get_logger('cmdb_ldap')
Users = get_user_model()

@shared_task
def send_register_email(to,data):
  """
  发送用户添加成功邮件
  """
  user=Users.objects.get(username=data['username'])
  if user:
    payload=jwt_payload_handler(user)
    urldata ={
        "username":data['username'],
        "tokenPrefix":settings.JWT_AUTH.get(
            'JWT_AUTH_HEADER_PREFIX'),
        "token":jwt_encode_handler(payload)
    }
    sign_uri=Sign_Url_By_MD5(urldata)
    changepassword_url="{}/user/changepassword?{}".format(settings.CMDB_BASE_URL,sign_uri)
    mail=SendEMail()
    newdata=dict({
      'qrcode': generateQRCode(changepassword_url),
      'changepassword_url': changepassword_url
    },**data)
    html_content = render_to_string('add_user.html',newdata)
    try:
      status=mail.mailto([to])\
        .title("Hi,{},您的用户信息添加成功。".format(data['sn']))\
        .content(html_content)\
        .attach_file(['crontasks/public/iwubida.ovpn', 'crontasks/public/ca.crt'])\
        .send()
      return status
    except Exception as exc:
      logger.error(exc)
        # raise self.retry(countdown=5, max_retries=3, exc=exc)  # 下次重试5s以后，最多重试3次
    
  return False

@shared_task
def send_reset_password_email(username,resetPassword):
  """
  发送重置密码的邮件
  """
  user=Users.objects.get(username=username)
  if user and hasattr(user, 'email') and user.email!='':
    payload=jwt_payload_handler(user)
    urldata ={
        "username":username,
        "tokenPrefix":settings.JWT_AUTH.get('JWT_AUTH_HEADER_PREFIX'),
        "token":jwt_encode_handler(payload)
    }
    sign_uri=Sign_Url_By_MD5(urldata)
    changepassword_url="{}/user/changepassword?{}".format(settings.CMDB_BASE_URL,sign_uri)
    mail=SendEMail()
    data={
      'title':"Hi,{},您的认证密码已经重置成功。请尽快修改你的个人密码，以免密码泄漏。".format(username),
      'username':username,
      'qrcode':generateQRCode(changepassword_url),
      'changepassword_url':changepassword_url,
      'userPassword':resetPassword
    }
    html_content = render_to_string('user_reset_password.html',data)
    status=mail.mailto([user.email])\
      .title("Hi,{},您的认证密码已经重置成功。".format(username))\
      .content(html_content)\
      .send()
    return status
  else:
    logger.warn("未找到此用户[%s]的相关信息，未发送重置邮件。"%username)
  return False
