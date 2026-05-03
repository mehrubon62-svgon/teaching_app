from django.contrib import admin
from .models import Badge, UserGameProfile, UserBadge


@admin.register(Badge)
class BadgeAdmin(admin.ModelAdmin):
    list_display  = ['icon', 'name', 'required_xp', 'description']
    ordering      = ['required_xp']


@admin.register(UserGameProfile)
class UserGameProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'xp_points', 'level', 'streak_days']
    ordering     = ['-xp_points']


@admin.register(UserBadge)
class UserBadgeAdmin(admin.ModelAdmin):
    list_display = ['user_profile', 'badge', 'earned_at']
