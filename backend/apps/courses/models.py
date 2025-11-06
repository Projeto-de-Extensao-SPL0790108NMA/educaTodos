from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class Course(models.Model):
    """Modelo para representar um curso."""
    
    DIFFICULTY_CHOICES = [
        ('iniciante', 'Iniciante'),
        ('intermediario', 'Intermediário'),
        ('avancado', 'Avançado'),
    ]
    
    titulo = models.CharField(max_length=255, verbose_name="Título do Curso")
    subtitulo = models.CharField(max_length=255, blank=True, verbose_name="Subtítulo do Curso")
    categoria = models.CharField(max_length=100, verbose_name="Categoria")
    grau_dificuldade = models.CharField(
        max_length=20,
        choices=DIFFICULTY_CHOICES,
        default='iniciante',
        verbose_name="Grau de Dificuldade"
    )
    resumo = models.TextField(verbose_name="Resumo do Curso")
    imagem = models.ImageField(
        upload_to='courses/images/',
        blank=True,
        null=True,
        verbose_name="Imagem do Curso"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Data de Criação")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Data de Atualização")
    is_active = models.BooleanField(default=True, verbose_name="Curso Ativo")
    
    class Meta:
        verbose_name = "Curso"
        verbose_name_plural = "Cursos"
        ordering = ['-created_at']
    
    def __str__(self):
        return self.titulo


class Section(models.Model):
    """Modelo para representar uma seção dentro de um curso."""
    
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='sections',
        verbose_name="Curso"
    )
    titulo = models.CharField(max_length=255, verbose_name="Título da Seção")
    subtitulo = models.CharField(max_length=255, blank=True, verbose_name="Subtítulo da Seção")
    descricao_subtitulo = models.TextField(blank=True, verbose_name="Descrição do Subtítulo")
    descricao = models.TextField(verbose_name="Descrição da Seção")
    ordem = models.PositiveIntegerField(
        default=0,
        verbose_name="Ordem da Seção",
        help_text="Define a ordem de exibição da seção no curso"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Data de Criação")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Data de Atualização")
    
    class Meta:
        verbose_name = "Seção"
        verbose_name_plural = "Seções"
        ordering = ['course', 'ordem']
        unique_together = ['course', 'ordem']
    
    def __str__(self):
        return f"{self.course.titulo} - {self.titulo}"


class Lesson(models.Model):
    """Modelo para representar uma aula dentro de uma seção."""
    
    section = models.ForeignKey(
        Section,
        on_delete=models.CASCADE,
        related_name='lessons',
        verbose_name="Seção"
    )
    titulo = models.CharField(max_length=255, verbose_name="Título da Aula")
    subtitulo = models.CharField(max_length=255, blank=True, verbose_name="Subtítulo da Aula")
    descricao = models.TextField(verbose_name="Descrição da Aula")
    video = models.FileField(
        upload_to='courses/videos/',
        blank=True,
        null=True,
        verbose_name="Vídeo da Aula",
        help_text="Upload do arquivo de vídeo da aula"
    )
    duracao_minutos = models.PositiveIntegerField(
        default=0,
        verbose_name="Duração em Minutos",
        help_text="Duração estimada da aula em minutos"
    )
    ordem = models.PositiveIntegerField(
        default=0,
        verbose_name="Ordem da Aula",
        help_text="Define a ordem de exibição da aula na seção"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Data de Criação")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Data de Atualização")
    
    class Meta:
        verbose_name = "Aula"
        verbose_name_plural = "Aulas"
        ordering = ['section', 'ordem']
        unique_together = ['section', 'ordem']
    
    def __str__(self):
        return f"{self.section.course.titulo} - {self.section.titulo} - {self.titulo}"


class LessonAttachment(models.Model):
    """Modelo para representar arquivos anexos de uma aula."""
    
    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE,
        related_name='attachments',
        verbose_name="Aula"
    )
    titulo = models.CharField(max_length=255, verbose_name="Título do Arquivo")
    arquivo = models.FileField(
        upload_to='courses/attachments/',
        verbose_name="Arquivo"
    )
    tipo_arquivo = models.CharField(
        max_length=50,
        blank=True,
        verbose_name="Tipo de Arquivo",
        help_text="Ex: PDF, DOC, etc."
    )
    tamanho_kb = models.PositiveIntegerField(
        default=0,
        verbose_name="Tamanho do Arquivo (KB)"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Data de Upload")
    
    class Meta:
        verbose_name = "Anexo da Aula"
        verbose_name_plural = "Anexos das Aulas"
        ordering = ['lesson', 'created_at']
    
    def __str__(self):
        return f"{self.lesson.titulo} - {self.titulo}"
