from django.urls import path
from . import views

urlpatterns = [
    path('profile/',     views.GameProfileView.as_view(),  name='game-profile'),
    path('leaderboard/', views.LeaderboardView.as_view(),  name='leaderboard'),
]
