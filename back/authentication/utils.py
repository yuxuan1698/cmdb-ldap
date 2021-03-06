from django.conf import settings
from hashlib import sha1
from base64 import (b64encode as encode,
                    b64encode as decode)
import os
# from django.core.mail import send_mail
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from common.utils import CmdbLDAPLogger
from authentication.models import Users
from django.contrib.auth import backends
from django.core.cache import cache
logger = CmdbLDAPLogger.get_logger('cmdb_ldap')


def jwt_response_payload_handler(token, userobj=None, request=None):
    """为返回的结果添加用户相关信息"""
    return {
        'nickname': userobj.nickname,
        'username': userobj.username,
        'email': userobj.email,
        'token_prefix': settings.JWT_AUTH.get('JWT_AUTH_HEADER_PREFIX') or 'JWT',
        'token': token,
        'permission': "all" if userobj.is_superuser else userobj.get_all_permissions()
    }


def reflush_secretkey(userModel):
    """返回用户UUID"""
    return userModel.secretkey


def user_payload_handler(data, newUserDn, newUser):
    return {
        "username": newUser,
        "nickname": data.get('sn') or '',
        "email": data.get('mail') or '',
        "department": data.get('ou') or '',
        "mobile": data.get('mobile') or '',
        "userdn": newUserDn,
        'publickey':data.get('sshPublicKey') or '',
        'privatekey':cache.get("user_%s_private_key"%newUser) or ''
    }


def generate_ldap_password(password):
    """
    SSHA密码生成
    """
    salt = os.urandom(4)
    shapass = sha1(password.encode('utf-8'))
    shapass.update(salt)
    return str(b"{SSHA}" + encode(shapass.digest() + salt), encoding='utf-8')


def check_ldap_password(ldap_password, password):
    """
    验证密码
    """
    ldap_password_bytes = decode(ldap_password[6:])
    digest = ldap_password_bytes[:20]
    salt = ldap_password_bytes[20:]
    hr = sha1(password)
    hr.update(salt)
    return digest == hr.digest()

