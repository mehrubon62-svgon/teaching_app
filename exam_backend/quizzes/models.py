from django.db import models
from django.conf import settings


class Quiz(models.Model):
    lesson             = models.OneToOneField('courses.Lesson', on_delete=models.CASCADE, related_name='quiz', null=True, blank=True)
    title              = models.CharField(max_length=255)
    passing_score      = models.PositiveIntegerField(default=70, help_text='Минимальный % для прохождения')
    unlocks_next       = models.BooleanField(default=False, help_text='Открыть следующий урок после прохождения')
    xp_reward          = models.PositiveIntegerField(default=20)

    def __str__(self): return self.title

    class Meta:
        verbose_name = 'Тест'
        verbose_name_plural = 'Тесты'


class Question(models.Model):
    quiz  = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    text  = models.TextField()
    order = models.PositiveIntegerField(default=0)

    def __str__(self): return f'[{self.quiz.title}] {self.text[:60]}'

    class Meta:
        ordering = ['order']
        verbose_name = 'Вопрос'
        verbose_name_plural = 'Вопросы'


class Answer(models.Model):
    question   = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    text       = models.CharField(max_length=500)
    is_correct = models.BooleanField(default=False)

    def __str__(self): return f'{"✓" if self.is_correct else "✗"} {self.text}'

    class Meta:
        verbose_name = 'Вариант ответа'
        verbose_name_plural = 'Варианты ответов'


class UserQuizAttempt(models.Model):
    user         = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='quiz_attempts')
    quiz         = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='attempts')
    score        = models.FloatField(default=0, help_text='% правильных ответов')
    passed       = models.BooleanField(default=False)
    xp_earned    = models.PositiveIntegerField(default=0)
    attempted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-attempted_at']
        verbose_name = 'Попытка теста'
        verbose_name_plural = 'Попытки тестов'

    def __str__(self): return f'{self.user} — {self.quiz.title} ({self.score:.0f}%)'
