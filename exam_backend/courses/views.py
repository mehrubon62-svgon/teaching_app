from django.utils import timezone
from django.shortcuts import get_object_or_404
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from .models import Category, Course, Module, Lesson, Enrollment, LessonProgress
from .serializers import (
    CategorySerializer, CourseListSerializer, CourseDetailSerializer,
    CourseCreateSerializer, EnrollmentSerializer, LessonDetailSerializer
)
from accounts.permissions import IsTeacherOrModerator, IsModerator


class HomeView(APIView):
    permission_classes = [permissions.AllowAny]

    @swagger_auto_schema(
        operation_summary='Главная страница',
        operation_description='Возвращает: popular_courses, promoted_courses, recommended, continue_learning (если авторизован).',
        responses={200: openapi.Response('Данные главной', examples={'application/json': {
            'popular_courses': [], 'promoted_courses': [], 'recommended': [], 'continue_learning': []
        }})},
        tags=['Главная'],
    )
    def get(self, request):
        published = Course.objects.filter(is_published=True)
        ctx = {'request': request}
        data = {
            'popular_courses':   CourseListSerializer(published.filter(is_popular=True)[:6],  many=True, context=ctx).data,
            'promoted_courses':  CourseListSerializer(published.filter(is_promoted=True)[:6], many=True, context=ctx).data,
            'recommended':       CourseListSerializer(published.order_by('-created_at')[:8],  many=True, context=ctx).data,
            'continue_learning': [],
        }
        if request.user.is_authenticated:
            enrolled = Course.objects.filter(enrollments__user=request.user, is_published=True)[:6]
            data['continue_learning'] = CourseListSerializer(enrolled, many=True, context=ctx).data
        return Response(data)


class CategoryListView(APIView):
    permission_classes = [permissions.AllowAny]

    @swagger_auto_schema(
        operation_summary='Список категорий',
        operation_description='Все категории, сгруппированные по типу: occupations и school_subjects.',
        responses={200: openapi.Response('Категории', examples={'application/json': {
            'occupations':     [{'id': 1, 'name': 'Frontend', 'category_type': 'occupation', 'icon': '💻'}],
            'school_subjects': [{'id': 2, 'name': 'Математика', 'category_type': 'school_subject', 'icon': '📐'}],
        }})},
        tags=['Категории'],
    )
    def get(self, request):
        categories = Category.objects.all()
        return Response({
            'occupations':     CategorySerializer(categories.filter(category_type='occupation'), many=True).data,
            'school_subjects': CategorySerializer(categories.filter(category_type='school_subject'), many=True).data,
        })


class CategoryManageView(APIView):
    permission_classes = [IsModerator]

    @swagger_auto_schema(
        operation_summary='Создать категорию',
        operation_description='Только модераторы. Создаёт новую категорию курсов.',
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['name', 'category_type'],
            properties={
                'name':          openapi.Schema(type=openapi.TYPE_STRING, example='Frontend'),
                'category_type': openapi.Schema(type=openapi.TYPE_STRING, enum=['occupation', 'school_subject'], example='occupation'),
                'icon':          openapi.Schema(type=openapi.TYPE_STRING, example='💻'),
                'order':         openapi.Schema(type=openapi.TYPE_INTEGER, example=1),
            }
        ),
        responses={201: CategorySerializer()},
        tags=['Категории'],
    )
    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CourseListView(APIView):
    permission_classes = [permissions.AllowAny]

    @swagger_auto_schema(
        operation_summary='Список курсов',
        operation_description='Опубликованные курсы. Фильтры: ?category=1 | ?search=python | ?popular=true | ?promoted=true',
        manual_parameters=[
            openapi.Parameter('category', openapi.IN_QUERY, type=openapi.TYPE_INTEGER, description='ID категории', example=1),
            openapi.Parameter('search',   openapi.IN_QUERY, type=openapi.TYPE_STRING,  description='Поиск по названию', example='python'),
            openapi.Parameter('popular',  openapi.IN_QUERY, type=openapi.TYPE_BOOLEAN, description='Только популярные'),
            openapi.Parameter('promoted', openapi.IN_QUERY, type=openapi.TYPE_BOOLEAN, description='Только со скидкой'),
        ],
        responses={200: CourseListSerializer(many=True)},
        tags=['Курсы'],
    )
    def get(self, request):
        qs = Course.objects.filter(is_published=True).select_related('category', 'instructor')
        if category_id := request.query_params.get('category'):
            qs = qs.filter(category_id=category_id)
        if search := request.query_params.get('search'):
            qs = qs.filter(title__icontains=search)
        if request.query_params.get('popular') == 'true':
            qs = qs.filter(is_popular=True)
        if request.query_params.get('promoted') == 'true':
            qs = qs.filter(is_promoted=True)
        return Response(CourseListSerializer(qs, many=True, context={'request': request}).data)


