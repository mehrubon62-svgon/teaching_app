from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class SendOTPSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=20)


class VerifyOTPSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=20)
    otp_code     = serializers.CharField(max_length=6)


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = ['id', 'phone_number', 'email', 'full_name', 'avatar', 'role', 'is_phone_verified', 'date_joined']
        read_only_fields = ['id', 'phone_number', 'email', 'role', 'is_phone_verified', 'date_joined']


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = ['full_name', 'avatar']


class UserListSerializer(serializers.ModelSerializer):
    """Для модератора — список всех пользователей"""
    class Meta:
        model  = User
        fields = ['id', 'phone_number', 'email', 'full_name', 'role', 'date_joined', 'is_active']


class ChangeRoleSerializer(serializers.Serializer):
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES)
