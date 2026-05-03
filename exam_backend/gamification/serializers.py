from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Badge, UserGameProfile, UserBadge

User = get_user_model()


class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Badge
        fields = ['id', 'name', 'description', 'icon', 'required_xp']


class UserBadgeSerializer(serializers.ModelSerializer):
    badge = BadgeSerializer(read_only=True)

    class Meta:
        model  = UserBadge
        fields = ['badge', 'earned_at']


class GameProfileSerializer(serializers.ModelSerializer):
    user_badges = UserBadgeSerializer(many=True, read_only=True)
    username    = serializers.CharField(source='user.full_name', read_only=True)

    class Meta:
        model  = UserGameProfile
        fields = ['username', 'xp_points', 'level', 'streak_days', 'user_badges']


class LeaderboardSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.full_name', read_only=True)
    avatar    = serializers.ImageField(source='user.avatar', read_only=True)

    class Meta:
        model  = UserGameProfile
        fields = ['full_name', 'avatar', 'xp_points', 'level']
