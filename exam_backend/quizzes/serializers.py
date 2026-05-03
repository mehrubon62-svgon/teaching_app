from rest_framework import serializers
from .models import Quiz, Question, Answer, UserQuizAttempt


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Answer
        fields = ['id', 'text']  # is_correct намеренно скрыт


class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, read_only=True)

    class Meta:
        model  = Question
        fields = ['id', 'text', 'order', 'answers']


class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model  = Quiz
        fields = ['id', 'title', 'passing_score', 'xp_reward', 'unlocks_next', 'questions']


class SubmitAnswerSerializer(serializers.Serializer):
    """Ответы пользователя: {question_id: answer_id}"""
    answers = serializers.DictField(
        child=serializers.IntegerField(),
        help_text='{"question_id": answer_id, ...}'
    )


class QuizResultSerializer(serializers.ModelSerializer):
    class Meta:
        model  = UserQuizAttempt
        fields = ['id', 'score', 'passed', 'xp_earned', 'attempted_at']
