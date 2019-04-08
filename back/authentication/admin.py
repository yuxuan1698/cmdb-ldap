from django.contrib import admin

# Register your models here.
from django.contrib.auth.admin import UserAdmin
from .models import Users
 
 
# Register your models here.
admin.site.register(Users,UserAdmin)