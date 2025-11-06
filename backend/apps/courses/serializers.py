from rest_framework import serializers
from .models import Course, Section, Lesson, LessonAttachment


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
    
    lessons = LessonListSerializer(many=True, read_only=True)
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
    
    sections = SectionListSerializer(many=True, read_only=True)
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
