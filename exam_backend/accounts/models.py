from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
import random


class UserManager(BaseUserManager):
    def create_user(self, phone_number=None, email=None, **extra_fields):
        if not phone_number and not email:
            raise ValueError('Нужно указать телефон или email')
        user = self.model(phone_number=phone_number, email=email, **extra_fields)
        user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, phone_number, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'moderator')
        user = self.model(phone_number=phone_number, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    ROLE_STUDENT   = 'student'
    ROLE_TEACHER   = 'teacher'
    ROLE_MODERATOR = 'moderator'
    ROLE_CHOICES = [
        (ROLE_STUDENT,   'Студент'),
        (ROLE_TEACHER,   'Учитель'),
        (ROLE_MODERATOR, 'Модератор'),
    ]

    phone_number      = models.CharField(max_length=20, unique=True, null=True, blank=True)
    email             = models.EmailField(unique=True, null=True, blank=True)
    google_id         = models.CharField(max_length=255, unique=True, null=True, blank=True)
    full_name         = models.CharField(max_length=255, blank=True)
    avatar            = models.ImageField(upload_to='avatars/', null=True, blank=True)
    role              = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLE_STUDENT)
    is_phone_verified = models.BooleanField(default=False)
    is_active         = models.BooleanField(default=True)
    is_staff          = models.BooleanField(default=False)
    date_joined       = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD  = 'phone_number'
    REQUIRED_FIELDS = []
    objects = UserManager()

    @property
    def is_student(self):   return self.role == self.ROLE_STUDENT
    @property
    def is_teacher(self):   return self.role == self.ROLE_TEACHER
    @property
    def is_moderator(self): return self.role == self.ROLE_MODERATOR

    def __str__(self):
        return self.full_name or self.phone_number or self.email or f'User #{self.pk}'

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'


class PhoneOTP(models.Model):
    phone_number = models.CharField(max_length=20)
    otp_code     = models.CharField(max_length=6)
    created_at   = models.DateTimeField(auto_now_add=True)
    expires_at   = models.DateTimeField()
    is_used      = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.otp_code:
            self.otp_code = str(random.randint(1000, 9999))
        super().save(*args, **kwargs)

    def is_valid(self):
        return not self.is_used and self.expires_at > timezone.now()

    def __str__(self):
        return f'{self.phone_number} → {self.otp_code}'

    class Meta:
        verbose_name = 'OTP код'
        verbose_name_plural = 'OTP коды'
        ordering = ['-created_at']
