#!/usr/bin/env python
"""
Script para importar cursos de um arquivo JSON.

Uso:
    python import_courses.py cursos.json

O JSON deve ter o seguinte formato:
{
  "cursos": [
    {
      "titulo": "Título do Curso",
      "subtitulo": "Subtítulo do Curso",
      "categoria": "Categoria",
      "grau_dificuldade": "iniciante",
      "resumo": "Resumo do curso...",
      "imagem": "caminho/para/imagem.jpg",
      "secoes": [
        {
          "titulo": "Seção 1",
          "subtitulo": "Subtítulo da Seção",
          "descricao": "Descrição da seção",
          "descricao_subtitulo": "Descrição extra",
          "ordem": 1,
          "aulas": [
            {
              "titulo": "Aula 1",
              "subtitulo": "Subtítulo da Aula",
              "descricao": "Descrição da aula",
              "video": "caminho/para/video.mp4",
              "duracao_minutos": 15,
              "ordem": 1,
              "anexos": [
                {
                  "titulo": "Material Complementar",
                  "arquivo": "caminho/para/anexo.pdf"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
"""

import os
import sys
import json
import django
from pathlib import Path
from django.core.files import File
from django.core.files.base import ContentFile

# Configura o Django
# O script está em backend/scripts/, então subimos um nível para backend/
SCRIPT_DIR = Path(__file__).resolve().parent
BASE_DIR = SCRIPT_DIR.parent  # Vai para o diretório backend/
sys.path.append(str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'conhecimento_livre.settings')
django.setup()

from apps.courses.models import Course, Section, Lesson, LessonAttachment


def get_file_size_kb(file_path):
    """Retorna o tamanho do arquivo em KB."""
    try:
        return os.path.getsize(file_path) // 1024
    except:
        return 0


def get_file_extension(file_path):
    """Retorna a extensão do arquivo."""
    return os.path.splitext(file_path)[1][1:].upper()


def import_course(course_data, base_path):
    """
    Importa um curso completo com suas seções, aulas e anexos.
    
    Args:
        course_data: Dicionário com os dados do curso
        base_path: Caminho base para resolver caminhos relativos de arquivos
    
    Returns:
        Course: O curso criado
    """
    print(f"\n{'='*80}")
    print(f"📚 IMPORTANDO CURSO: {course_data['titulo']}")
    print(f"{'='*80}")
    
    # Cria o curso
    course = Course.objects.create(
        titulo=course_data['titulo'],
        subtitulo=course_data.get('subtitulo', ''),
        categoria=course_data.get('categoria', 'Geral'),
        grau_dificuldade=course_data.get('grau_dificuldade', 'iniciante'),
        resumo=course_data.get('resumo', ''),
        is_active=course_data.get('is_active', True)
    )
    
    # Adiciona imagem se fornecida
    if 'imagem' in course_data and course_data['imagem']:
        image_path = Path(base_path) / course_data['imagem']
        if image_path.exists():
            with open(image_path, 'rb') as img_file:
                course.imagem.save(
                    image_path.name,
                    File(img_file),
                    save=True
                )
            print(f"   ✅ Imagem do curso carregada: {image_path.name}")
        else:
            print(f"   ⚠️  Imagem não encontrada: {image_path}")
    
    print(f"   ✅ Curso criado: ID {course.id}")
    
    # Importa seções
    sections_data = course_data.get('secoes', [])
    for section_data in sections_data:
        import_section(course, section_data, base_path)
    
    print(f"\n✅ Curso '{course.titulo}' importado com sucesso!")
    print(f"   • {len(sections_data)} seção(ões)")
    total_lessons = sum(len(s.get('aulas', [])) for s in sections_data)
    print(f"   • {total_lessons} aula(s)")
    
    return course


def import_section(course, section_data, base_path):
    """
    Importa uma seção do curso.
    
    Args:
        course: Objeto Course
        section_data: Dicionário com os dados da seção
        base_path: Caminho base para resolver caminhos relativos
    
    Returns:
        Section: A seção criada
    """
    print(f"\n   📑 Seção: {section_data['titulo']}")
    
    section = Section.objects.create(
        course=course,
        titulo=section_data['titulo'],
        subtitulo=section_data.get('subtitulo', ''),
        descricao=section_data.get('descricao', ''),
        descricao_subtitulo=section_data.get('descricao_subtitulo', ''),
        ordem=section_data.get('ordem', 0)
    )
    
    print(f"      ✅ Seção criada: ID {section.id}")
    
    # Importa aulas
    lessons_data = section_data.get('aulas', [])
    for lesson_data in lessons_data:
        import_lesson(section, lesson_data, base_path)
    
    return section


