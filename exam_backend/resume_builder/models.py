from django.db import models
from django.conf import settings


class Resume(models.Model):
    user       = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='resume')
    full_name  = models.CharField(max_length=255, blank=True)
    bio        = models.TextField(blank=True)
    skills     = models.TextField(blank=True, help_text='Навыки через запятую')
    phone      = models.CharField(max_length=20, blank=True)
    email      = models.EmailField(blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self): return f'Резюме — {self.user}'

    class Meta:
        verbose_name = 'Резюме'
        verbose_name_plural = 'Резюме'
