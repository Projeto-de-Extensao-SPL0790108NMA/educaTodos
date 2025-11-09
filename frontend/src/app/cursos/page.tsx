"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  Tabs,
  Tab,
} from "@mui/material";
import { PlayCircle as PlayIcon } from "@mui/icons-material";
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
}

interface CoursesByCategory {
  [categoria: string]: Course[];
}

export default function CursosPage() {
  const router = useRouter();
  const [cursos, setCursos] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState(0);

  useEffect(() => {
    fetchCursos();
  }, []);

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

  // Agrupar cursos por categoria
  const cursosPorCategoria = cursos.reduce<CoursesByCategory>((acc, curso) => {
    if (!acc[curso.categoria]) {
      acc[curso.categoria] = [];
    }
    acc[curso.categoria].push(curso);
    return acc;
  }, {});

  const categorias = ["Todos", ...Object.keys(cursosPorCategoria).sort()];

  const cursosFiltrados =
    categoriaAtiva === 0
      ? cursos
      : cursosPorCategoria[categorias[categoriaAtiva]] || [];

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
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontFamily: "Poppins",
            fontWeight: 700,
            color: "#FFFFFF",
            mb: 1,
          }}
        >
          Todos os Cursos
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#B0B0B0",
          }}
        >
          Explore nossa biblioteca completa de cursos
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Tabs de Categorias */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "rgba(255, 255, 255, 0.1)",
          mb: 4,
        }}
      >
        <Tabs
          value={categoriaAtiva}
          onChange={(e, newValue) => setCategoriaAtiva(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 500,
              color: "#B0B0B0",
              "&.Mui-selected": {
                color: "#2C5F2D",
              },
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#2C5F2D",
            },
          }}
        >
          {categorias.map((categoria, index) => (
            <Tab
              key={categoria}
              label={`${categoria} ${
                index === 0
                  ? `(${cursos.length})`
                  : `(${cursosPorCategoria[categoria]?.length || 0})`
              }`}
            />
          ))}
        </Tabs>
      </Box>

      {/* Grid de Cursos */}
      {cursosFiltrados.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            backgroundColor: "#2A2A2A",
            borderRadius: 2,
          }}
        >
          <Typography
            sx={{
              fontFamily: "Poppins",
              fontSize: "16px",
              color: "#B0B0B0",
            }}
          >
            Nenhum curso disponível nesta categoria.
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 3,
          }}
        >
          {cursosFiltrados.map((curso) => (
            <Card
              key={curso.id}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
                backgroundColor: "#2A2A2A",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0px 8px 24px rgba(44, 95, 45, 0.3)",
                  "& .play-overlay": {
                    opacity: 1,
                  },
                },
              }}
              onClick={() => router.push(`/cursos/${curso.id}`)}
            >
              {/* Imagem do Curso */}
              <Box sx={{ position: "relative" }}>
                {curso.imagem ? (
                  <>
                    <CardMedia
                      component="img"
                      height="180"
                      image={
                        curso.imagem.startsWith("http")
                          ? curso.imagem
                          : `${API_URL}${curso.imagem}`
                      }
                      alt={curso.titulo}
                      sx={{
                        objectFit: "cover",
                        backgroundColor: "#3A3A3A",
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
                  </>
                ) : (
                  <Box
                    sx={{
                      position: "relative",
                      height: 180,
                      backgroundColor: "#3A3A3A",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "Poppins",
                        fontSize: "20px",
                        fontWeight: 700,
                        color: "#666666",
                        position: "relative",
                        zIndex: 1,
                      }}
                    >
                      EM BREVE
                    </Typography>
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
                        zIndex: 2,
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
                  </Box>
                )}
              </Box>

              <CardContent sx={{ flexGrow: 1, p: 2 }}>
                {/* Categoria */}
                <Chip
                  label={curso.categoria}
                  size="small"
                  sx={{
                    mb: 1.5,
                    backgroundColor: "rgba(44, 95, 45, 0.2)",
                    color: "#2C5F2D",
                    fontWeight: 600,
                    border: "1px solid rgba(44, 95, 45, 0.3)",
                    fontSize: "0.7rem",
                  }}
                />

                {/* Título do Curso */}
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: "Poppins",
                    fontWeight: 600,
                    color: "#FFFFFF",
                    mb: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    minHeight: "3em",
                  }}
                >
                  {curso.titulo}
                </Typography>

                {/* Subtítulo */}
                {curso.subtitulo && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#B0B0B0",
                      display: "block",
                      mb: 1.5,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {curso.subtitulo}
                  </Typography>
                )}

                {/* Chip de Dificuldade */}
                <Chip
                  label={getDificuldadeLabel(curso.grau_dificuldade)}
                  size="small"
                  sx={{
                    backgroundColor: getDificuldadeColor(curso.grau_dificuldade),
                    color: "#FFFFFF",
                    fontFamily: "Poppins",
                    fontWeight: 600,
                    fontSize: "0.7rem",
                  }}
                />
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
}
