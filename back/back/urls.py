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
from django.conf import settings
# 重要的是如下三行
from .views import SwaggerSchemaView
# 另外，我们还包括支持浏览器浏览API的登录URL。
urlpatterns = [
    path('api/', include([
        path('v1/',include([
            path('',include('authentication.urls',namespace='auth-login')),
            path('',include('api.urls'))
        ])),
        path('v2/',include([
            # path('',include('api.urls'))
        ])),
    ]))
]

if settings.DEBUG:
    urlpatterns.append(path('swagger-ui',SwaggerSchemaView.as_view(),name='swagger-ui'))

