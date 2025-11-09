'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  Alert,
  Chip,
  LinearProgress,
  Tabs,
  Tab,
} from '@mui/material';
import {
  PlayCircle as PlayIcon,
  CheckCircle as CheckCircleIcon,
  EmojiEvents as TrophyIcon,
} from '@mui/icons-material';
import { apiFetch } from '@/services/apiClient';

interface Course {
  id: number;
  titulo: string;
  subtitulo?: string;
  imagem: string | null;
  categoria: string;
  grau_dificuldade: string;
  total_sections?: number;
  total_lessons?: number;
}

interface LessonProgress {
  id: number;
  lesson: number;
  current_time: number;
  completed: boolean;
  last_watched: string;
}

interface CourseCompletion {
  id: number;
  course: number;
  course_title: string;
  completed_at: string;
  certificate_code: string;
  total_hours: number;
}

interface CourseWithProgress extends Course {
  progress: number;
  completedLessons: number;
  totalLessons: number;
  isCompleted: boolean;
  certificateCode?: string;
  completedAt?: string;
}

export default function CursandoPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0); // 0 = Em Progresso, 1 = Concluídos

  useEffect(() => {
    fetchCoursesWithProgress();
  }, []);

  const fetchCoursesWithProgress = async () => {
    try {
      setLoading(true);

      // Busca todos os cursos
      const coursesData = await apiFetch<Course[]>('/api/courses/courses/');
      
      // Busca progresso de todas as aulas
      const progressData = await apiFetch<LessonProgress[]>('/api/courses/progress/');
      
      // Busca certificados (cursos concluídos)
      const completionsData = await apiFetch<CourseCompletion[]>('/api/courses/completions/');

      // Para cada curso concluído, buscar detalhes completos para ter total_lessons
      const completedCourseIds = completionsData.map(c => c.course);
      const courseDetailsPromises = completedCourseIds.map(id => 
        apiFetch<Course>(`/api/courses/courses/${id}/`)
      );
      const courseDetails = await Promise.all(courseDetailsPromises);

      // Criar mapa de IDs de cursos para total de aulas
      const courseTotalsMap = new Map<number, number>();
      courseDetails.forEach(course => {
        if (course.total_lessons) {
          courseTotalsMap.set(course.id, course.total_lessons);
        }
      });

      // Agrupa progresso por curso (usando lesson IDs)
      // Precisamos buscar qual curso cada aula pertence
      const lessonToCourseMap = new Map<number, number>();
      
      // Para cursos com progresso, busca detalhes para mapear lessons
      const coursesWithProgressIds = new Set(progressData.map(p => {
        // Vamos inferir o curso através dos detalhes
        return p.lesson;
      }));

      // Mapeia cursos com progresso
      const coursesWithProgress: CourseWithProgress[] = [];

      // Adiciona cursos concluídos
      for (const completion of completionsData) {
        const course = coursesData.find(c => c.id === completion.course);
        if (course) {
          const totalLessons = courseTotalsMap.get(course.id) || course.total_lessons || 0;
          
          coursesWithProgress.push({
            ...course,
            progress: 100,
            completedLessons: totalLessons,
            totalLessons: totalLessons,
            isCompleted: true,
            certificateCode: completion.certificate_code,
            completedAt: completion.completed_at,
          });
        }
      }

      // Para cursos em progresso (não concluídos), precisamos buscar detalhes individuais
      // Vamos usar uma abordagem diferente: buscar todos os detalhes dos cursos que têm progresso
      if (progressData.length > 0) {
        // Busca detalhes de todos os cursos
        const allCourseDetailsPromises = coursesData.map(course => 
          apiFetch<any>(`/api/courses/courses/${course.id}/`).catch(() => null)
        );
        const allCourseDetails = await Promise.all(allCourseDetailsPromises);

        for (const courseDetail of allCourseDetails) {
          if (!courseDetail || !courseDetail.sections) continue;
          
          // Verifica se já foi adicionado como concluído
          if (coursesWithProgress.some(c => c.id === courseDetail.id)) continue;

          // Calcula total de aulas do curso
          const totalLessons = courseDetail.sections.reduce(
            (sum: number, section: any) => sum + (section.lessons?.length || 0),
            0
          );

          if (totalLessons === 0) continue;

          // Busca IDs de todas as aulas do curso
          const courseLessonIds = courseDetail.sections.flatMap((section: any) =>
            section.lessons?.map((lesson: any) => lesson.id) || []
          );

          // Filtra progresso apenas das aulas deste curso
          const courseProgress = progressData.filter((progress) =>
            courseLessonIds.includes(progress.lesson)
          );

          if (courseProgress.length === 0) continue; // Pula cursos sem progresso

          // Conta aulas concluídas
          const completedLessons = courseProgress.filter((p) => p.completed).length;

          // Calcula progresso percentual
          const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

          const baseCourse = coursesData.find(c => c.id === courseDetail.id);
          if (baseCourse) {
            coursesWithProgress.push({
              ...baseCourse,
              progress: Math.round(progress),
              completedLessons,
              totalLessons,
              isCompleted: false,
            });
          }
        }
      }

      setCourses(coursesWithProgress);
      setError(null);
    } catch (err: any) {
      console.error('Erro ao buscar cursos:', err);
      setError(
        err.message || 'Erro ao carregar cursos. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleContinueCourse = async (courseId: number) => {
    try {
      // Busca a última aula assistida
      const lastLesson = await apiFetch<{ lesson_id: number }>(`/api/courses/progress/last-watched-lesson/${courseId}/`);
      
      if (lastLesson.lesson_id) {
        router.push(`/cursos/${courseId}/assistir?aula=${lastLesson.lesson_id}`);
      } else {
        // Fallback caso não encontre
        router.push(`/cursos/${courseId}/assistir`);
      }
    } catch (error) {
      console.error('Erro ao buscar última aula:', error);
      // Em caso de erro, vai para a página sem especificar aula (primeira aula)
      router.push(`/cursos/${courseId}/assistir`);
    }
  };

  const handleViewCertificate = (certificateCode: string) => {
    router.push(`/certificado/${certificateCode}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const getDificuldadeColor = (dificuldade: string) => {
    switch (dificuldade) {
      case "iniciante":
        return "#2C5F2D";
      case "intermediario":
        return "#FFA500";
      case "avancado":
        return "#6B1515";
      default:
        return "#1F1D2B";
    }
  };

  const getDificuldadeLabel = (dificuldade: string) => {
    switch (dificuldade) {
      case "iniciante":
        return "Iniciante";
      case "intermediario":
        return "Intermediário";
      case "avancado":
        return "Avançado";
      default:
        return dificuldade;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Iniciante':
        return 'success';
      case 'Intermediário':
        return 'warning';
      case 'Avançado':
        return 'error';
      default:
        return 'default';
    }
  };

  // Filtra cursos por aba
  const inProgressCourses = courses.filter((c) => !c.isCompleted);
  const completedCourses = courses.filter((c) => c.isCompleted);

  const currentCourses = tabValue === 0 ? inProgressCourses : completedCourses;

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Meus Cursos
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Acompanhe seu progresso e retome seus estudos
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
            },
          }}
        >
          <Tab
            label={`Em Progresso (${inProgressCourses.length})`}
            icon={<PlayIcon />}
            iconPosition="start"
          />
          <Tab
            label={`Concluídos (${completedCourses.length})`}
            icon={<CheckCircleIcon />}
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Empty State */}
      {currentCourses.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 6,
            backgroundColor: '#f5f5f5',
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {tabValue === 0
              ? 'Você não possui cursos em progresso'
              : 'Você ainda não concluiu nenhum curso'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {tabValue === 0
              ? 'Explore nossos cursos e comece a aprender agora'
              : 'Continue estudando para conquistar seu primeiro certificado'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push('/cursos')}
            sx={{
              backgroundColor: '#2C5F2D',
              '&:hover': { backgroundColor: '#1e4620' },
            }}
          >
            Explorar Cursos
          </Button>
        </Box>
      )}

      {/* Courses List */}
      {currentCourses.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {currentCourses.map((course) => (
            <Card
              key={course.id}
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4,
                },
              }}
            >
              {/* Course Image */}
              <CardMedia
                component="img"
                sx={{
                  width: { xs: '100%', md: 240, lg: 320 },
                  height: { xs: 180, md: 'auto', lg:240},
                  objectFit: 'cover',
                }}
                image={course.imagem || '/placeholder-course.png'}
                alt={course.titulo}
              />

              <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, bgcolor: '#FFFFFF', color: '#000000' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                  {/* Badges */}
                  <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
                    {course.isCompleted && (
                      <Chip
                        icon={<TrophyIcon />}
                        label="Concluído"
                        color="success"
                        size="small"
                      />
                    )}
                    <Chip
                      label={course.categoria}
                      size="small"
                      sx={{
                        backgroundColor: '#E8F5E9',
                        color: '#2C5F2D',
                        fontWeight: 600,
                        fontFamily: 'Poppins',
                        border: '1px solid #2C5F2D',
                      }}
                    />
                    <Chip
                      label={getDificuldadeLabel(course.grau_dificuldade)}
                      size="small"
                      sx={{
                        backgroundColor: getDificuldadeColor(course.grau_dificuldade),
                        color: '#FFFFFF',
                        fontWeight: 600,
                        fontFamily: 'Poppins',
                      }}
                    />
                  </Box>

                  {/* Course Title */}
                  <Typography variant="h6" component="div" fontWeight="bold" gutterBottom>
                    {course.titulo}
                  </Typography>

                  {/* Description */}
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {course.subtitulo || 'Curso disponível para você aprender'}
                  </Typography>

                  {/* Progress Bar (apenas para cursos em progresso) */}
                  {!course.isCompleted && (
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" >
                          Progresso
                        </Typography>
                        <Typography variant="caption"  fontWeight="bold">
                          {course.completedLessons}/{course.totalLessons} aulas ({course.progress}%)
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={course.progress}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#2C5F2D',
                          },
                        }}
                      />
                    </Box>
                  )}

                  {/* Completion Date (para cursos concluídos) */}
                  {course.isCompleted && course.completedAt && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                      Concluído em {formatDate(course.completedAt)}
                    </Typography>
                  )}

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {!course.isCompleted && (
                      <Button
                        variant="contained"
                        startIcon={<PlayIcon />}
                        onClick={() => handleContinueCourse(course.id)}
                        sx={{
                          backgroundColor: '#2C5F2D',
                          '&:hover': { backgroundColor: '#1e4620' },
                        }}
                      >
                        {course.progress > 0 ? 'Continuar' : 'Começar'}
                      </Button>
                    )}
                    {course.isCompleted && course.certificateCode && (
                      <Button
                        variant="contained"
                        startIcon={<TrophyIcon />}
                        onClick={() => handleViewCertificate(course.certificateCode!)}
                        sx={{
                          backgroundColor: '#2C5F2D',
                          '&:hover': { backgroundColor: '#1e4620' },
                        }}
                      >
                        Ver Certificado
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      onClick={() => router.push(`/cursos/${course.id}`)}
                      sx={{
                        borderColor: '#2C5F2D',
                        color: '#2C5F2D',
                        '&:hover': {
                          borderColor: '#1e4620',
                          backgroundColor: 'rgba(44, 95, 45, 0.08)',
                        },
                      }}
                    >
                      Ver Detalhes
                    </Button>
                  </Box>
                </CardContent>
              </Box>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
}
