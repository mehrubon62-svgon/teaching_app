from django.contrib import admin
from .models import User, PhoneOTP


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display  = ['id', 'full_name', 'phone_number', 'email', 'role', 'is_active', 'date_joined']
    list_filter   = ['role', 'is_active', 'is_phone_verified']
    search_fields = ['full_name', 'phone_number', 'email']
    list_editable = ['role']


@admin.register(PhoneOTP)
class PhoneOTPAdmin(admin.ModelAdmin):
    list_display = ['phone_number', 'otp_code', 'is_used', 'expires_at', 'created_at']
    list_filter  = ['is_used']
