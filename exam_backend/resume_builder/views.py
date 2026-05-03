import io
from django.http import FileResponse
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.units import cm

from .models import Resume
from .serializers import ResumeSerializer


class ResumeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(
        operation_summary='Получить резюме',
        operation_description='Возвращает резюме пользователя. Если нет — создаётся пустое.',
        responses={200: ResumeSerializer()},
        tags=['Резюме'],
    )
    def get(self, request):
        resume, _ = Resume.objects.get_or_create(user=request.user)
        return Response(ResumeSerializer(resume).data)

    @swagger_auto_schema(
        operation_summary='Обновить резюме',
        operation_description='Обновляет поля резюме. Completed courses берутся автоматически из записей на курсы.',
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'full_name': openapi.Schema(type=openapi.TYPE_STRING, example='Алишер Навоий'),
                'bio':       openapi.Schema(type=openapi.TYPE_STRING, example='Full-stack разработчик с 2 годами опыта'),
                'skills':    openapi.Schema(type=openapi.TYPE_STRING, example='Python, Django, React, PostgreSQL'),
                'phone':     openapi.Schema(type=openapi.TYPE_STRING, example='+998901234567'),
                'email':     openapi.Schema(type=openapi.TYPE_STRING, example='alisher@example.com'),
            }
        ),
        responses={200: ResumeSerializer()},
        tags=['Резюме'],
    )
    def put(self, request):
        resume, _ = Resume.objects.get_or_create(user=request.user)
        serializer = ResumeSerializer(resume, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class ResumeDownloadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(
        operation_summary='Скачать резюме (PDF)',
        operation_description='Генерирует PDF файл резюме на основе сохранённых данных и возвращает для скачивания.',
        responses={200: openapi.Response('PDF файл', schema=openapi.Schema(type=openapi.TYPE_FILE))},
        tags=['Резюме'],
    )
    def get(self, request):
        resume, _ = Resume.objects.get_or_create(user=request.user)
        buffer = io.BytesIO()
        doc    = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=2*cm, leftMargin=2*cm, topMargin=2*cm, bottomMargin=2*cm)
        styles = getSampleStyleSheet()
        story  = []
        name   = resume.full_name or request.user.full_name or 'Имя не указано'
        story.append(Paragraph(name, styles['Title']))
        story.append(Spacer(1, 0.4*cm))
        if resume.bio:
            story.append(Paragraph(resume.bio, styles['Normal']))
            story.append(Spacer(1, 0.4*cm))
        contacts = []
        if resume.phone: contacts.append(f'📞 {resume.phone}')
        if resume.email: contacts.append(f'✉️ {resume.email}')
        if contacts:
            story.append(Paragraph(' | '.join(contacts), styles['Normal']))
            story.append(Spacer(1, 0.4*cm))
        if resume.skills:
            story.append(Paragraph('<b>Навыки:</b>', styles['Normal']))
            story.append(Paragraph(resume.skills, styles['Normal']))
            story.append(Spacer(1, 0.4*cm))
        from courses.models import Enrollment
        enrollments = Enrollment.objects.filter(user=request.user).select_related('course')
        if enrollments.exists():
            story.append(Paragraph('<b>Пройденные курсы:</b>', styles['Normal']))
            for e in enrollments:
                story.append(Paragraph(f'• {e.course.title}', styles['Normal']))
        doc.build(story)
        buffer.seek(0)
        return FileResponse(buffer, as_attachment=True, filename='resume.pdf', content_type='application/pdf')
