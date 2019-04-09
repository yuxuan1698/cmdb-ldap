"""back URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.urls import path,include
# # from django.conf.urls import url

# urlpatterns = [
#     path(r'api/v1/', include([
#             path('users/', include('api.urls')),
#             path('auth/', include('authentication.urls')),
#         ])),
# ]
from django.conf.urls import url, include
from rest_framework import routers
# from rest_framework_swagger.views import get_swagger_view
# 重要的是如下三行
from rest_framework.schemas import get_schema_view
from rest_framework_swagger.renderers import SwaggerUIRenderer, OpenAPIRenderer
schema_view = get_schema_view(title='Users API', renderer_classes=[OpenAPIRenderer, SwaggerUIRenderer])


# schema_view = get_swagger_view(title="我的API")
# 使用自动URL路由连接我们的API。
# 另外，我们还包括支持浏览器浏览API的登录URL。
urlpatterns = [
    path('api/', include([
        path('v1/',include([
            path('',include('authentication.urls')),
            path('',include('api.urls'))
        ])),
        path('v2/',include([
            # path('',include('api.urls'))
        ])),
    ])),
    path('swagger-ui',schema_view,name='swagger-ui'),
]