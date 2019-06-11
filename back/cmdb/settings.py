"""
Django settings for back project.

Generated by 'django-admin startproject' using Django 2.1.7.

For more information on this file, see
https                                     : //docs.djangoproject.com/en/2.1/topics/settings/

For the full list of settings and their values, see
https                                     : //docs.djangoproject.com/en/2.1/ref/settings/
"""

import os
import ldap,datetime
from django_auth_ldap.config import LDAPSearch,GroupOfUniqueNamesType
import logging

BASE_DIR                                  = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)


# Quick-start development settings - unsuitable for production
# See https                               : //docs.djangoproject.com/en/2.1/howto/deployment/checklist/

# SECURITY WARNING                        : keep the secret key used in production secret!
SECRET_KEY                                = 'u_rom*ua&x304mcqwqgv-x5i@*fwnj&ip)algmf$_ozf23)te#'

# SECURITY WARNING                        : don't run with debug turned on in production!
DEBUG                                     = True

ALLOWED_HOSTS                             = ['127.0.0.1']

CMDB_BASE_URL                             = "http://127.0.0.1:8081"
# Application definition

INSTALLED_APPS                            = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    # 'rest_framework.authtoken',
    'corsheaders',
    'api.apps.ApiConfig',
    'authentication.apps.AuthenticationConfig',
    'common.apps.CommonConfig',
    'crontasks.apps.CrontasksConfig',
    'rest_framework_swagger',
    'django_celery_results',
]

MIDDLEWARE                                = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    # 'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF                              = 'cmdb.urls'

