from django.urls import path
from . import views

urlpatterns = [
    path('',          views.ResumeView.as_view(),         name='resume'),
    path('download/', views.ResumeDownloadView.as_view(), name='resume-download'),
]
