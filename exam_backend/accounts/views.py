from datetime import timedelta
from django.conf import settings
from django.utils import timezone
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from .models import PhoneOTP
from .serializers import (
    SendOTPSerializer, VerifyOTPSerializer,
    UserProfileSerializer, UserUpdateSerializer, UserListSerializer, ChangeRoleSerializer
)
from .permissions import IsModerator


def get_tokens(user):
    refresh = RefreshToken.for_user(user)
    return {'refresh': str(refresh), 'access': str(refresh.access_token)}


class SendOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    @swagger_auto_schema(
        operation_summary='Запросить OTP код',
        operation_description='Генерирует 4-значный OTP. В dev-режиме код возвращается прямо в ответе (без SMS).',
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['phone_number'],
            properties={
                'phone_number': openapi.Schema(type=openapi.TYPE_STRING, example='+998901234567', description='Номер телефона'),
            }
        ),
        responses={200: openapi.Response('OTP создан', examples={'application/json': {
            'message': 'OTP код сгенерирован', 'phone_number': '+998901234567', 'otp_code': '3842', 'expires_in_minutes': 5
        }})},
        tags=['Авторизация'],
    )
    def post(self, request):
        serializer = SendOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone = serializer.validated_data['phone_number']
        PhoneOTP.objects.filter(phone_number=phone, is_used=False).update(is_used=True)
        expiry = timezone.now() + timedelta(minutes=settings.OTP_EXPIRY_MINUTES)
        otp = PhoneOTP.objects.create(phone_number=phone, expires_at=expiry)
        return Response({'message': 'OTP код сгенерирован', 'phone_number': phone,
                         'otp_code': otp.otp_code, 'expires_in_minutes': settings.OTP_EXPIRY_MINUTES})


class VerifyOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    @swagger_auto_schema(
        operation_summary='Подтвердить OTP и войти',
        operation_description='Проверяет OTP код. Возвращает JWT access + refresh токены. Если юзера нет — создаётся со ролью student.',
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['phone_number', 'otp_code'],
            properties={
                'phone_number': openapi.Schema(type=openapi.TYPE_STRING, example='+998901234567'),
                'otp_code':     openapi.Schema(type=openapi.TYPE_STRING, example='3842'),
            }
        ),
        responses={
            200: openapi.Response('JWT токены', examples={'application/json': {
                'message': 'Авторизация успешна', 'is_new_user': False,
                'access': 'eyJhbGci...', 'refresh': 'eyJhbGci...'
            }}),
            400: openapi.Response('Ошибка', examples={'application/json': {'error': 'Неверный или истёкший OTP код'}}),
        },
        tags=['Авторизация'],
    )
    def post(self, request):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone = serializer.validated_data['phone_number']
        code  = serializer.validated_data['otp_code']
        otp = PhoneOTP.objects.filter(phone_number=phone, otp_code=code, is_used=False).last()
        if not otp or not otp.is_valid():
            return Response({'error': 'Неверный или истёкший OTP код'}, status=status.HTTP_400_BAD_REQUEST)
        otp.is_used = True
        otp.save()
        user, created = User.objects.get_or_create(phone_number=phone, defaults={'is_phone_verified': True})
        if not user.is_phone_verified:
            user.is_phone_verified = True
            user.save()
        return Response({'message': 'Авторизация успешна', 'is_new_user': created,
                         'user': UserProfileSerializer(user).data, **get_tokens(user)})


class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(
        operation_summary='Получить свой профиль',
        operation_description='Данные текущего авторизованного пользователя. Требует: Authorization: Bearer <token>',
        responses={200: UserProfileSerializer()},
        tags=['Профиль'],
    )
    def get(self, request):
        return Response(UserProfileSerializer(request.user).data)

    @swagger_auto_schema(
        operation_summary='Обновить профиль',
        operation_description='Обновляет имя и аватар. Роль и телефон через этот эндпоинт не меняются.',
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'full_name': openapi.Schema(type=openapi.TYPE_STRING, example='Алишер Навоий'),
            }
        ),
        responses={200: UserProfileSerializer()},
        tags=['Профиль'],
    )
    def patch(self, request):
        serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(UserProfileSerializer(request.user).data)


class UserListView(APIView):
    permission_classes = [IsModerator]

    @swagger_auto_schema(
        operation_summary='Список всех пользователей',
        operation_description='Только модераторы. Полный список пользователей с ролями.',
        responses={200: UserListSerializer(many=True)},
        tags=['Управление пользователями'],
    )
    def get(self, request):
        from django.contrib.auth import get_user_model
        users = get_user_model().objects.all().order_by('-date_joined')
        return Response(UserListSerializer(users, many=True).data)


class ChangeUserRoleView(APIView):
    permission_classes = [IsModerator]

    @swagger_auto_schema(
        operation_summary='Изменить роль пользователя',
        operation_description='Модератор назначает роль: student, teacher или moderator.',
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['role'],
            properties={
                'role': openapi.Schema(type=openapi.TYPE_STRING, enum=['student', 'teacher', 'moderator'], example='teacher'),
            }
        ),
        responses={200: openapi.Response('OK', examples={'application/json': {'message': 'Роль изменена на «teacher»'}})},
        tags=['Управление пользователями'],
    )
    def patch(self, request, user_id):
        from django.contrib.auth import get_user_model
        from django.shortcuts import get_object_or_404
        user = get_object_or_404(get_user_model(), pk=user_id)
        serializer = ChangeRoleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user.role = serializer.validated_data['role']
        user.save()
        return Response({'message': f'Роль пользователя изменена на «{user.role}»'})
