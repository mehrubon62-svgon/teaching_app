from django.contrib import admin
from django.urls import path, re_path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title='Omuz API',
        default_version='v1',
        description='Backend для образовательной платформы Omuz. Авторизация — JWT Bearer токен.',
        contact=openapi.Contact(email='admin@omuz.uz'),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # API v1
    path('api/auth/',          include('accounts.urls')),
    path('api/',               include('courses.urls')),
    path('api/quizzes/',       include('quizzes.urls')),
    path('api/gamification/',  include('gamification.urls')),
    path('api/resume/',        include('resume_builder.urls')),
    path('api/notifications/', include('notifications.urls')),

    # Swagger UI  →  http://localhost:8001/swagger/
    re_path(r'^swagger/$',
        schema_view.with_ui('swagger', cache_timeout=0),
        name='schema-swagger-ui'),

    # ReDoc       →  http://localhost:8001/redoc/
    re_path(r'^redoc/$',
        schema_view.with_ui('redoc', cache_timeout=0),
        name='schema-redoc'),

    # Raw JSON schema
    re_path(r'^swagger\.json$',
        schema_view.without_ui(cache_timeout=0),
        name='schema-json'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
