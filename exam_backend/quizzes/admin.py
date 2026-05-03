from django.contrib import admin
from .models import Quiz, Question, Answer, UserQuizAttempt


class AnswerInline(admin.TabularInline):
    model  = Answer
    extra  = 4
    fields = ['text', 'is_correct']


class QuestionInline(admin.StackedInline):
    model  = Question
    extra  = 0
    fields = ['text', 'order']


@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ['title', 'lesson', 'passing_score', 'xp_reward', 'unlocks_next']
    inlines      = [QuestionInline]


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['text', 'quiz', 'order']
    inlines      = [AnswerInline]


@admin.register(UserQuizAttempt)
class UserQuizAttemptAdmin(admin.ModelAdmin):
    list_display = ['user', 'quiz', 'score', 'passed', 'xp_earned', 'attempted_at']
    list_filter  = ['passed']
