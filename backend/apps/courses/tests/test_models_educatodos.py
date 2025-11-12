# courses/tests/test_models_educatodos.py
import re
from django.test import TestCase
from django.contrib.auth.models import User
from django.db.utils import IntegrityError
from django.core.exceptions import ValidationError

from apps.courses.models import (
    Course, Section, Lesson, LessonAttachment,
    LessonProgress, CourseCompletion
)

class CourseModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.course = Course.objects.create(
            titulo="Alfabetização de Jovens e Adultos",
            subtitulo="Leitura inicial",
            categoria="Língua Portuguesa",
            resumo="Curso introdutório",
            # grau_dificuldade usa default 'iniciante'
        )

    def test_str_retorna_titulo(self):
        self.assertEqual(str(self.course), "Alfabetização de Jovens e Adultos")

    def test_is_active_default_true(self):
        self.assertTrue(self.course.is_active)

    def test_grau_dificuldade_default(self):
        self.assertEqual(self.course.grau_dificuldade, "iniciante")

    def test_grau_dificuldade_invalido_em_full_clean(self):
        c = Course(
            titulo="Matemática",
            subtitulo="Básico",
            categoria="Matemática",
            resumo="Desc.",
            grau_dificuldade="qualquercoisa",  # inválido
        )
        with self.assertRaises(ValidationError):
            c.full_clean()  # valida choices

    def test_ordering_por_created_at_desc(self):
        c2 = Course.objects.create(
            titulo="Curso 2", subtitulo="", categoria="X", resumo="Y"
        )
        qs = list(Course.objects.all())
        self.assertEqual(qs[0], c2)  # mais novo primeiro


class SectionModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.course = Course.objects.create(
            titulo="História I", subtitulo="", categoria="História", resumo="..."
        )

    def test_unique_together_course_ordem(self):
        Section.objects.create(
            course=self.course, titulo="Seção 1", subtitulo="",
            descricao="...", descricao_subtitulo="", ordem=1
        )
        with self.assertRaises(IntegrityError):
            Section.objects.create(
                course=self.course, titulo="Outra com mesma ordem", subtitulo="",
                descricao="...", descricao_subtitulo="", ordem=1
            )

    def test_str_legivel(self):
        s = Section.objects.create(
            course=self.course, titulo="Introdução", subtitulo="",
            descricao="...", descricao_subtitulo="", ordem=0
        )
        self.assertEqual(str(s), "História I - Introdução")


class LessonModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.course = Course.objects.create(
            titulo="Português I", subtitulo="", categoria="LP", resumo="..."
        )
        cls.section = Section.objects.create(
            course=cls.course, titulo="Seção A", subtitulo="",
            descricao="...", descricao_subtitulo="", ordem=0
        )

    def test_unique_together_section_ordem(self):
        Lesson.objects.create(
            section=self.section, titulo="Aula 1", subtitulo="",
            descricao="...", duracao_minutos=10, ordem=1
        )
        with self.assertRaises(IntegrityError):
            Lesson.objects.create(
                section=self.section, titulo="Aula 1 duplicada", subtitulo="",
                descricao="...", duracao_minutos=8, ordem=1
            )

    def test_defaults_ordem_e_duracao(self):
        l = Lesson.objects.create(
            section=self.section, titulo="Aula X", subtitulo="", descricao="..."
        )
        self.assertEqual(l.ordem, 0)
        self.assertEqual(l.duracao_minutos, 0)

    def test_str_legivel(self):
        l = Lesson.objects.create(
            section=self.section, titulo="Aula 2", subtitulo="", descricao="..."
        )
        self.assertEqual(str(l), "Português I - Seção A - Aula 2")


class LessonAttachmentModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        course = Course.objects.create(
            titulo="Matemática", subtitulo="", categoria="Exatas", resumo="..."
        )
        section = Section.objects.create(
            course=course, titulo="Frações", subtitulo="", descricao="...", descricao_subtitulo="", ordem=0
        )
        cls.lesson = Lesson.objects.create(
            section=section, titulo="Aula 1", subtitulo="", descricao="..."
        )

    def test_str_legivel(self):
        a = LessonAttachment.objects.create(
            lesson=self.lesson, titulo="PDF de apoio", arquivo="courses/attachments/a.pdf"
        )
        self.assertEqual(str(a), "Aula 1 - PDF de apoio")


class LessonProgressRulesTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(username="ana", password="123")
        course = Course.objects.create(
            titulo="Geografia", subtitulo="", categoria="Humanas", resumo="..."
        )
        section = Section.objects.create(
            course=course, titulo="Cartografia", subtitulo="", descricao="...", descricao_subtitulo="", ordem=0
        )
        cls.lesson = Lesson.objects.create(
            section=section, titulo="Mapas", subtitulo="", descricao="..."
        )

    def test_unique_user_lesson(self):
        LessonProgress.objects.create(user=self.user, lesson=self.lesson)
        with self.assertRaises(IntegrityError):
            LessonProgress.objects.create(user=self.user, lesson=self.lesson)

    def test_defaults_progress(self):
        lp = LessonProgress.objects.create(user=self.user, lesson=self.lesson)
        self.assertFalse(lp.completed)
        self.assertEqual(lp.current_time, 0)


class CourseCompletionRulesTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(username="joao", password="123")
        cls.course = Course.objects.create(
            titulo="Biologia", subtitulo="", categoria="Ciências", resumo="..."
        )

    def test_unique_user_course(self):
        CourseCompletion.objects.create(user=self.user, course=self.course)
        with self.assertRaises(IntegrityError):
            CourseCompletion.objects.create(user=self.user, course=self.course)

    def test_codigo_certificado_auto_gerado_formato(self):
        cc = CourseCompletion.objects.create(user=self.user, course=self.course)
        self.assertTrue(cc.certificate_code.startswith("CERT-"))
        self.assertTrue(re.fullmatch(r"CERT-[A-Z0-9]{12}", cc.certificate_code) is not None)

    def test_codigo_pode_ser_fornecido_sem_ser_sobrescrito(self):
        cc = CourseCompletion.objects.create(
            user=self.user, course=self.course, certificate_code="CERT-CUSTOM-0001"
        )
        self.assertEqual(cc.certificate_code, "CERT-CUSTOM-0001")
