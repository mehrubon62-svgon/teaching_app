from django.shortcuts import get_object_or_404
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from .models import Quiz, UserQuizAttempt
from .serializers import QuizSerializer, SubmitAnswerSerializer, QuizResultSerializer
from gamification.models import UserGameProfile


class QuizDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(
        operation_summary='Получить тест',
        operation_description='Возвращает вопросы и варианты ответов. Правильные ответы скрыты — раскрываются только после отправки.',
        responses={200: QuizSerializer()},
        tags=['Тесты'],
    )
    def get(self, request, pk):
        quiz = get_object_or_404(Quiz, pk=pk)
        return Response(QuizSerializer(quiz).data)


class SubmitQuizView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(
        operation_summary='Сдать тест',
        operation_description='Отправляет ответы и возвращает результат. При успехе начисляются XP. Если unlocks_next=true — открывается следующий урок.',
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['answers'],
            properties={
                'answers': openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    description='Ключ — ID вопроса, значение — ID выбранного ответа',
                    example={'1': 3, '2': 7, '3': 12},
                    additional_properties=openapi.Schema(type=openapi.TYPE_INTEGER),
                ),
            }
        ),
        responses={
            200: openapi.Response('Результат теста', examples={'application/json': {
                'score': 75.0, 'passed': True, 'xp_earned': 20,
                'correct': 3, 'total': 4,
                'message': 'Тест пройден! 🎉'
            }}),
        },
        tags=['Тесты'],
    )
    def post(self, request, pk):
        quiz = get_object_or_404(Quiz, pk=pk)
        serializer = SubmitAnswerSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        answers_data  = serializer.validated_data['answers']
        questions     = quiz.questions.prefetch_related('answers').all()
        correct_count = 0
        total         = questions.count()
        for question in questions:
            chosen_id = answers_data.get(str(question.id))
            if chosen_id and question.answers.filter(id=chosen_id, is_correct=True).exists():
                correct_count += 1
        score  = (correct_count / total * 100) if total else 0
        passed = score >= quiz.passing_score
        xp     = quiz.xp_reward if passed else 0
        attempt = UserQuizAttempt.objects.create(
            user=request.user, quiz=quiz, score=score, passed=passed, xp_earned=xp
        )
        if passed:
            profile, _ = UserGameProfile.objects.get_or_create(user=request.user)
            profile.add_xp(xp)
            if quiz.unlocks_next and quiz.lesson:
                next_lesson = quiz.lesson.module.lessons.filter(order__gt=quiz.lesson.order).order_by('order').first()
                if next_lesson:
                    next_lesson.is_locked = False
                    next_lesson.save()
        return Response({**QuizResultSerializer(attempt).data, 'correct': correct_count, 'total': total,
                         'message': 'Тест пройден! 🎉' if passed else f'Не пройден. Нужно {quiz.passing_score}%, у вас {score:.0f}%'})


class MyQuizAttemptsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(
        operation_summary='Мои попытки тестов',
        operation_description='История всех попыток прохождения тестов текущего пользователя.',
        responses={200: QuizResultSerializer(many=True)},
        tags=['Тесты'],
    )
    def get(self, request):
        attempts = UserQuizAttempt.objects.filter(user=request.user).select_related('quiz')
        return Response(QuizResultSerializer(attempts, many=True).data)
