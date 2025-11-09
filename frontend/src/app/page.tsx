"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Button,
  LinearProgress,
  Paper,
} from "@mui/material";
import {
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  EmojiEvents as TrophyIcon,
  PlayCircle as PlayIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { apiFetch } from "@/services/apiClient";
import { API_URL } from "@/services/api";

interface Course {
  id: number;
  titulo: string;
  subtitulo?: string;
  categoria: string;
  grau_dificuldade: string;
  imagem: string | null;
  is_active: boolean;
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
}

interface CoursesByCategory {
  [categoria: string]: Course[];
}

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const [cursos, setCursos] = useState<Course[]>([]);
  const [cursosEmProgresso, setCursosEmProgresso] = useState<CourseWithProgress[]>([]);
  const [totalCertificados, setTotalCertificados] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      if (user.is_staff) {
        router.replace("/visao-geral");
      } else {
        fetchDashboardData();
      }
    } else {
      fetchCursos();
    }
  }, [user, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Busca cursos disponíveis
      const cursosData = await apiFetch<Course[]>("/api/courses/courses/");
      const cursosAtivos = cursosData.filter((curso) => curso.is_active);
      setCursos(cursosAtivos);

      // Busca progresso do usuário
      const progressData = await apiFetch<LessonProgress[]>('/api/courses/progress/');
      
      // Busca certificados
      const completionsData = await apiFetch<CourseCompletion[]>('/api/courses/completions/');
      setTotalCertificados(completionsData.length);

      // Calcula cursos em progresso
      if (progressData.length > 0) {
        const allCourseDetailsPromises = cursosAtivos.map(course => 
          apiFetch<any>(`/api/courses/courses/${course.id}/`).catch(() => null)
        );
        const allCourseDetails = await Promise.all(allCourseDetailsPromises);

        const cursosComProgresso: CourseWithProgress[] = [];

        for (const courseDetail of allCourseDetails) {
          if (!courseDetail || !courseDetail.sections) continue;
          
          // Verifica se já foi concluído
          if (completionsData.some(c => c.course === courseDetail.id)) continue;

          const totalLessons = courseDetail.sections.reduce(
            (sum: number, section: any) => sum + (section.lessons?.length || 0),
            0
          );

          if (totalLessons === 0) continue;

          const courseLessonIds = courseDetail.sections.flatMap((section: any) =>
            section.lessons?.map((lesson: any) => lesson.id) || []
          );

          const courseProgress = progressData.filter((progress) =>
            courseLessonIds.includes(progress.lesson)
          );

          if (courseProgress.length === 0) continue;

          const completedLessons = courseProgress.filter((p) => p.completed).length;
          const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

          const baseCourse = cursosAtivos.find(c => c.id === courseDetail.id);
          if (baseCourse) {
            cursosComProgresso.push({
              ...baseCourse,
              progress: Math.round(progress),
              completedLessons,
              totalLessons,
            });
          }
        }

        // Ordena por progresso (mais recentes primeiro)
        cursosComProgresso.sort((a, b) => b.progress - a.progress);
        setCursosEmProgresso(cursosComProgresso.slice(0, 3)); // Top 3
      }
    } catch (err: any) {
      setError(err.message || "Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const fetchCursos = async () => {
    try {
      setLoading(true);
      const data = await apiFetch<Course[]>("/api/courses/courses/");
      const cursosAtivos = data.filter((curso) => curso.is_active);
      setCursos(cursosAtivos);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar cursos");
    } finally {
      setLoading(false);
    }
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

  // Função para obter cursos em destaque (aleatórios por 24h)
  const getCursosEmDestaque = () => {
    const today = new Date().toDateString(); // Data atual como string
    const storageKey = 'cursosEmDestaque';
    const storageDateKey = 'cursosEmDestaqueDate';
    
    // Verifica se já existem cursos salvos para hoje
    const savedDate = localStorage.getItem(storageDateKey);
    const savedCursos = localStorage.getItem(storageKey);
    
    if (savedDate === today && savedCursos) {
      try {
        const cursoIds = JSON.parse(savedCursos);
        const cursosDestaque = cursoIds
          .map((id: number) => cursos.find(c => c.id === id))
          .filter((c: Course | undefined) => c !== undefined);
        
        if (cursosDestaque.length === 6) {
          return cursosDestaque as Course[];
        }
      } catch (e) {
        // Se houver erro ao parsear, gera novos cursos
      }
    }
    
    // Gera novos cursos aleatórios
    const cursosAleatorios = [...cursos]
      .sort(() => Math.random() - 0.5)
      .slice(0, 6);
    
    // Salva no localStorage
    const cursoIds = cursosAleatorios.map(c => c.id);
    localStorage.setItem(storageKey, JSON.stringify(cursoIds));
    localStorage.setItem(storageDateKey, today);
    
    return cursosAleatorios;
  };

  const cursosEmDestaque = cursos.length > 0 ? getCursosEmDestaque() : [];

  if (loading) {
    return (
      <Container>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <CircularProgress sx={{ color: "#2C5F2D" }} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontFamily: "Poppins",
            fontWeight: 600,
            color: "#FFFFFF",
            mb: 1,
          }}
        >
          Olá{user && `, ${user.full_name}`}! 👋
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontFamily: "Poppins",
            fontWeight: 400,
            color: "#B0B0B0",
          }}
        >
          Continue sua jornada de aprendizado
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Estatísticas - Apenas para usuários logados */}
      {user && !user.is_staff && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
            gap: 2,
            mb: 5,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              backgroundColor: "rgba(44, 95, 45, 0.15)",
              borderRadius: 2,
              border: "1px solid rgba(44, 95, 45, 0.3)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "12px",
                  backgroundColor: "rgba(44, 95, 45, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 2,
                }}
              >
                <SchoolIcon sx={{ fontSize: 24, color: "#2C5F2D" }} />
              </Box>
              <Box>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: "#2C5F2D" }}
                >
                  {cursosEmProgresso.length}
                </Typography>
                <Typography variant="caption" sx={{ color: "#B0B0B0" }}>
                  Em Progresso
                </Typography>
              </Box>
            </Box>
          </Paper>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              backgroundColor: "rgba(255, 165, 0, 0.15)",
              borderRadius: 2,
              border: "1px solid rgba(255, 165, 0, 0.3)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "12px",
                  backgroundColor: "rgba(255, 165, 0, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 2,
                }}
              >
                <TrendingUpIcon sx={{ fontSize: 24, color: "#FFA500" }} />
              </Box>
              <Box>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: "#FFA500" }}
                >
                  {cursos.length}
                </Typography>
                <Typography variant="caption" sx={{ color: "#B0B0B0" }}>
                  Disponíveis
                </Typography>
              </Box>
            </Box>
          </Paper>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              backgroundColor: "rgba(107, 21, 21, 0.15)",
              borderRadius: 2,
              border: "1px solid rgba(107, 21, 21, 0.3)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "12px",
                  backgroundColor: "rgba(107, 21, 21, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 2,
                }}
              >
                <TrophyIcon sx={{ fontSize: 24, color: "#D32F2F" }} />
              </Box>
              <Box>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: "#D32F2F" }}
                >
                  {totalCertificados}
                </Typography>
                <Typography variant="caption" sx={{ color: "#B0B0B0" }}>
                  Certificados
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      )}

      {/* Cursos em Progresso - Apenas para usuários logados */}
      {user && !user.is_staff && (
        <Box sx={{ mb: 5 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2.5,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontFamily: "Poppins",
                fontWeight: 600,
                color: "#FFFFFF",
              }}
            >
              {cursosEmProgresso.length > 0 ? "Continue Aprendendo" : "Comece Sua Jornada"}
            </Typography>

            <Button
              endIcon={<ArrowForwardIcon />}
              onClick={() => router.push("/cursos")}
              sx={{
                color: "#2C5F2D",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.875rem",
              }}
            >
              Ver Cursos
            </Button>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(3, 1fr)',
              },
              gap: 2,
            }}
          >
            {cursosEmProgresso.length > 0 && cursosEmProgresso.slice(0, 1).map((curso) => (
              <Card
                key={curso.id}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                  backgroundColor: "#2A2A2A",
                  borderRadius: 3,
                  overflow: "hidden",
                  position: "relative",
                  border: "1px solid rgba(44, 95, 45, 0.2)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0px 12px 32px rgba(44, 95, 45, 0.4)",
                    border: "1px solid rgba(44, 95, 45, 0.6)",
                    "& .play-overlay": {
                      opacity: 1,
                    },
                  },
                }}
                onClick={() => router.push(`/cursos/${curso.id}`)}
              >
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    height="160"
                    image={
                      curso.imagem
                        ? curso.imagem.startsWith("http")
                          ? curso.imagem
                          : `${API_URL}${curso.imagem}`
                        : "/placeholder-course.png"
                    }
                    alt={curso.titulo}
                    sx={{
                      objectFit: "cover",
                      filter: "brightness(0.9)",
                    }}
                  />
                  {/* Overlay com ícone de play */}
                  <Box
                    className="play-overlay"
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: 0,
                      transition: "opacity 0.3s ease",
                    }}
                  >
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: "50%",
                        backgroundColor: "rgba(44, 95, 45, 0.9)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <PlayIcon sx={{ fontSize: 32, color: "#FFFFFF" }} />
                    </Box>
                  </Box>
                  {/* Badge "Continuar" no canto esquerdo */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      backgroundColor: "rgba(44, 95, 45, 0.9)",
                      backdropFilter: "blur(8px)",
                      borderRadius: 2,
                      px: 1.5,
                      py: 0.5,
                      zIndex: 1,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#FFFFFF",
                        fontWeight: 700,
                        fontSize: "14px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      CONTINUAR
                    </Typography>
                  </Box>
                  {/* Badge de progresso no canto direito */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      backgroundColor: "rgba(0, 0, 0, 0.75)",
                      backdropFilter: "blur(8px)",
                      borderRadius: 2,
                      px: 1.5,
                      py: 0.5,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#2C5F2D",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                      }}
                    >
                      {curso.progress}%
                    </Typography>
                  </Box>
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                  <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
                    <Chip
                      label={curso.categoria}
                      size="small"
                      sx={{
                        backgroundColor: "rgba(44, 95, 45, 0.2)",
                        color: "#2C5F2D",
                        fontWeight: 700,
                        border: "1px solid rgba(44, 95, 45, 0.4)",
                        fontSize: "0.7rem",
                      }}
                    />
                    <Chip
                      label={getDificuldadeLabel(curso.grau_dificuldade)}
                      size="small"
                      sx={{
                        backgroundColor: getDificuldadeColor(curso.grau_dificuldade),
                        color: "#FFFFFF",
                        fontWeight: 700,
                        fontSize: "0.7rem",
                      }}
                    />
                  </Box>

                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: "Poppins",
                      fontWeight: 600,
                      color: "#FFFFFF",
                      mb: 2,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      minHeight: "2.8em",
                      fontSize: "1rem",
                      lineHeight: 1.4,
                    }}
                  >
                    {curso.titulo}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="caption" sx={{ color: "#B0B0B0", fontSize: "0.75rem" }}>
                        Progresso do Curso
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#2C5F2D", fontWeight: 700, fontSize: "0.75rem" }}>
                        {curso.completedLessons}/{curso.totalLessons} aulas
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={curso.progress}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "#3A3A3A",
                        "& .MuiLinearProgress-bar": {
                          background: "linear-gradient(90deg, #2C5F2D 0%, #3a7a3c 100%)",
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<PlayIcon />}
                    sx={{
                      background: "linear-gradient(135deg, #2C5F2D 0%, #3a7a3c 100%)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #1e4620 0%, #2C5F2D 100%)",
                        transform: "scale(1.02)",
                      },
                      textTransform: "none",
                      fontSize: "0.9rem",
                      fontWeight: 700,
                      py: 1,
                      borderRadius: 2,
                      boxShadow: "0 4px 12px rgba(44, 95, 45, 0.3)",
                      transition: "all 0.2s ease",
                    }}
                  >
                  Continuar Assistindo
                </Button>
              </CardContent>
            </Card>
            ))}

            {/* 2 ou 3 Cursos em Destaque dependendo se há cursos em progresso */}
            {cursosEmDestaque.slice(0, cursosEmProgresso.length > 0 ? 2 : 3).map((curso) => (
              <Card
                key={curso.id}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                  backgroundColor: "#252525",
                  borderRadius: 3,
                  position: "relative",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.5)",
                    border: "1px solid rgba(44, 95, 45, 0.3)",
                    backgroundColor: "#2A2A2A",
                    "& .course-image": {
                      transform: "scale(1.03)",
                    },
                    "& .play-overlay": {
                      opacity: 1,
                    },
                  },
                }}
                onClick={() => router.push(`/cursos/${curso.id}`)}
              >
                {/* Badge "Em Destaque" ou "Novo" */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    backgroundColor: cursosEmProgresso.length > 0 
                      ? "rgba(255, 165, 0, 0.9)" 
                      : "rgba(44, 95, 45, 0.9)",
                    backdropFilter: "blur(8px)",
                    borderRadius: 2,
                    px: 1.5,
                    py: 0.5,
                    zIndex: 1,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#FFFFFF",
                      fontWeight: 700,
                      fontSize: "14px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {cursosEmProgresso.length > 0 ? "⭐ Destaque" : "NOVO"}
                  </Typography>
                </Box>

                {/* Imagem do Curso */}
                <Box sx={{ position: "relative", overflow: "hidden", height: 160, borderRadius: "12px 12px 0 0" }}>
                  {curso.imagem ? (
                    <>
                      <CardMedia
                        component="img"
                        height="160"
                        image={
                          curso.imagem.startsWith("http")
                            ? curso.imagem
                            : `${API_URL}${curso.imagem}`
                        }
                        alt={curso.titulo}
                        className="course-image"
                        sx={{
                          objectFit: "cover",
                          backgroundColor: "#2A2A2A",
                          transition: "transform 0.35s ease",
                        }}
                        onError={(e) => {
                          const parent = (e.target as HTMLElement).parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div style="
                                height: 160px;
                                background: linear-gradient(135deg, #2A2A2A 0%, #1E1E1E 100%);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                              ">
                                <span style="
                                  font-family: Poppins;
                                  font-size: 16px;
                                  font-weight: 600;
                                  color: #4A4A4A;
                                  letter-spacing: 1px;
                                ">EM BREVE</span>
                              </div>
                            `;
                          }
                        }}
                      />
                      {/* Play Overlay */}
                      <Box
                        className="play-overlay"
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: "linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: 0,
                          transition: "opacity 0.3s ease",
                        }}
                      >
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: "50%",
                            backgroundColor: "rgba(44, 95, 45, 0.95)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 12px rgba(44, 95, 45, 0.4)",
                          }}
                        >
                          <PlayIcon sx={{ color: "#FFFFFF", fontSize: 28 }} />
                        </Box>
                      </Box>
                    </>
                  ) : (
                    <Box
                      sx={{
                        height: 160,
                        background: "linear-gradient(135deg, #2A2A2A 0%, #1E1E1E 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "Poppins",
                          fontSize: "16px",
                          fontWeight: 600,
                          color: "#4A4A4A",
                          letterSpacing: "1px",
                        }}
                      >
                        EM BREVE
                      </Typography>
                    </Box>
                  )}
                </Box>

                <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", p: 2.5 }}>
                  {/* Chip de Dificuldade */}
                  <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
                    <Chip
                      label={curso.categoria}
                      size="small"
                      sx={{
                        backgroundColor: "rgba(44, 95, 45, 0.2)",
                        color: "#2C5F2D",
                        fontWeight: 700,
                        border: "1px solid rgba(44, 95, 45, 0.4)",
                        fontSize: "0.7rem",
                      }}
                    />
                    <Chip
                      label={getDificuldadeLabel(curso.grau_dificuldade)}
                      size="small"
                      sx={{
                        backgroundColor: getDificuldadeColor(curso.grau_dificuldade),
                        color: "#FFFFFF",
                        fontWeight: 700,
                        fontSize: "0.7rem",
                      }}
                    />
                  </Box>

                  {/* Título */}
                  <Typography
                    sx={{
                      fontFamily: "Poppins",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      color: "#FFFFFF",
                      mb: 0.5,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      minHeight: "2.6em",
                      lineHeight: 1.3,
                    }}
                  >
                    {curso.titulo}
                  </Typography>

                  {/* Subtítulo */}
                  {curso.subtitulo && (
                    <Typography
                      sx={{
                        fontFamily: "Poppins",
                        fontSize: "0.75rem",
                        color: "#909090",
                        mb: 2,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        lineHeight: 1.3,
                      }}
                    >
                      {curso.subtitulo}
                    </Typography>
                  )}

                  {/* Botão Começar Curso */}
                  <Box sx={{ mt: "auto" }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<PlayIcon />}
                      sx={{
                        background: cursosEmProgresso.length > 0
                          ? "linear-gradient(135deg, #FFA500 0%, #ff8c00 100%)"
                          : "linear-gradient(135deg, #2C5F2D 0%, #3a7a3c 100%)",
                        "&:hover": {
                          background: cursosEmProgresso.length > 0
                            ? "linear-gradient(135deg, #ff8c00 0%, #ff7700 100%)"
                            : "linear-gradient(135deg, #1e4620 0%, #2C5F2D 100%)",
                          transform: "scale(1.02)",
                        },
                        textTransform: "none",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        py: 0.9,
                        borderRadius: 2,
                        boxShadow: cursosEmProgresso.length > 0
                          ? "0 4px 12px rgba(255, 165, 0, 0.3)"
                          : "0 4px 12px rgba(44, 95, 45, 0.3)",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {cursosEmProgresso.length > 0 ? "Começar Curso" : "Começar Agora"}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      )}


    </Container>
  );
}
