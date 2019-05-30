from django.contrib import admin

# Register your models here.
from django.contrib.auth.admin import UserAdmin
from .models import Users
# from django.contrib.auth.models import Group
# from django.contrib import admin
# admin.site.unregister(Group)
 
# Register your models here.
admin.site.register(Users,UserAdmin)