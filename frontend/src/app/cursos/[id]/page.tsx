"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Divider,
  Chip,
} from "@mui/material";
import Image from "next/image";
import { apiFetch } from "@/services/apiClient";
import { API_URL } from "@/services/api";

interface LessonAttachment {
  id: number;
  titulo: string;
  arquivo: string;
  tipo_arquivo: string;
  tamanho_kb: number;
}

interface Lesson {
  id: number;
  titulo: string;
  subtitulo: string;
  descricao: string;
  video: string | null;
  duracao_minutos: number;
  ordem: number;
  attachments: LessonAttachment[];
}

interface Section {
  id: number;
  titulo: string;
  ordem: number;
  lessons: Lesson[];
}

interface Course {
  id: number;
  titulo: string;
  subtitulo: string;
  resumo: string;
  categoria: string;
  grau_dificuldade: string;
  imagem: string | null;
  is_active: boolean;
  sections: Section[];
}

export default function CursoDetalhesPage() {
  const params = useParams();
  const router = useRouter();
  const [curso, setCurso] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (params.id) {
      fetchCurso();
    }
  }, [params.id]);

  const fetchCurso = async () => {
    try {
      setLoading(true);
      const data = await apiFetch<Course>(`/api/courses/courses/${params.id}/`);
      console.log("Curso carregado:", data);
      setCurso(data);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar curso");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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

  if (loading) {
    return (
      <Container>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={{ xs: "350px", lg: "350px" }}
          maxHeight={{ lg: "350px" }}
        >
          <CircularProgress sx={{ color: "#1F1D2B" }} />
        </Box>
      </Container>
    );
  }

  if (error || !curso) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error || "Curso não encontrado"}</Alert>
        <Button
          onClick={() => router.push("/")}
          sx={{
            mt: 2,
            backgroundColor: "#1F1D2B",
            color: "#FFFFFF",
            fontFamily: "Poppins",
            "&:hover": {
              backgroundColor: "#2a2838",
            },
          }}
        >
          Voltar para Home
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 2}}>
      {/* Título do Curso */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontFamily: "Poppins",
            fontWeight: 700,
            color: "#FFFFFF",
            cursor: "pointer",
            "&:hover": {
              color: "#2C5F2D",
            },
          }}
          onClick={() => router.push("/cursos")}
        >
          Cursos
        </Typography>
        <Typography
          variant="h3"
          component="span"
          sx={{
            fontFamily: "Poppins",
            fontWeight: 700,
            color: "#FFFFFF",
          }}
        >
          &gt;
        </Typography>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontFamily: "Poppins",
            fontWeight: 700,
            color: "#FFFFFF",
          }}
        >
          {curso.titulo}
        </Typography>
      </Box>

      {/* Seção com Imagem, Subtítulo,  e Botão */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "600px 1fr" },
          gap: 4,
          mb: 4,
        }}
      >
        {/* Imagem à Esquerda */}
        <Box>
          {curso.imagem ? (
            <Image
              src={
                curso.imagem.startsWith("http")
                  ? curso.imagem
                  : `${API_URL}${curso.imagem}`
              }
              alt={curso.titulo}
              width={600}
              height={400}
              style={{
                width: "100%",
                height: "350px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
              onError={(e) => {
                const target = e.target as HTMLElement;
                target.style.display = "none";
                if (target.nextElementSibling) {
                  (target.nextElementSibling as HTMLElement).style.display =
                    "flex";
                }
              }}
            />
          ) : (
            <Box
              sx={{
                width: "100%",
                height: 400,
                backgroundColor: "#EDEDED",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Poppins",
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#666666",
                }}
              >
                EM BREVE
              </Typography>
            </Box>
          )}
          {curso.imagem && (
            <Box
              sx={{
                width: "100%",
                height: 400,
                backgroundColor: "#EDEDED",
                display: "none",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Poppins",
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#666666",
                }}
              >
                EM BREVE
              </Typography>
            </Box>
          )}
        </Box>

        {/* Subtítulo, Descrição e Botão à Direita */}
        <Box 
          sx={{ 
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "center",
            alignItems: "center",
            gap: 3,
            p: 4,
            borderRadius: "8px",
            textAlign: "center",
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
            {curso.subtitulo}
          </Typography>

          {/* Chips de Dificuldade e Categoria */}
          <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
            <Chip
              label={getDificuldadeLabel(curso.grau_dificuldade)}
              sx={{
                backgroundColor: getDificuldadeColor(curso.grau_dificuldade),
                color: "#FFFFFF",
                fontFamily: "Poppins",
                fontWeight: 500,
                fontSize: "14px",
              }}
            />
            <Chip
              label={curso.categoria}
              sx={{
                backgroundColor: "rgba(44, 95, 45, 0.2)",
                color: "#2C5F2D",
                fontWeight: 700,
                border: "1px solid rgba(44, 95, 45, 0.4)",
                fontSize: "14px",
              }}
            />
          </Box>

            <Button
            variant="contained"
            sx={{
              backgroundColor: "#FFFFFF",
              color: "#000000",
              fontFamily: "Poppins",
              fontWeight: 500,
              fontSize: "18px",
              textTransform: "none",
              padding: "12px 32px",
              mt: 2,
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(44,95,45,0.08)",
              "&:hover": {
              backgroundColor: "#F0F0F0",
              },
            }}
            onClick={() => {
              // Pega a primeira seção e primeira aula
              if (curso.sections && curso.sections.length > 0) {
              const primeiraSecao = curso.sections.sort((a, b) => a.ordem - b.ordem)[0];
              if (primeiraSecao.lessons && primeiraSecao.lessons.length > 0) {
                const primeiraAula = primeiraSecao.lessons.sort((a, b) => a.ordem - b.ordem)[0];
                router.push(`/cursos/${curso.id}/assistir?aula=${primeiraAula.id}`);
              } else {
                alert("Este curso ainda não possui aulas cadastradas.");
              }
              } else {
              alert("Este curso ainda não possui seções cadastradas.");
              }
            }}
            >
            Comece a Assistir
            </Button>
        </Box>
      </Box>

      <Box
        sx={{
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          overflow: "hidden",
          minHeight: "400px",
        }}
      >
        {/* Tabs */}
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            "& .MuiTab-root": {
              color: "#1F1D2B",
              fontFamily: "Poppins",
              fontSize: "16px",
              fontWeight: 500,
              textTransform: "none",
              minWidth: 120,
              "&.Mui-selected": {
                color: "#1F1D2B",
                fontWeight: 700,
              },
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#1F1D2B",
              height: 3,
            },
          }}
        >
          <Tab label="Descrição" />
          <Tab label="Aulas" />
        </Tabs>

        {/* Conteúdo das Tabs */}
        <Box sx={{ p: 3 }}>
          {tabValue === 0 && (
            // Tab Descrição
            <Typography
              sx={{
                fontFamily: "Poppins",
                color: "#1F1D2B",
                fontSize: "16px",
                lineHeight: 1.8,
              }}
            >
              {curso.resumo}
            </Typography>
          )}

          {tabValue === 1 && (
            // Tab Aulas
            <Box>
              {curso.sections && curso.sections.length > 0 ? (
                curso.sections
                  .sort((a, b) => a.ordem - b.ordem)
                  .map((section, index) => (
                    <Box key={section.id}>
                      <Typography
                        sx={{
                          fontFamily: "Poppins",
                          color: "#1F1D2B",
                          fontSize: "18px",
                          fontWeight: 600,
                          py: 2,
                        }}
                      >
                        Seção {section.ordem}: {section.titulo}
                      </Typography>
                      {index < curso.sections.length - 1 && (
                        <Divider sx={{ borderColor: "#E0E0E0" }} />
                      )}
                    </Box>
                  ))
              ) : (
                <Typography
                  sx={{
                    fontFamily: "Poppins",
                    color: "#1F1D2B",
                    fontSize: "16px",
                  }}
                >
                  Este curso ainda não possui seções cadastradas.
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
}
