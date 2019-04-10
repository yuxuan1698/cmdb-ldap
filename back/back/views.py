from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.schemas import SchemaGenerator
from rest_framework.views import APIView
from rest_framework_swagger.renderers import (OpenAPIRenderer, 
SwaggerUIRenderer)


class SwaggerSchemaView(APIView):
    """CMDB-LDAP API接口管理"""
    # _ignore_permission_classes=[]
    permission_classes = [AllowAny]
    renderer_classes = [
        OpenAPIRenderer,
        SwaggerUIRenderer,
    ]
    def get(self, request):
        generator = SchemaGenerator(title="CMDB-API",description='CMDB-接口平台',)
        schema = generator.get_schema(request=request)
        return Response(schema)