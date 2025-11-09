from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Count, Q

from .models import Course, Section, Lesson, LessonAttachment, LessonProgress, CourseCompletion
from .serializers import (
    CourseSerializer,
    CourseListSerializer,
    SectionSerializer,
    SectionListSerializer,
    LessonSerializer,
    LessonListSerializer,
    LessonAttachmentSerializer,
    LessonProgressSerializer,
    CourseCompletionSerializer
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


class LessonProgressViewSet(viewsets.ModelViewSet):
    """ViewSet para gerenciar progresso das aulas."""
    
    queryset = LessonProgress.objects.all()
    serializer_class = LessonProgressSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Retorna apenas o progresso do usuário autenticado."""
        return LessonProgress.objects.filter(user=self.request.user).select_related('lesson', 'user')
    
    def perform_create(self, serializer):
        """Associa o progresso ao usuário autenticado."""
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'], url_path='by-lesson/(?P<lesson_id>[^/.]+)')
    def by_lesson(self, request, lesson_id=None):
        """Retorna o progresso do usuário em uma aula específica."""
        try:
            progress = LessonProgress.objects.get(user=request.user, lesson_id=lesson_id)
            serializer = self.get_serializer(progress)
            return Response(serializer.data)
        except LessonProgress.DoesNotExist:
            return Response({'current_time': 0, 'completed': False}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'], url_path='update-progress')
    def update_progress(self, request):
        """Atualiza ou cria o progresso de uma aula."""
        lesson_id = request.data.get('lesson')
        current_time = request.data.get('current_time', 0)
        completed = request.data.get('completed', False)
        
        if not lesson_id:
            return Response({'error': 'lesson_id é obrigatório'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Verifica se a aula existe
        try:
            lesson = Lesson.objects.get(id=lesson_id)
        except Lesson.DoesNotExist:
            return Response({'error': 'Aula não encontrada'}, status=status.HTTP_404_NOT_FOUND)
        
        # Atualiza ou cria o progresso
        progress, created = LessonProgress.objects.update_or_create(
            user=request.user,
            lesson=lesson,
            defaults={
                'current_time': current_time,
                'completed': completed
            }
        )
        
        serializer = self.get_serializer(progress)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'], url_path='last-watched-lesson/(?P<course_id>[^/.]+)')
    def last_watched_lesson(self, request, course_id=None):
        """Retorna a última aula assistida de um curso específico."""
        try:
            # Busca o curso
            course = Course.objects.get(id=course_id)
            
            # Busca todos os IDs de aulas do curso
            lesson_ids = Lesson.objects.filter(
                section__course=course
            ).values_list('id', flat=True)
            
            # Busca a última aula assistida pelo usuário neste curso
            last_progress = LessonProgress.objects.filter(
                user=request.user,
                lesson_id__in=lesson_ids
            ).order_by('-last_watched').first()
            
            if last_progress:
                return Response({
                    'lesson_id': last_progress.lesson.id,
                    'last_watched': last_progress.last_watched,
                    'current_time': last_progress.current_time,
                    'completed': last_progress.completed
                }, status=status.HTTP_200_OK)
            else:
                # Se não há progresso, retorna a primeira aula do curso
                first_lesson = Lesson.objects.filter(
                    section__course=course
                ).order_by('section__ordem', 'ordem').first()
                
                if first_lesson:
                    return Response({
                        'lesson_id': first_lesson.id,
                        'last_watched': None,
                        'current_time': 0,
                        'completed': False
                    }, status=status.HTTP_200_OK)
                else:
                    return Response({'error': 'Nenhuma aula encontrada neste curso'}, status=status.HTTP_404_NOT_FOUND)
                    
        except Course.DoesNotExist:
            return Response({'error': 'Curso não encontrado'}, status=status.HTTP_404_NOT_FOUND)


class CourseCompletionViewSet(viewsets.ModelViewSet):
    """ViewSet para gerenciar conclusões de curso."""
    
    serializer_class = CourseCompletionSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'head', 'options']  # Somente leitura e criação
    
    def get_queryset(self):
        """Retorna apenas as conclusões do usuário atual."""
        return CourseCompletion.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        """Associa o usuário atual ao criar conclusão."""
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['post'], url_path='complete-course')
    def complete_course(self, request):
        """Marca um curso como concluído pelo usuário."""
        course_id = request.data.get('course')
        
        if not course_id:
            return Response({'error': 'course_id é obrigatório'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Verifica se o curso existe
        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return Response({'error': 'Curso não encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
        # Verifica se o usuário já concluiu o curso
        existing = CourseCompletion.objects.filter(user=request.user, course=course).first()
        if existing:
            serializer = self.get_serializer(existing)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        # Cria a conclusão do curso
        completion = CourseCompletion.objects.create(
            user=request.user,
            course=course
        )
        
        serializer = self.get_serializer(completion)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'], url_path='by-course/(?P<course_id>[^/.]+)')
    def by_course(self, request, course_id=None):
        """Retorna a conclusão de um curso específico."""
        try:
            completion = CourseCompletion.objects.get(user=request.user, course_id=course_id)
            serializer = self.get_serializer(completion)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except CourseCompletion.DoesNotExist:
            return Response({'completed': False}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'], url_path='by-code/(?P<code>[^/.]+)')
    def by_code(self, request, code=None):
        """Busca um certificado pelo código - apenas o dono pode visualizar."""
        try:
            completion = CourseCompletion.objects.get(certificate_code=code)
            
            # Verifica se o usuário autenticado é o dono do certificado
            if completion.user != request.user:
                return Response(
                    {'error': 'Você não tem permissão para visualizar este certificado'}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
            serializer = self.get_serializer(completion)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except CourseCompletion.DoesNotExist:
            return Response({'error': 'Certificado não encontrado'}, status=status.HTTP_404_NOT_FOUND)
