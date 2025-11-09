from rest_framework import serializers
from .models import Course, Section, Lesson, LessonAttachment, LessonProgress, CourseCompletion


class LessonAttachmentSerializer(serializers.ModelSerializer):
    """Serializer para anexos de aula."""
    
    class Meta:
        model = LessonAttachment
        fields = [
            'id',
            'lesson',
            'titulo',
            'arquivo',
            'tipo_arquivo',
            'tamanho_kb',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class LessonSerializer(serializers.ModelSerializer):
    """Serializer para aulas."""
    
    attachments = LessonAttachmentSerializer(many=True, read_only=True)
    section_name = serializers.CharField(source='section.titulo', read_only=True)
    
    class Meta:
        model = Lesson
        fields = [
            'id',
            'section',
            'section_name',
            'titulo',
            'subtitulo',
            'descricao',
            'video',
            'duracao_minutos',
            'ordem',
            'attachments',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class LessonListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listagem de aulas."""
    
    class Meta:
        model = Lesson
        fields = [
            'id',
            'titulo',
            'subtitulo',
            'duracao_minutos',
            'ordem',
            'created_at'
        ]


class SectionSerializer(serializers.ModelSerializer):
    """Serializer para seções."""
    
    lessons = LessonSerializer(many=True, read_only=True)
    course_name = serializers.CharField(source='course.titulo', read_only=True)
    total_lessons = serializers.SerializerMethodField()
    
    class Meta:
        model = Section
        fields = [
            'id',
            'course',
            'course_name',
            'titulo',
            'subtitulo',
            'descricao_subtitulo',
            'descricao',
            'ordem',
            'lessons',
            'total_lessons',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_total_lessons(self, obj):
        return obj.lessons.count()


class SectionListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listagem de seções."""
    
    total_lessons = serializers.SerializerMethodField()
    
    class Meta:
        model = Section
        fields = [
            'id',
            'titulo',
            'subtitulo',
            'descricao_subtitulo',
            'ordem',
            'total_lessons'
        ]
    
    def get_total_lessons(self, obj):
        return obj.lessons.count()


class CourseSerializer(serializers.ModelSerializer):
    """Serializer para cursos."""
    
    sections = SectionSerializer(many=True, read_only=True)
    total_sections = serializers.SerializerMethodField()
    total_lessons = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = [
            'id',
            'titulo',
            'subtitulo',
            'categoria',
            'grau_dificuldade',
            'resumo',
            'imagem',
            'is_active',
            'sections',
            'total_sections',
            'total_lessons',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_total_sections(self, obj):
        return obj.sections.count()
    
    def get_total_lessons(self, obj):
        total = 0
        for section in obj.sections.all():
            total += section.lessons.count()
        return total


class CourseListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listagem de cursos."""
    
    total_sections = serializers.SerializerMethodField()
    total_lessons = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = [
            'id',
            'titulo',
            'subtitulo',
            'categoria',
            'grau_dificuldade',
            'imagem',
            'is_active',
            'total_sections',
            'total_lessons',
            'created_at'
        ]
    
    def get_total_sections(self, obj):
        return obj.sections.count()
    
    def get_total_lessons(self, obj):
        total = 0
        for section in obj.sections.all():
            total += section.lessons.count()
        return total


class LessonProgressSerializer(serializers.ModelSerializer):
    """Serializer para progresso de aula."""
    
    lesson_title = serializers.CharField(source='lesson.titulo', read_only=True)
    
    class Meta:
        model = LessonProgress
        fields = [
            'id',
            'user',
            'lesson',
            'lesson_title',
            'current_time',
            'completed',
            'last_watched',
            'created_at'
        ]
        read_only_fields = ['id', 'user', 'last_watched', 'created_at']


class CourseCompletionSerializer(serializers.ModelSerializer):
    """Serializer para conclusão de curso."""
    
    course_title = serializers.CharField(source='course.titulo', read_only=True)
    course_image = serializers.ImageField(source='course.imagem', read_only=True)
    course_category = serializers.CharField(source='course.categoria', read_only=True)
    course_difficulty = serializers.CharField(source='course.grau_dificuldade', read_only=True)
    user_name = serializers.CharField(source='user.inmate.full_name', read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)
    total_hours = serializers.SerializerMethodField()
    
    class Meta:
        model = CourseCompletion
        fields = [
            'id',
            'user',
            'user_name',
            'user_username',
            'course',
            'course_title',
            'course_image',
            'course_category',
            'course_difficulty',
            'completed_at',
            'certificate_code',
            'total_hours'
        ]
        read_only_fields = ['id', 'user', 'completed_at', 'certificate_code']
    
    def get_total_hours(self, obj):
        """Calcula o total de horas do curso somando a duração de todas as aulas."""
        total_minutes = 0
        for section in obj.course.sections.all():
            for lesson in section.lessons.all():
                total_minutes += lesson.duracao_minutos
        
        # Converte para horas
        hours = total_minutes / 60
        return round(hours, 1)  # Retorna com 1 casa decimal