from django.db import models
from django.conf import settings


class Notification(models.Model):
    COURSE_UPDATE = 'course_update'
    DISCOUNT      = 'discount'
    REMINDER      = 'reminder'
    ACHIEVEMENT   = 'achievement'
    TYPE_CHOICES  = [
        (COURSE_UPDATE, 'Обновление курса'),
        (DISCOUNT,      'Скидка'),
        (REMINDER,      'Напоминание'),
        (ACHIEVEMENT,   'Достижение'),
    ]

    user              = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    title             = models.CharField(max_length=255)
    message           = models.TextField()
    notification_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default=REMINDER)
    is_read           = models.BooleanField(default=False)
    created_at        = models.DateTimeField(auto_now_add=True)

    def __str__(self): return f'{self.user} — {self.title}'

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Уведомление'
        verbose_name_plural = 'Уведомления'
