from rest_framework import serializers
from django.contrib.auth import get_user_model
from courses.models import Enrollment
from .models import Resume

User = get_user_model()


class ResumeSerializer(serializers.ModelSerializer):
    completed_courses = serializers.SerializerMethodField()

    class Meta:
        model  = Resume
        fields = ['id', 'full_name', 'bio', 'skills', 'phone', 'email', 'completed_courses', 'updated_at']
        read_only_fields = ['id', 'completed_courses', 'updated_at']

    def get_completed_courses(self, obj):
        enrollments = Enrollment.objects.filter(user=obj.user).select_related('course')
        return [e.course.title for e in enrollments]
