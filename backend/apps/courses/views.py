from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Count, Q

from .models import Course, Section, Lesson, LessonAttachment
from .serializers import (
    CourseSerializer,
    CourseListSerializer,
    SectionSerializer,
    SectionListSerializer,
    LessonSerializer,
    LessonListSerializer,
    LessonAttachmentSerializer
)


class CourseViewSet(viewsets.ModelViewSet):
    """ViewSet para gerenciar cursos."""
    
    queryset = Course.objects.all()
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return CourseListSerializer
        return CourseSerializer
    
    def get_permissions(self):
        """Define permissões baseadas na ação."""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        """Filtra cursos baseado nos parâmetros da query."""
        queryset = Course.objects.all()
        
        # Filtro por categoria
        categoria = self.request.query_params.get('categoria', None)
        if categoria:
            queryset = queryset.filter(categoria__icontains=categoria)
        
        # Filtro por dificuldade
        dificuldade = self.request.query_params.get('dificuldade', None)
        if dificuldade:
            queryset = queryset.filter(grau_dificuldade=dificuldade)
        
        # Filtro por status ativo
        is_active = self.request.query_params.get('is_active', None)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        # Busca por título
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(titulo__icontains=search) | Q(resumo__icontains=search)
            )
        
        return queryset.prefetch_related('sections__lessons')
    
    @action(detail=True, methods=['get'])
    def sections(self, request, pk=None):
        """Retorna todas as seções de um curso."""
        course = self.get_object()
        sections = course.sections.all()
        serializer = SectionListSerializer(sections, many=True)
        return Response(serializer.data)


class SectionViewSet(viewsets.ModelViewSet):
    """ViewSet para gerenciar seções."""
    
    queryset = Section.objects.all()
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return SectionListSerializer
        return SectionSerializer
    
    def get_permissions(self):
        """Define permissões baseadas na ação."""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        """Filtra seções baseado nos parâmetros da query."""
        queryset = Section.objects.all()
        
        # Filtro por curso
        course_id = self.request.query_params.get('course', None)
        if course_id:
            queryset = queryset.filter(course_id=course_id)
        
        return queryset.select_related('course').prefetch_related('lessons')
    
    @action(detail=True, methods=['get'])
    def lessons(self, request, pk=None):
        """Retorna todas as aulas de uma seção."""
        section = self.get_object()
        lessons = section.lessons.all()
        serializer = LessonListSerializer(lessons, many=True)
        return Response(serializer.data)


class LessonViewSet(viewsets.ModelViewSet):
    """ViewSet para gerenciar aulas."""
    
    queryset = Lesson.objects.all()
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return LessonListSerializer
        return LessonSerializer
    
    def get_permissions(self):
        """Define permissões baseadas na ação."""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        """Filtra aulas baseado nos parâmetros da query."""
        queryset = Lesson.objects.all()
        
        # Filtro por seção
        section_id = self.request.query_params.get('section', None)
        if section_id:
            queryset = queryset.filter(section_id=section_id)
        
        return queryset.select_related('section__course').prefetch_related('attachments')
    
    @action(detail=True, methods=['get'])
    def attachments(self, request, pk=None):
        """Retorna todos os anexos de uma aula."""
        lesson = self.get_object()
        attachments = lesson.attachments.all()
        serializer = LessonAttachmentSerializer(attachments, many=True)
        return Response(serializer.data)


class LessonAttachmentViewSet(viewsets.ModelViewSet):
    """ViewSet para gerenciar anexos de aulas."""
    
    queryset = LessonAttachment.objects.all()
    serializer_class = LessonAttachmentSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def get_permissions(self):
        """Define permissões baseadas na ação."""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        """Filtra anexos baseado nos parâmetros da query."""
        queryset = LessonAttachment.objects.all()
        
        # Filtro por aula
        lesson_id = self.request.query_params.get('lesson', None)
        if lesson_id:
            queryset = queryset.filter(lesson_id=lesson_id)
        
        return queryset.select_related('lesson')
