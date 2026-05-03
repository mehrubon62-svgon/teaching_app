from django.db import models
from django.conf import settings


class Category(models.Model):
    OCCUPATION     = 'occupation'
    SCHOOL_SUBJECT = 'school_subject'
    TYPE_CHOICES = [
        (OCCUPATION,     'Профессия'),
        (SCHOOL_SUBJECT, 'Школьный предмет'),
    ]

    name          = models.CharField(max_length=100)
    category_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    icon          = models.CharField(max_length=10, blank=True, help_text='Emoji')
    order         = models.PositiveIntegerField(default=0)

    def __str__(self): return self.name

    class Meta:
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'
        ordering = ['order', 'name']


class Course(models.Model):
    title          = models.CharField(max_length=255)
    description    = models.TextField()
    category       = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='courses')
    thumbnail      = models.ImageField(upload_to='courses/thumbnails/', null=True, blank=True)
    instructor     = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True,
        related_name='teaching_courses', limit_choices_to={'role': 'teacher'}
    )
    price          = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    is_promoted    = models.BooleanField(default=False)
    is_popular     = models.BooleanField(default=False)
    is_published   = models.BooleanField(default=False)
    created_at     = models.DateTimeField(auto_now_add=True)
    updated_at     = models.DateTimeField(auto_now=True)

    @property
    def has_discount(self):
        return self.discount_price is not None and self.discount_price < self.price

    def __str__(self): return self.title

    class Meta:
        verbose_name = 'Курс'
        verbose_name_plural = 'Курсы'
        ordering = ['-created_at']


class Module(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='modules')
    title  = models.CharField(max_length=255)
    order  = models.PositiveIntegerField(default=0)

    def __str__(self): return f'{self.course.title} — {self.title}'

    class Meta:
        verbose_name = 'Модуль'
        verbose_name_plural = 'Модули'
        ordering = ['order']


class Lesson(models.Model):
    YOUTUBE  = 'youtube'
    EXTERNAL = 'external'
    VIDEO_TYPES = [(YOUTUBE, 'YouTube'), (EXTERNAL, 'Внешняя ссылка')]

    module      = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='lessons')
    title       = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    video_url   = models.URLField(blank=True)
    video_type  = models.CharField(max_length=20, choices=VIDEO_TYPES, default=YOUTUBE)
    order       = models.PositiveIntegerField(default=0)
    is_locked   = models.BooleanField(default=False)
    xp_reward   = models.PositiveIntegerField(default=10)
    created_at  = models.DateTimeField(auto_now_add=True)

    def __str__(self): return f'{self.module.title} — {self.title}'

    class Meta:
        verbose_name = 'Урок'
        verbose_name_plural = 'Уроки'
        ordering = ['order']


class LessonAttachment(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='attachments')
    title  = models.CharField(max_length=255)
    file   = models.FileField(upload_to='lessons/attachments/')

    def __str__(self): return self.title

    class Meta:
        verbose_name = 'Вложение'
        verbose_name_plural = 'Вложения'


class Enrollment(models.Model):
    user        = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='enrollments')
    course      = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'course')
        verbose_name = 'Запись на курс'
        verbose_name_plural = 'Записи на курсы'

    def __str__(self): return f'{self.user} → {self.course}'


class LessonProgress(models.Model):
    user         = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='lesson_progress')
    lesson       = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='progress')
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('user', 'lesson')
        verbose_name = 'Прогресс урока'
        verbose_name_plural = 'Прогресс уроков'
