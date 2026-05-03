from django.db import models
from django.conf import settings


class Badge(models.Model):
    name        = models.CharField(max_length=100)
    description = models.TextField()
    icon        = models.CharField(max_length=10, help_text='Emoji')
    required_xp = models.PositiveIntegerField(default=0)

    def __str__(self): return f'{self.icon} {self.name}'

    class Meta:
        verbose_name = 'Бейдж'
        verbose_name_plural = 'Бейджи'
        ordering = ['required_xp']


class UserGameProfile(models.Model):
    user               = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='game_profile')
    xp_points          = models.PositiveIntegerField(default=0)
    level              = models.PositiveIntegerField(default=1)
    streak_days        = models.PositiveIntegerField(default=0)
    last_activity_date = models.DateField(null=True, blank=True)
    badges             = models.ManyToManyField(Badge, through='UserBadge', blank=True)

    def calculate_level(self):
        return max(1, self.xp_points // 100 + 1)

    def add_xp(self, points):
        self.xp_points += points
        self.level = self.calculate_level()
        self.save()
        self._check_badges()

    def _check_badges(self):
        unlocked = Badge.objects.filter(required_xp__lte=self.xp_points)
        for badge in unlocked:
            UserBadge.objects.get_or_create(user_profile=self, badge=badge)

    def __str__(self): return f'{self.user} — {self.xp_points} XP (Ур.{self.level})'

    class Meta:
        verbose_name = 'Игровой профиль'
        verbose_name_plural = 'Игровые профили'


class UserBadge(models.Model):
    user_profile = models.ForeignKey(UserGameProfile, on_delete=models.CASCADE, related_name='user_badges')
    badge        = models.ForeignKey(Badge, on_delete=models.CASCADE)
    earned_at    = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user_profile', 'badge')
        verbose_name = 'Бейдж пользователя'
        verbose_name_plural = 'Бейджи пользователей'
