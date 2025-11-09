from django.contrib import admin
from .models import Course, Section, Lesson, LessonAttachment


class SectionInline(admin.TabularInline):
    """Inline para exibir seções dentro do curso."""
    model = Section
    extra = 1
    fields = ['titulo', 'subtitulo', 'ordem']


class LessonInline(admin.TabularInline):
    """Inline para exibir aulas dentro da seção."""
    model = Lesson
    extra = 1
    fields = ['titulo', 'subtitulo', 'ordem', 'duracao_minutos']


class LessonAttachmentInline(admin.TabularInline):
    """Inline para exibir anexos dentro da aula."""
    model = LessonAttachment
    extra = 1
    fields = ['titulo', 'arquivo', 'tipo_arquivo']


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    """Admin para gerenciar cursos."""
    
    list_display = [
        'titulo',
        'categoria',
        'grau_dificuldade',
        'is_active',
        'created_at'
    ]
    list_filter = ['categoria', 'grau_dificuldade', 'is_active', 'created_at']
    search_fields = ['titulo', 'subtitulo', 'resumo']
    readonly_fields = ['created_at', 'updated_at']
    inlines = [SectionInline]
    
    fieldsets = (
        ('Informações Básicas', {
            'fields': ('titulo', 'subtitulo', 'categoria')
        }),
        ('Detalhes do Curso', {
            'fields': ('grau_dificuldade', 'resumo', 'imagem')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
        ('Datas', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
    """Admin para gerenciar seções."""
    
    list_display = [
        'titulo',
        'course',
        'ordem',
        'created_at'
    ]
    list_filter = ['course', 'created_at']
    search_fields = ['titulo', 'subtitulo', 'descricao']
    readonly_fields = ['created_at', 'updated_at']
    inlines = [LessonInline]
    
    fieldsets = (
        ('Informações Básicas', {
            'fields': ('course', 'titulo', 'subtitulo')
        }),
        ('Detalhes da Seção', {
            'fields': ('descricao', 'ordem')
        }),
        ('Datas', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    """Admin para gerenciar aulas."""
    
    list_display = [
        'titulo',
        'section',
        'ordem',
        'duracao_minutos',
        'created_at'
    ]
    list_filter = ['section__course', 'section', 'created_at']
    search_fields = ['titulo', 'subtitulo', 'descricao']
    readonly_fields = ['created_at', 'updated_at']
    inlines = [LessonAttachmentInline]
    
    fieldsets = (
        ('Informações Básicas', {
            'fields': ('section', 'titulo', 'subtitulo')
        }),
        ('Conteúdo da Aula', {
            'fields': ('descricao', 'video', 'duracao_minutos')
        }),
        ('Ordenação', {
            'fields': ('ordem',)
        }),
        ('Datas', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(LessonAttachment)
class LessonAttachmentAdmin(admin.ModelAdmin):
    """Admin para gerenciar anexos de aulas."""
    
    list_display = [
        'titulo',
        'lesson',
        'tipo_arquivo',
        'tamanho_kb',
        'created_at'
    ]
    list_filter = ['tipo_arquivo', 'created_at']
    search_fields = ['titulo', 'lesson__titulo']
    readonly_fields = ['created_at']
    
    fieldsets = (
        ('Informações Básicas', {
            'fields': ('lesson', 'titulo')
        }),
        ('Arquivo', {
            'fields': ('arquivo', 'tipo_arquivo', 'tamanho_kb')
        }),
        ('Datas', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