TEMPLATES                                 = [
    {
        'BACKEND'                         : 'django.template.backends.django.DjangoTemplates',
        'DIRS'                            : [],
        'APP_DIRS'                        : True,
        'OPTIONS'                         : {
            'context_processors'          : [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION                          = 'cmdb.wsgi.application'


# Database
# https                                   : //docs.djangoproject.com/en/2.1/ref/settings/#databases

DATABASES                                 = {
    'default'                             : {
        'ENGINE'                          : 'django.db.backends.sqlite3',
        'NAME'                            : os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}
# CELERY 设置段
CELERY_BROKER_URL                         = 'redis://:%(password)s@%(host)s:%(port)s/%(db)s' % {
    'password'                            : 'jbg@123',
    'host'                                : '192.168.1.250',
    'port'                                : 6379,
    'db'                                  : 8,
}
CELERY_RESULT_BACKEND                     = 'django_celery_results.backends.database:DatabaseBackend' #ji结果存储，我配置的是存储到数据库
CELERY_CACHE_BACKEND                      = CELERY_RESULT_BACKEND
# CELERY_CACHE_BACKEND                    = 'django-cache'
CELERY_ACCEPT_CONTENT                     = ['application/json']
CELERY_TASK_SERIALIZER                    = 'json'
CELERY_RESULT_SERIALIZER                  = 'json'
CELERY_TASK_RESULT_EXPIRES                = 3600  # celery任务执行结果的超时时间，
CELERYD_CONCURRENCY                       = 15  # celery worker的并发数 也是命令行-c指定的数目,事实上实践发现并不是worker也多越好,保证任务不堆积,加上一定新增任务的预留就可以

# 时区
CELERY_TIMEZONE                           = 'Asia/Shanghai'

# Password validation
# https                                   : //docs.djangoproject.com/en/2.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS                  = [
    {
        'NAME'                            : 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME'                            : 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME'                            : 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME'                            : 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https                                   : //docs.djangoproject.com/en/2.1/topics/i18n/

LANGUAGE_CODE                             = 'zh-hans'

TIME_ZONE                                 = 'Asia/Chongqing'

USE_I18N                                  = True

USE_L10N                                  = True

USE_TZ                                    = False

APPEND_SLASH                              = True

# Static files (CSS, JavaScript, Images)
# https                                   : //docs.djangoproject.com/en/2.1/howto/static-files/

STATIC_URL                                = '/static/'

REST_FRAMEWORK                            = {
    'DEFAULT_RENDERER_CLASSES'            : (
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.TemplateHTMLRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ),
    'DEFAULT_PARSER_CLASSES'              : (
        'rest_framework.parsers.JSONParser',
        'rest_framework.parsers.FormParser',
        'rest_framework.parsers.MultiPartParser',
    ),
    'DEFAULT_PERMISSION_CLASSES'          : (
        # 'rest_framework.permissions.AllowAny',
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES'      : (
        # 'rest_framework.authentication.TokenAuthentication',
        'rest_framework_jwt.authentication.JSONWebTokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
    ),
    'DEFAULT_PAGINATION_CLASS'            : 'rest_framework.pagination.PageNumberPagination',
    'PAGINATE_BY'                         : 5,
    'PAGE_SIZE'                           : 10,
    'NON_FIELD_ERRORS_KEY'                : 'error'
}
JWT_AUTH                                  = {
    'JWT_AUTH_HEADER_PREFIX'              : 'Token',
    'JWT_EXPIRATION_DELTA'                : datetime.timedelta(seconds = 1800),  # 生成的token有效期
    'JWT_RESPONSE_PAYLOAD_HANDLER'        : 'authentication.utils.jwt_response_payload_handler', 
    'JWT_GET_USER_SECRET_KEY'             : 'authentication.utils.reflush_secretkey',
    'JWT_AUTH_COOKIE'                     : None,
}
# 
EMAIL_BACKEND                             = 'django.core.mail.backends.smtp.EmailBackend'
  
EMAIL_USE_TLS                             = False
# EMAIL_USE_SSL                           = True
EMAIL_HOST                                = '172.18.207.238'
EMAIL_PORT                                = 465
EMAIL_HOST_USER                           = 'dev@iwubida.com'
EMAIL_HOST_PASSWORD                       = 'Wubida@123'
DEFAULT_FROM_EMAIL                        = 'dev@iwubida.com'

CACHES                                    = {
    'default'                             : {
        # 'BACKEND'                       : 'django.core.cache.backends.filebased.FileBasedCache',
        'BACKEND'                         : 'django.core.cache.backends.db.DatabaseCache',
        # 'LOCATION'                      : '/tmp/django_cache',
        'LOCATION'                        : 'ldap_cache_table',
        'TIMEOUT'                         : 3600,
    }
}


#LDAP认证
# AUTHENTICATION_BACKENDS                   = ['django.contrib.auth.backends.ModelBackend',]  ExtraModelBackend
AUTHENTICATION_BACKENDS                   = ['authentication.backends.ExtraModelBackend']  

# Auth LDAP settings
AUTH_LDAP                                 = True
AUTH_LDAP_SERVER_URI                      = 'ldap://172.18.207.237:389'
AUTH_LDAP_BIND_DN                         = 'cn=admin,ou=SystemUser,dc=iwubida,dc=com'
AUTH_LDAP_BASE_DN                         = 'dc=iwubida,dc=com'
AUTH_LDAP_BIND_PASSWORD                   = 'Wubida@123'
AUTH_LDAP_SEARCH_OU                       = 'ou=Users,dc=iwubida,dc=com'
AUTH_LDAP_SEARCH_FILTER                   = '(&(uid=%(user)s))'
AUTH_LDAP_START_TLS                       = False
AUTH_LDAP_USER_ATTR_MAP                   = {"username": "cn", "name": "sn", "email": "mail","nickname":"sn","mobile":"mobile"}

AUTH_LDAP_MIRROR_GROUPS                   = True
AUTH_LDAP_FIND_GROUP_PERMS                = True
AUTH_LDAP_GROUP_TYPE                      = GroupOfUniqueNamesType(name_attr="cn")
AUTH_LDAP_GROUP_SEARCH_OU                 = "ou=Groups,dc=iwubida,dc=com"
AUTH_LDAP_CMDB_GROUP_OU                   = "ou=Cmdb,ou=Groups,dc=iwubida,dc=com"
AUTH_LDAP_GROUP_SEARCH                    = LDAPSearch(AUTH_LDAP_CMDB_GROUP_OU,ldap.SCOPE_SUBTREE, "(objectClass=*)" )  
AUTH_LDAP_USER_FLAGS_BY_GROUP             = {'is_superuser': "cn=admin,%s" % AUTH_LDAP_CMDB_GROUP_OU }
# AUTH_LDAP_GROUP_SEARCH_FILTER           = ""
AUTH_LDAP_USER_SEARCH                     = LDAPSearch(AUTH_LDAP_SEARCH_OU, ldap.SCOPE_SUBTREE, AUTH_LDAP_SEARCH_FILTER)
AUTH_LDAP_CONNECTION_OPTIONS              = {
    ldap.OPT_TIMEOUT                      : 20
}

# AUTH_LDAP_MIRROR_GROUPS                 = True
# AUTH_LDAP_GROUP_TYPE_STRING             = ''
# AUTH_LDAP_GROUP_TYPE_STRING_ATTR        = 'cn'

# AUTH_LDAP_GROUP_TYPE                    = GroupOfUniqueNamesType(name_attr="cn")
# AUTH_LDAP_GROUP_SEARCH_OU               = CONFIG.AUTH_LDAP_GROUP_SEARCH_OU
# AUTH_LDAP_GROUP_SEARCH_FILTER           = CONFIG.AUTH_LDAP_GROUP_SEARCH_FILTER
# AUTH_LDAP_CONNECTION_OPTIONS            = {
#     ldap.OPT_TIMEOUT                    : 5
# }
# AUTH_LDAP_GROUP_CACHE_TIMEOUT           = 1
AUTH_LDAP_ALWAYS_UPDATE_USER              = True
# AUTH_LDAP_BACKEND                       = 'django_auth_ladp.backend.LDAPBackend' #配置为先使用LDAP认证，如通过认证则不再使用后面的认证方式
AUTH_LDAP_BACKEND                         = 'authentication.ldap.backend.LDAPBackendAuthentication' #配置为先使用LDAP认证，如通过认证则不再使用后面的认证方式

if AUTH_LDAP                              : 
    AUTHENTICATION_BACKENDS.insert(0, AUTH_LDAP_BACKEND)
AUTH_USER_MODEL                           = "authentication.Users"
# AUTH_GROUP_MODEL                          = "authentication.UserGroups"



# 日志部分
# Django的日志配置项

LOGGING                                   = {
    'version'                             : 1,
    'disable_existing_loggers'            : False,
    'formatters'                          : {
        'verbose'                         : {
            'format'                      : '%(levelname)s %(asctime)s %(module)s %(process)d %(thread)d %(message)s'
        },
        'main'                            : {
            'datefmt'                     : '%Y-%m-%d %H:%M:%S',
            'format'                      : '%(asctime)s [%(module)s %(levelname)s] %(message)s',
        },
        'simple'                          : {
            'format'                      : '%(levelname)s %(message)s'
        },
    },
    'handlers'                            : {
        'null'                            : {
            'level'                       : 'DEBUG',
            'class'                       : 'logging.NullHandler',
        },
        'console'                         : {
            'level'                       : 'DEBUG',
            'class'                       : 'logging.StreamHandler',
            'formatter'                   : 'main'
        },
    },
    'loggers'                             : {
        'django'                          : {
            'handlers'                    : ['null'],
            'propagate'                   : False,
            'level'                       : 'DEBUG',
        },
        'django.request'                  : {
            'handlers'                    : ['console'],
            'level'                       : 'DEBUG',
            'propagate'                   : False,
        },
        'django.server'                   : {
            'handlers'                    : ['console'],
            'level'                       : 'DEBUG',
            'propagate'                   : False,
        },
        'django_auth_ldap'                : {
            'handlers'                    : ['console'],
            'level'                       : "INFO",
        },
        'cmdb_ldap'                       : {
            'handlers'                    : ['console'],
            'level'                       : "INFO",
        },
    }
}

# swagger 配置项
SWAGGER_SETTINGS                          = {
    # 基础样式
    'SECURITY_DEFINITIONS'                : {
        'api_key'                         : {
            'type'                        : 'apiKey',
            'description'                 : 'Personal API Key authorization',
            'in'                          : 'header',
            'name'                        : 'Authorization'
        }
    },
    'USE_SESSION_AUTH'                    : False,
    # 如果需要登录才能够查看接口文档, 登录的链接使用restframework自带的.
    # 'LOGIN_URL'                         : 'authentication:auth-login',
    # 'LOGOUT_URL'                        : 'authentication:logout',
    # 'DOC_EXPANSION'                     : None,
    'SHOW_REQUEST_HEADERS'                : True,
    'DOC_EXPANSION'                       : 'list',
    # 接口文档中方法列表以首字母升序排列
    'APIS_SORTER'                         : 'alpha',
    # 如果支持json提交, 则接口文档中包含json输入框
    'JSON_EDITOR'                         : True,
    # 方法列表字母排序
    'OPERATIONS_SORTER'                   : 'alpha',
    # 'VALIDATOR_URL'                     : None,
}
