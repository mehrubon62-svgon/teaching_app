from django.contrib import admin
from .models import Category, Course, Module, Lesson, LessonAttachment, Enrollment, LessonProgress


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'category_type', 'icon', 'order']
    list_editable = ['order']


class ModuleInline(admin.TabularInline):
    model  = Module
    extra  = 0
    fields = ['title', 'order']


class LessonInline(admin.TabularInline):
    model  = Lesson
    extra  = 0
    fields = ['title', 'order', 'is_locked', 'xp_reward']


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display  = ['title', 'category', 'instructor', 'price', 'is_published', 'is_popular', 'is_promoted']
    list_filter   = ['is_published', 'is_popular', 'is_promoted', 'category']
    list_editable = ['is_published', 'is_popular', 'is_promoted']
    search_fields = ['title']
    inlines       = [ModuleInline]


@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'order']
    inlines      = [LessonInline]


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display  = ['title', 'module', 'order', 'is_locked', 'xp_reward', 'video_type']
    list_editable = ['is_locked', 'order']


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ['user', 'course', 'enrolled_at']


@admin.register(LessonAttachment)
class AttachmentAdmin(admin.ModelAdmin):
    list_display = ['title', 'lesson']
