from celery import shared_task
from django.contrib.auth import get_user_model


@shared_task
def send_notification_to_user(user_id: int, title: str, message: str, notification_type: str = 'reminder'):
    """
    Celery-задача: отправить уведомление конкретному пользователю.
    Вызывается асинхронно при событиях (новый курс, скидка и т.д.)
    """
    from notifications.models import Notification
    User = get_user_model()

    try:
        user = User.objects.get(pk=user_id)
        Notification.objects.create(
            user=user,
            title=title,
            message=message,
            notification_type=notification_type,
        )
        return f'Уведомление отправлено пользователю {user}'
    except User.DoesNotExist:
        return f'Пользователь {user_id} не найден'


@shared_task
def send_notification_to_all(title: str, message: str, notification_type: str = 'reminder'):
    """
    Celery-задача: отправить уведомление всем активным пользователям.
    Используется модераторами для массовых рассылок (акции, обновления).
    """
    from notifications.models import Notification
    User = get_user_model()

    users = User.objects.filter(is_active=True)
    notifications = [
        Notification(user=user, title=title, message=message, notification_type=notification_type)
        for user in users
    ]
    Notification.objects.bulk_create(notifications)
    return f'Уведомление отправлено {len(notifications)} пользователям'


@shared_task
def cleanup_expired_otps():
    """
    Celery Beat — периодическая задача: удалять просроченные OTP коды.
    Запускать каждый час через django-celery-beat.
    """
    from django.utils import timezone
    from accounts.models import PhoneOTP

    deleted, _ = PhoneOTP.objects.filter(expires_at__lt=timezone.now()).delete()
    return f'Удалено {deleted} просроченных OTP кодов'
