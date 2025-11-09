"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Paper,
} from "@mui/material";
import { apiFetch } from "@/services/apiClient";
import VerifiedIcon from "@mui/icons-material/Verified";
import DownloadIcon from "@mui/icons-material/Download";
import ListIcon from "@mui/icons-material/List";
import Image from "next/image";

interface CourseCompletion {
  id: number;
  user: number;
  user_name: string;
  user_username: string;
  course: number;
  course_title: string;
  course_image: string | null;
  course_category: string;
  course_difficulty: string;
  completed_at: string;
  certificate_code: string;
  total_hours: number;
}

export default function CertificadoPage() {
  const params = useParams();
  const router = useRouter();
  const [completion, setCompletion] = useState<CourseCompletion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    if (params.code) {
      fetchCurrentUser();
    }
  }, [params.code]);

  const fetchCurrentUser = async () => {
    try {
      const userData = await apiFetch<{ id: number }>('/api/accounts/me/');
      setCurrentUserId(userData.id);
      await fetchCertificate(userData.id);
    } catch (err: any) {
      setError("Você precisa estar autenticado para ver este certificado");
      setLoading(false);
    }
  };

  const fetchCertificate = async (userId: number) => {
    try {
      setLoading(true);
      const data = await apiFetch<CourseCompletion>(
        `/api/courses/completions/by-code/${params.code}/`
      );
      
      // Verifica se o certificado pertence ao usuário atual
      if (data.user !== userId) {
        setError("Você não tem permissão para visualizar este certificado");
        setCompletion(null);
      } else {
        setCompletion(data);
      }
    } catch (err: any) {
      setError(err.message || "Certificado não encontrado");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatDifficulty = (difficulty: string) => {
    const difficultyMap: Record<string, string> = {
      'Iniciante': 'Iniciante',
      'Intermediário': 'Intermediário',
      'Intermediario': 'Intermediário',
      'Avançado': 'Avançado',
      'Avancado': 'Avançado',
    };
    return difficultyMap[difficulty] || difficulty;
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      
      // Importa dinamicamente o html2canvas
      const html2canvas = (await import('html2canvas')).default;
      
      // Pega o elemento do certificado
      const certificateElement = document.getElementById('certificate-content');
      if (!certificateElement) {
        alert('Erro ao gerar certificado');
        return;
      }

      // Gera o canvas com melhor qualidade
      const canvas = await html2canvas(certificateElement, {
        scale: 2, // Melhor qualidade
        backgroundColor: '#FFFFFF',
        logging: false,
      });

      // Converte para blob e faz download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `certificado-${params.code}.png`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
        }
      });
    } catch (err) {
      console.error('Erro ao baixar certificado:', err);
      alert('Erro ao baixar certificado. Tente novamente.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: "center" }}>
        <CircularProgress sx={{ color: "#1F1D2B" }} />
      </Container>
    );
  }

  if (error || !completion) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error || "Certificado não encontrado"}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 2}}>
      {/* Botões de Ação */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 3,
          "@media print": {
            display: "none",
          },
        }}
      >
        <Button
          variant="outlined"
          startIcon={<ListIcon />}
          onClick={() => router.push('/certificados')}
          sx={{
            borderColor: "#2C5F2D",
            color: "#2C5F2D",
            fontFamily: "Poppins",
            fontWeight: 500,
            textTransform: "none",
            borderWidth: "px",
            px: 2,
            py: 1,
            "&:hover": {
              borderColor: "#1e4620",
              backgroundColor: "rgba(44, 95, 45, 0.1)",
              borderWidth: "2px",
            },
          }}
        >
          Meus Certificados
        </Button>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          disabled={downloading}
          sx={{
            backgroundColor: "#2C5F2D",
            color: "#FFFFFF",
            fontFamily: "Poppins",
            fontWeight: 500,
            textTransform: "none",
            px: 2,
            py: 1,
            boxShadow: "0 4px 12px rgba(44, 95, 45, 0.3)",
            "&:hover": {
              backgroundColor: "#1e4620",
              boxShadow: "0 6px 16px rgba(44, 95, 45, 0.4)",
            },
            "&:disabled": {
              backgroundColor: "#9E9E9E",
              color: "#FFFFFF",
            },
          }}
        >
          {downloading ? "Gerando..." : "Baixar Certificado"}
        </Button>
      </Box>

      {/* Certificado */}
      <Paper
        id="certificate-content"
        elevation={3}
        sx={{
          p: 6,
          backgroundColor: "#FFFFFF",
          border: "8px solid #1F1D2B",
          borderRadius: "12px",
          position: "relative",
          minHeight: "600px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          "@media print": {
            border: "8px solid #1F1D2B",
            boxShadow: "none",
          },
        }}
      >
        {/* Selo de Verificação */}
        <Box
          sx={{
            position: "absolute",
            top: 20,
            right: 20,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <VerifiedIcon sx={{ color: "#2C5F2D", fontSize: 40 }} />
          <Typography
            sx={{
              fontFamily: "Poppins",
              fontSize: "12px",
              color: "#666666",
            }}
          >
            Verificado
          </Typography>
        </Box>

        {/* Logo */}
        <Box sx={{ mb: 4 }}>
          <Image
            src="/logo_certificado.png"
            alt="Logo"
            width={200}
            height={160}
            style={{
              objectFit: "contain",
            }}
          />
        </Box>

        {/* Título do Certificado */}
        <Typography
          variant="h3"
          sx={{
            fontFamily: "Poppins",
            fontWeight: 700,
            color: "#1F1D2B",
            textAlign: "center",
            mb: 2,
          }}
        >
          CERTIFICADO DE CONCLUSÃO
        </Typography>

        <Box
          sx={{
            width: "80px",
            height: "4px",
            backgroundColor: "#2C5F2D",
            mb: 4,
          }}
        />

        {/* Texto Principal */}
        <Typography
          sx={{
            fontFamily: "Poppins",
            fontSize: "18px",
            color: "#666666",
            textAlign: "center",
            mb: 2,
            maxWidth: "600px",
          }}
        >
          Certificamos que
        </Typography>

        <Typography
          variant="h4"
          sx={{
            fontFamily: "Poppins",
            fontWeight: 700,
            color: "#1F1D2B",
            textAlign: "center",
            mb: 2,
          }}
        >
          {completion.user_name}
        </Typography>

        <Typography
          sx={{
            fontFamily: "Poppins",
            fontSize: "18px",
            color: "#666666",
            textAlign: "center",
            mb: 1,
            maxWidth: "600px",
          }}
        >
          concluiu com êxito o curso
        </Typography>

        <Typography
          variant="h5"
          sx={{
            fontFamily: "Poppins",
            fontWeight: 600,
            color: "#2C5F2D",
            textAlign: "center",
            mb: 2,
          }}
        >
          {completion.course_title}
        </Typography>

        {/* Carga Horária */}
        <Typography
          sx={{
            fontFamily: "Poppins",
            fontSize: "16px",
            color: "#666666",
            textAlign: "center",
            mb: 1,
          }}
        >
          Carga horária: {completion.total_hours}h
        </Typography>

        {/* Nível do Curso */}
        <Typography
          sx={{
            fontFamily: "Poppins",
            fontSize: "16px",
            color: "#666666",
            textAlign: "center",
            mb: 2,
          }}
        >
          Nível: {formatDifficulty(completion.course_difficulty)}
        </Typography>

        {/* Data de Conclusão */}
        <Typography
          sx={{
            fontFamily: "Poppins",
            fontSize: "16px",
            color: "#666666",
            textAlign: "center",
            mb: 4,
          }}
        >
          Concluído em {formatDate(completion.completed_at)}
        </Typography>

        {/* Código do Certificado */}
        <Box
          sx={{
            mt: 4,
            pt: 3,
            borderTop: "2px solid #EDEDED",
            width: "100%",
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Poppins",
              fontSize: "12px",
              color: "#666666",
              mb: 1,
            }}
          >
            Código de Verificação:
          </Typography>
          <Typography
            sx={{
              fontFamily: "Poppins",
              fontSize: "14px",
              fontWeight: 600,
              color: "#1F1D2B",
              letterSpacing: "2px",
            }}
          >
            {completion.certificate_code}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
