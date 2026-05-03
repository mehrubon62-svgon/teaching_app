from django.urls import path
from . import views

urlpatterns = [
    # Home
    path('home/',                        views.HomeView.as_view(),         name='home'),
    # Categories
    path('categories/',                  views.CategoryListView.as_view(),  name='category-list'),
    path('categories/create/',           views.CategoryManageView.as_view(),name='category-create'),
    # Courses
    path('courses/',                     views.CourseListView.as_view(),    name='course-list'),
    path('courses/create/',              views.CourseCreateView.as_view(),  name='course-create'),
    path('courses/<int:pk>/',            views.CourseDetailView.as_view(),  name='course-detail'),
    path('courses/<int:pk>/enroll/',     views.EnrollView.as_view(),        name='course-enroll'),
    path('courses/my/',                  views.MyCourseListView.as_view(),  name='my-courses'),
    # Lessons
    path('lessons/<int:pk>/',            views.LessonDetailView.as_view(),  name='lesson-detail'),
    path('lessons/<int:pk>/complete/',   views.CompleteLessonView.as_view(),name='lesson-complete'),
]
