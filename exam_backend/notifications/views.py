from django.shortcuts import get_object_or_404
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from accounts.permissions import IsModerator

from .models import Notification
from .serializers import NotificationSerializer


class NotificationListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(
        operation_summary='Список уведомлений',
        operation_description='Все уведомления текущего пользователя. Непрочитанные — первыми.',
        responses={200: NotificationSerializer(many=True)},
        tags=['Уведомления'],
    )
    def get(self, request):
        notifications = Notification.objects.filter(user=request.user)
        return Response(NotificationSerializer(notifications, many=True).data)


class MarkReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(
        operation_summary='Отметить уведомление прочитанным',
        operation_description='Помечает конкретное уведомление как прочитанное по его ID.',
        request_body=openapi.Schema(type=openapi.TYPE_OBJECT, properties={}),
        responses={200: openapi.Response('OK', examples={'application/json': {'message': 'Уведомление прочитано'}})},
        tags=['Уведомления'],
    )
    def post(self, request, pk):
        notification = get_object_or_404(Notification, pk=pk, user=request.user)
        notification.is_read = True
        notification.save()
        return Response({'message': 'Уведомление прочитано'})


class MarkAllReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(
        operation_summary='Прочитать все уведомления',
        operation_description='Помечает все непрочитанные уведомления текущего пользователя как прочитанные.',
        request_body=openapi.Schema(type=openapi.TYPE_OBJECT, properties={}),
        responses={200: openapi.Response('OK', examples={'application/json': {'message': 'Прочитано 5 уведомлений'}})},
        tags=['Уведомления'],
    )
    def post(self, request):
        count = Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({'message': f'Прочитано {count} уведомлений'})


class BroadcastNotificationView(APIView):
    permission_classes = [IsModerator]

    @swagger_auto_schema(
        operation_summary='Массовая рассылка (модератор)',
        operation_description='Отправляет уведомление всем активным пользователям через Celery (асинхронно).',
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['title', 'message'],
            properties={
                'title':             openapi.Schema(type=openapi.TYPE_STRING, example='🎉 Новый курс!'),
                'message':           openapi.Schema(type=openapi.TYPE_STRING, example='Вышел новый курс по AI — успей записаться!'),
                'notification_type': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    enum=['course_update', 'discount', 'reminder', 'achievement'],
                    example='course_update'
                ),
            }
        ),
        responses={200: openapi.Response('В очереди', examples={'application/json': {
            'message': 'Рассылка поставлена в очередь', 'task_id': 'abc123'
        }})},
        tags=['Уведомления'],
    )
    def post(self, request):
        title             = request.data.get('title')
        message           = request.data.get('message')
        notification_type = request.data.get('notification_type', 'reminder')
        if not title or not message:
            return Response({'error': 'title и message обязательны'}, status=400)
        from .tasks import send_notification_to_all
        task = send_notification_to_all.delay(title, message, notification_type)
        return Response({'message': 'Рассылка поставлена в очередь', 'task_id': task.id})
