
from common.utils import SendEMail,generateQRCode
from django.template.loader import render_to_string
from rest_framework_jwt.utils import jwt_payload_handler,jwt_encode_handler
from django.contrib.auth import get_user_model
from django.conf import settings
from celery import shared_task
from .celery import app
from common.utils import CmdbLDAPLogger,Sign_Url_By_MD5,CmdbJson
from api.backend.aliyun import AliClound
from api.models.cerificate import Cerificate
from django.core.cache import cache
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
    ssh_public_key=cache.get("user_%s_public_key"%data['username'])
    ssh_private_key=cache.get("user_%s_private_key"%data['username'])
    newdata=dict({
      'qrcode': generateQRCode(changepassword_url),
      'changepassword_url': changepassword_url,
      'haveprivatekey': ssh_public_key!="" and ssh_private_key!=""
    },**data)
    html_content = render_to_string('add_user.html',newdata)
    try:
      sendmail=mail.mailto([to])\
        .title("Hi,{},您的用户信息添加成功。".format(data['sn']))\
        .content(html_content)\
        .attach_file([
          'crontasks/public/iwubida.ovpn',
          'crontasks/public/openvpn-install-2.4.6-I602.exe.zip'])
        #  'crontasks/public/ca.crt'
      if ssh_private_key and ssh_public_key:
        sendmail.attach("%s_ssh_private.pem"%data['username'],ssh_private_key)\
          .attach("%s_ssh_public.key"%data['username'],ssh_public_key)
      status=sendmail.send()
      cache.delete("user_%s_public_key"%data['username'])
      cache.delete("user_%s_private_key"%data['username'])
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

@shared_task
def send_reset_sshkey_email(data):
  """
  发送重置SSHKey的邮件
  """
  logger.info(data)
  if "username" in data and "email" in data :
    mail=SendEMail()
    username=data.get('username')
    data={
      'title':"Hi,{},您的SSHKEY已经重置成功,请下载您的私钥到你本地进行使用。".format(username),**data
    }
    privatekey=cache.get("user_%s_private_key"%username)
    publickey=cache.get("user_%s_public_key"%username)
    html_content = render_to_string('user_reset_sshkey.html',{**data,"publickey":publickey})
    status=mail.mailto([data.get('email')])\
      .title("Hi,{},您的SSHKEY已经重置成功。".format(username))\
      .content(html_content)\
      .attach("{}-private.pem".format(username),privatekey)\
      .attach("{}-public.key".format(username),publickey)\
      .send()
    cache.delete("user_%s_public_key"%data['username'])
    cache.delete("user_%s_private_key"%data['username'])
    return status
  else:
    logger.warn("传入的DATA参数为空，跳过发送邮件。"%username)
  return False


# @app.task(bind=True)
# def getAliyunCerificateList(self):
#     aliClound=AliClound()
#     listdata=aliClound.getAliCloundCertificateList()

#     if listdata:
#       data=CmdbJson().decode(listdata)
#       Cerificate.objects.bulk_create(data['CertificateList'])

#     logger.info(listdata)
#     print('在此调用实现了定时任务功能的函数或方法')