from django.urls import path
from . import views

urlpatterns = [
    path('<int:pk>/',         views.QuizDetailView.as_view(),     name='quiz-detail'),
    path('<int:pk>/submit/',  views.SubmitQuizView.as_view(),     name='quiz-submit'),
    path('my-attempts/',      views.MyQuizAttemptsView.as_view(), name='my-attempts'),
]
