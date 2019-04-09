from django.conf import settings

def jwt_response_payload_handler(token,users=None,request=None):
    """为返回的结果添加用户相关信息"""
    
    return {
             'nickname':users.nickname,
             'username':users.username,
             'email':users.email,
             'token_prefix': settings.JWT_AUTH.get('JWT_AUTH_HEADER_PREFIX') or 'JWT',
             'token':token
            }
def reflush_secretkey(userModel):
    """返回用户UUID"""
    return userModel.secretkey 