def import_lesson(section, lesson_data, base_path):
    """
    Importa uma aula da seção.
    
    Args:
        section: Objeto Section
        lesson_data: Dicionário com os dados da aula
        base_path: Caminho base para resolver caminhos relativos
    
    Returns:
        Lesson: A aula criada
    """
    print(f"      🎥 Aula: {lesson_data['titulo']}")
    
    lesson = Lesson.objects.create(
        section=section,
        titulo=lesson_data['titulo'],
        subtitulo=lesson_data.get('subtitulo', ''),
        descricao=lesson_data.get('descricao', ''),
        duracao_minutos=lesson_data.get('duracao_minutos', 0),
        ordem=lesson_data.get('ordem', 0)
    )
    
    # Adiciona vídeo se fornecido
    if 'video' in lesson_data and lesson_data['video']:
        video_path = Path(base_path) / lesson_data['video']
        if video_path.exists():
            with open(video_path, 'rb') as video_file:
                lesson.video.save(
                    video_path.name,
                    File(video_file),
                    save=True
                )
            print(f"         ✅ Vídeo carregado: {video_path.name}")
        else:
            print(f"         ⚠️  Vídeo não encontrado: {video_path}")
    
    print(f"         ✅ Aula criada: ID {lesson.id}")
    
    # Importa anexos
    attachments_data = lesson_data.get('anexos', [])
    for attachment_data in attachments_data:
        import_attachment(lesson, attachment_data, base_path)
    
    return lesson


def import_attachment(lesson, attachment_data, base_path):
    """
    Importa um anexo da aula.
    
    Args:
        lesson: Objeto Lesson
        attachment_data: Dicionário com os dados do anexo
        base_path: Caminho base para resolver caminhos relativos
    
    Returns:
        LessonAttachment: O anexo criado
    """
    attachment_path = Path(base_path) / attachment_data['arquivo']
    
    if not attachment_path.exists():
        print(f"         ⚠️  Anexo não encontrado: {attachment_path}")
        return None
    
    with open(attachment_path, 'rb') as attach_file:
        attachment = LessonAttachment.objects.create(
            lesson=lesson,
            titulo=attachment_data.get('titulo', attachment_path.name),
            tipo_arquivo=get_file_extension(str(attachment_path)),
            tamanho_kb=get_file_size_kb(str(attachment_path))
        )
        
        attachment.arquivo.save(
            attachment_path.name,
            File(attach_file),
            save=True
        )
    
    print(f"         📎 Anexo adicionado: {attachment.titulo} ({attachment.tipo_arquivo})")
    
    return attachment


def validate_json_structure(data):
    """Valida a estrutura básica do JSON."""
    if 'cursos' not in data:
        raise ValueError("JSON deve conter a chave 'cursos'")
    
    if not isinstance(data['cursos'], list):
        raise ValueError("'cursos' deve ser uma lista")
    
    for i, curso in enumerate(data['cursos']):
        if 'titulo' not in curso:
            raise ValueError(f"Curso {i+1} deve ter um 'titulo'")


def main():
    """Função principal."""
    if len(sys.argv) < 2:
        print("❌ Erro: Forneça o caminho para o arquivo JSON")
        print("\nUso: python import_courses.py <arquivo.json>")
        print("\nExemplo: python import_courses.py cursos.json")
        sys.exit(1)
    
    json_file = sys.argv[1]
    json_path = Path(json_file)
    
    if not json_path.exists():
        print(f"❌ Erro: Arquivo não encontrado: {json_file}")
        sys.exit(1)
    
    # O caminho base é o diretório onde está o JSON
    base_path = json_path.parent
    
    print("\n")
    print("╔" + "="*78 + "╗")
    print("║" + " "*78 + "║")
    print("║" + "  IMPORTADOR DE CURSOS - educaTodos".center(78) + "║")
    print("║" + " "*78 + "║")
    print("╚" + "="*78 + "╝")
    
    try:
        # Lê o arquivo JSON
        print(f"\n📂 Lendo arquivo: {json_file}")
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Valida estrutura
        validate_json_structure(data)
        
        cursos = data['cursos']
        print(f"✅ {len(cursos)} curso(s) encontrado(s) no JSON")
        
        # Pergunta confirmação
        resposta = input(f"\n❓ Deseja importar {len(cursos)} curso(s)? (s/n): ").strip().lower()
        if resposta not in ['s', 'sim', 'y', 'yes']:
            print("⚠️  Importação cancelada.")
            sys.exit(0)
        
        # Importa cada curso
        imported_courses = []
        for curso_data in cursos:
            course = import_course(curso_data, base_path)
            imported_courses.append(course)
        
        # Resumo final
        print("\n" + "="*80)
        print("🎉 IMPORTAÇÃO CONCLUÍDA!")
        print("="*80)
        print(f"\n📊 RESUMO:")
        print(f"   • {len(imported_courses)} curso(s) importado(s)")
        
        for course in imported_courses:
            sections_count = course.sections.count()
            lessons_count = sum(section.lessons.count() for section in course.sections.all())
            attachments_count = sum(
                lesson.attachments.count() 
                for section in course.sections.all() 
                for lesson in section.lessons.all()
            )
            
            print(f"\n   📚 {course.titulo}")
            print(f"      • {sections_count} seção(ões)")
            print(f"      • {lessons_count} aula(s)")
            print(f"      • {attachments_count} anexo(s)")
        
        print("\n✅ Todos os cursos foram importados com sucesso!\n")
        
    except json.JSONDecodeError as e:
        print(f"\n❌ Erro ao ler JSON: {e}")
        sys.exit(1)
    except ValueError as e:
        print(f"\n❌ Erro de validação: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Erro inesperado: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()
