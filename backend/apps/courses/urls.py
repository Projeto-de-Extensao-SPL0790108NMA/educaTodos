from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CourseViewSet,
    SectionViewSet,
    LessonViewSet,
    LessonAttachmentViewSet,
    LessonProgressViewSet,
    CourseCompletionViewSet
)

router = DefaultRouter()
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'sections', SectionViewSet, basename='section')
router.register(r'lessons', LessonViewSet, basename='lesson')
router.register(r'attachments', LessonAttachmentViewSet, basename='attachment')
router.register(r'progress', LessonProgressViewSet, basename='progress')
router.register(r'completions', CourseCompletionViewSet, basename='completion')

urlpatterns = [
    path('', include(router.urls)),
]
