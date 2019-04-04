from django.contrib import admin

# Register your models here.
from django.contrib.auth.admin import UserAdmin
from .models import UserProfile
 
 
# Register your models here.
admin.site.register(UserProfile,UserAdmin)