class CourseCreateView(APIView):
    permission_classes = [IsTeacherOrModerator]

    @swagger_auto_schema(
        operation_summary='Создать курс',
        operation_description='Учителя и модераторы. Инструктором автоматически становится текущий пользователь.',
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['title', 'description'],
            properties={
                'title':          openapi.Schema(type=openapi.TYPE_STRING, example='Python для начинающих'),
                'description':    openapi.Schema(type=openapi.TYPE_STRING, example='Полный курс по Python с нуля'),
                'category':       openapi.Schema(type=openapi.TYPE_INTEGER, example=1, description='ID категории'),
                'price':          openapi.Schema(type=openapi.TYPE_NUMBER,  example=99000),
                'discount_price': openapi.Schema(type=openapi.TYPE_NUMBER,  example=49000),
                'is_published':   openapi.Schema(type=openapi.TYPE_BOOLEAN, example=True),
            }
        ),
        responses={201: CourseDetailSerializer()},
        tags=['Курсы'],
    )
    def post(self, request):
        serializer = CourseCreateSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CourseDetailView(APIView):
    def get_permissions(self):
        if self.request.method == 'PATCH':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    @swagger_auto_schema(
        operation_summary='Детали курса',
        operation_description='Полное описание курса с модулями и списком уроков. Флаг is_enrolled показывает, записан ли пользователь.',
        responses={200: CourseDetailSerializer()},
        tags=['Курсы'],
    )
    def get(self, request, pk):
        course = get_object_or_404(Course, pk=pk, is_published=True)
        return Response(CourseDetailSerializer(course, context={'request': request}).data)

    @swagger_auto_schema(
        operation_summary='Обновить курс',
        operation_description='Учитель может редактировать только свои курсы. Модератор — любой.',
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'title':        openapi.Schema(type=openapi.TYPE_STRING,  example='Новое название курса'),
                'is_published': openapi.Schema(type=openapi.TYPE_BOOLEAN, example=True),
                'is_popular':   openapi.Schema(type=openapi.TYPE_BOOLEAN, example=True),
                'is_promoted':  openapi.Schema(type=openapi.TYPE_BOOLEAN, example=False),
            }
        ),
        responses={200: CourseDetailSerializer()},
        tags=['Курсы'],
    )
    def patch(self, request, pk):
        course = get_object_or_404(Course, pk=pk)
        if not (request.user.is_moderator or course.instructor == request.user):
            return Response({'error': 'Нет доступа'}, status=status.HTTP_403_FORBIDDEN)
        serializer = CourseCreateSerializer(course, data=request.data, partial=True, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class EnrollView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(
        operation_summary='Записаться на курс',
        operation_description='Записывает текущего пользователя на курс. Повторная запись возвращает ошибку.',
        request_body=openapi.Schema(type=openapi.TYPE_OBJECT, properties={}),
        responses={
            201: openapi.Response('Успешно', examples={'application/json': {'message': 'Вы записались на курс «Python»'}}),
            400: openapi.Response('Уже записан', examples={'application/json': {'error': 'Вы уже записаны на этот курс'}}),
        },
        tags=['Курсы'],
    )
    def post(self, request, pk):
        course = get_object_or_404(Course, pk=pk, is_published=True)
        if Enrollment.objects.filter(user=request.user, course=course).exists():
            return Response({'error': 'Вы уже записаны на этот курс'}, status=status.HTTP_400_BAD_REQUEST)
        Enrollment.objects.create(user=request.user, course=course)
        return Response({'message': f'Вы записались на курс «{course.title}»'}, status=status.HTTP_201_CREATED)


class MyCourseListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(
        operation_summary='Мои курсы',
        operation_description='Курсы, на которые записан текущий пользователь.',
        responses={200: EnrollmentSerializer(many=True)},
        tags=['Курсы'],
    )
    def get(self, request):
        enrollments = Enrollment.objects.filter(user=request.user).select_related('course')
        return Response(EnrollmentSerializer(enrollments, many=True, context={'request': request}).data)


class LessonDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(
        operation_summary='Детали урока',
        operation_description='Видео URL, описание и вложения урока. Если урок заблокирован — нужно сначала пройти тест.',
        responses={
            200: LessonDetailSerializer(),
            403: openapi.Response('Заблокирован', examples={'application/json': {'error': 'Сначала пройдите тест'}}),
        },
        tags=['Уроки'],
    )
    def get(self, request, pk):
        lesson = get_object_or_404(Lesson, pk=pk)
        if lesson.is_locked:
            quiz = getattr(lesson, 'quiz', None)
            passed = request.user.quiz_attempts.filter(quiz=quiz, passed=True).exists() if quiz else False
            if not passed:
                return Response({'error': 'Сначала пройдите тест предыдущего урока'}, status=status.HTTP_403_FORBIDDEN)
        progress, _ = LessonProgress.objects.get_or_create(user=request.user, lesson=lesson)
        return Response({**LessonDetailSerializer(lesson).data, 'is_completed': progress.is_completed})


class CompleteLessonView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(
        operation_summary='Завершить урок',
        operation_description='Отмечает урок как пройденный и начисляет XP студенту (+10 XP по умолчанию).',
        request_body=openapi.Schema(type=openapi.TYPE_OBJECT, properties={}),
        responses={200: openapi.Response('XP начислен', examples={'application/json': {
            'message': 'Урок завершён! +10 XP', 'xp_earned': 10
        }})},
        tags=['Уроки'],
    )
    def post(self, request, pk):
        from gamification.models import UserGameProfile
        lesson = get_object_or_404(Lesson, pk=pk)
        progress, created = LessonProgress.objects.get_or_create(user=request.user, lesson=lesson)
        if progress.is_completed:
            return Response({'message': 'Урок уже был завершён'})
        progress.is_completed = True
        progress.completed_at = timezone.now()
        progress.save()
        profile, _ = UserGameProfile.objects.get_or_create(user=request.user)
        profile.add_xp(lesson.xp_reward)
        return Response({'message': f'Урок завершён! +{lesson.xp_reward} XP', 'xp_earned': lesson.xp_reward})
