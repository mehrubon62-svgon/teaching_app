from rest_framework import serializers
from .models import Category, Course, Module, Lesson, LessonAttachment, Enrollment, LessonProgress


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model  = Category
        fields = ['id', 'name', 'category_type', 'icon']


class LessonAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model  = LessonAttachment
        fields = ['id', 'title', 'file']


class LessonListSerializer(serializers.ModelSerializer):
    """Краткая инфо по уроку (для списка модуля)"""
    class Meta:
        model  = Lesson
        fields = ['id', 'title', 'order', 'is_locked', 'video_type', 'xp_reward']


class LessonDetailSerializer(serializers.ModelSerializer):
    """Полная инфо по уроку (для страницы урока)"""
    attachments = LessonAttachmentSerializer(many=True, read_only=True)

    class Meta:
        model  = Lesson
        fields = ['id', 'title', 'description', 'video_url', 'video_type', 'order', 'is_locked', 'xp_reward', 'attachments']


class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonListSerializer(many=True, read_only=True)

    class Meta:
        model  = Module
        fields = ['id', 'title', 'order', 'lessons']


class CourseListSerializer(serializers.ModelSerializer):
    """Краткая инфо по курсу (для списков и главной страницы)"""
    category         = CategorySerializer(read_only=True)
    instructor_name  = serializers.CharField(source='instructor.full_name', read_only=True)
    has_discount     = serializers.BooleanField(read_only=True)
    enrolled_count   = serializers.SerializerMethodField()

    class Meta:
        model  = Course
        fields = [
            'id', 'title', 'thumbnail', 'category', 'instructor_name',
            'price', 'discount_price', 'has_discount',
            'is_promoted', 'is_popular', 'enrolled_count'
        ]

    def get_enrolled_count(self, obj):
        return obj.enrollments.count()


class CourseDetailSerializer(serializers.ModelSerializer):
    """Полная инфо по курсу + модули"""
    category        = CategorySerializer(read_only=True)
    instructor_name = serializers.CharField(source='instructor.full_name', read_only=True)
    modules         = ModuleSerializer(many=True, read_only=True)
    has_discount    = serializers.BooleanField(read_only=True)
    enrolled_count  = serializers.SerializerMethodField()
    is_enrolled     = serializers.SerializerMethodField()

    class Meta:
        model  = Course
        fields = [
            'id', 'title', 'description', 'thumbnail', 'category',
            'instructor_name', 'price', 'discount_price', 'has_discount',
            'is_promoted', 'is_popular', 'enrolled_count', 'is_enrolled',
            'modules', 'created_at'
        ]

    def get_enrolled_count(self, obj):
        return obj.enrollments.count()

    def get_is_enrolled(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.enrollments.filter(user=request.user).exists()
        return False


class CourseCreateSerializer(serializers.ModelSerializer):
    """Создание / редактирование курса (для учителей и модераторов)"""
    class Meta:
        model  = Course
        fields = ['id', 'title', 'description', 'category', 'thumbnail', 'price', 'discount_price', 'is_published']

    def create(self, validated_data):
        request = self.context['request']
        validated_data['instructor'] = request.user
        return super().create(validated_data)


class EnrollmentSerializer(serializers.ModelSerializer):
    course = CourseListSerializer(read_only=True)

    class Meta:
        model  = Enrollment
        fields = ['id', 'course', 'enrolled_at']


class LessonProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model  = LessonProgress
        fields = ['lesson', 'is_completed', 'completed_at']
