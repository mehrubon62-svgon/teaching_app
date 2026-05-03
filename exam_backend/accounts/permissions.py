from rest_framework.permissions import BasePermission


class IsStudent(BasePermission):
    """Только студенты"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'student'


class IsTeacher(BasePermission):
    """Только учителя"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'teacher'


class IsTeacherOrModerator(BasePermission):
    """Учитель или модератор"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ('teacher', 'moderator')


class IsModerator(BasePermission):
    """Только модераторы"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'moderator'
