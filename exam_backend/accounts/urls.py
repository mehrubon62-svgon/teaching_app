from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    # OTP авторизация по телефону
    path('otp/send/',              views.SendOTPView.as_view(),       name='otp-send'),
    path('otp/verify/',            views.VerifyOTPView.as_view(),     name='otp-verify'),
    # JWT refresh
    path('refresh/',               TokenRefreshView.as_view(),        name='token-refresh'),
    # Профиль
    path('profile/',               views.ProfileView.as_view(),       name='profile'),
    # Управление пользователями (только модератор)
    path('users/',                 views.UserListView.as_view(),      name='user-list'),
    path('users/<int:user_id>/role/', views.ChangeUserRoleView.as_view(), name='user-role'),
]
