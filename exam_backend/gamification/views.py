from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from .models import UserGameProfile
from .serializers import GameProfileSerializer, LeaderboardSerializer


class GameProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(
        operation_summary='Мой игровой профиль',
        operation_description='XP, уровень, стрик и список полученных бейджей текущего пользователя.',
        responses={200: openapi.Response('Игровой профиль', examples={'application/json': {
            'username': 'Алишер', 'xp_points': 350, 'level': 4,
            'streak_days': 7, 'user_badges': [{'badge': {'name': 'Первый шаг', 'icon': '🏅'}, 'earned_at': '2026-05-01'}]
        }})},
        tags=['Геймификация'],
    )
    def get(self, request):
        profile, _ = UserGameProfile.objects.get_or_create(user=request.user)
        return Response(GameProfileSerializer(profile).data)


class LeaderboardView(APIView):
    permission_classes = [permissions.AllowAny]

    @swagger_auto_schema(
        operation_summary='Таблица лидеров',
        operation_description='Топ-20 студентов по количеству XP. Доступно без авторизации.',
        responses={200: openapi.Response('Топ студентов', examples={'application/json': [
            {'full_name': 'Алишер', 'xp_points': 1200, 'level': 13},
            {'full_name': 'Зарина',  'xp_points': 980,  'level': 10},
        ]})},
        tags=['Геймификация'],
    )
    def get(self, request):
        top = UserGameProfile.objects.order_by('-xp_points')[:20]
        return Response(LeaderboardSerializer(top, many=True, context={'request': request}).data)
