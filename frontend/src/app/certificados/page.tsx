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
  Paper,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  CalendarToday as CalendarIcon,
  Schedule as ClockIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { apiFetch } from '@/services/apiClient';

interface Certificate {
  id: number;
  user: number;
  user_name: string;
  user_username: string;
  course: number;
  course_title: string;
  course_image: string;
  course_category: string;
  course_difficulty: string;
  completed_at: string;
  certificate_code: string;
  total_hours: number;
}

export default function CertificadosPage() {
  const router = useRouter();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const response = await apiFetch<Certificate[]>('/api/courses/completions/');
      setCertificates(response);
      setError(null);
    } catch (err: any) {
      console.error('Erro ao buscar certificados:', err);
      setError(
        err.response?.data?.error ||
          'Erro ao carregar certificados. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleViewCertificate = (code: string) => {
    router.push(`/certificado/${code}`);
  };

  const getDificuldadeColor = (dificuldade: string) => {
    switch (dificuldade.toLowerCase()) {
      case "iniciante":
        return "#2C5F2D";
      case "intermediario":
      case "intermediário":
        return "#FFA500";
      case "avancado":
      case "avançado":
        return "#6B1515";
      default:
        return "#1F1D2B";
    }
  };

  const getDificuldadeLabel = (dificuldade: string) => {
    switch (dificuldade.toLowerCase()) {
      case "iniciante":
        return "Iniciante";
      case "intermediario":
      case "intermediário":
        return "Intermediário";
      case "avancado":
      case "avançado":
        return "Avançado";
      default:
        return dificuldade;
    }
  };

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
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Meus Certificados
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Veja todos os cursos que você concluiu e seus certificados
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Empty State */}
      {!loading && certificates.length === 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            backgroundColor: '#f5f5f5',
            borderRadius: 2,
          }}
        >
          <TrophyIcon sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Você ainda não possui certificados
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Complete cursos para receber seus certificados
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
        </Paper>
      )}

      {/* Certificates Grid */}
      {certificates.length > 0 && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
            gap: 3,
          }}
        >
          {certificates.map((certificate) => (
            <Card
              key={certificate.id}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#D9D9D9',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
                {/* Course Image */}
                <CardMedia
                  component="img"
                  height="160"
                  image={certificate.course_image || '/placeholder-course.png'}
                  alt={certificate.course_title}
                  sx={{ objectFit: 'cover' }}
                />

                <CardContent sx={{ flexGrow: 1 }}>
                  {/* Badge de Conclusão */}
                  <Chip
                    icon={<TrophyIcon />}
                    label="Concluído"
                    color="success"
                    size="small"
                    sx={{ mb: 2 }}
                  />

                  {/* Course Title */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 'bold',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      minHeight: '3.6em',
                      mb: 1,
                      color: '#1F1D2B',
                    }}
                  >
                    {certificate.course_title}
                  </Typography>

                  {/* Categoria e Nível */}
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <Chip
                      label={certificate.course_category}
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
                      label={getDificuldadeLabel(certificate.course_difficulty)}
                      size="small"
                      sx={{
                        backgroundColor: getDificuldadeColor(certificate.course_difficulty),
                        color: '#FFFFFF',
                        fontWeight: 600,
                        fontFamily: 'Poppins',
                      }}
                    />
                  </Box>

                  {/* Info Cards */}
                  <Box sx={{ mt: 2, mb: 2 }}>
                    {/* Date */}
                    <Box
                      sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                    >
                      <CalendarIcon
                        sx={{ fontSize: 18, color: '#1F1D2B', mr: 1 }}
                      />
                      <Typography variant="body2" color="#1F1D2B">
                        {formatDate(certificate.completed_at)}
                      </Typography>
                    </Box>

                    {/* Workload */}
                    <Box
                      sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                    >
                      <ClockIcon
                        sx={{ fontSize: 18, color: '#1F1D2B', mr: 1 }}
                      />
                      <Typography variant="body2" color="#1F1D2B">
                        {certificate.total_hours}h de carga horária
                      </Typography>
                    </Box>
                  </Box>

                  {/* Certificate Code */}
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      mb: 2,
                      fontFamily: 'monospace',
                      backgroundColor: '#f5f5f5',
                      color: '#666',
                      padding: '4px 8px',
                      borderRadius: 1,
                    }}
                  >
                    {certificate.certificate_code}
                  </Typography>

                  {/* Action Button */}
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<ViewIcon />}
                    onClick={() =>
                      handleViewCertificate(certificate.certificate_code)
                    }
                    sx={{
                      backgroundColor: '#2C5F2D',
                      '&:hover': { backgroundColor: '#3a7a3c' },
                      color:'#ffffff'
                    }}
                  >
                    Ver Certificado
                  </Button>
                </CardContent>
              </Card>
            ))}
            
            {/* Card de Incentivo - Aparece quando há certificados mas não preenche o grid */}
            {certificates.length > 0 && certificates.length < 4 && (
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: '#f5f5f5',
                  border: '2px dashed #2C5F2D',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                    backgroundColor: '#e8f5e9',
                  },
                }}
                onClick={() => router.push('/cursos')}
              >
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    p: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      backgroundColor: '#2C5F2D',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                    }}
                  >
                    <AddIcon sx={{ fontSize: 40, color: '#ffffff' }} />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 'bold',
                      color: '#2C5F2D',
                      mb: 1,
                    }}
                  >
                    Conquiste Mais Certificados
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, color:'#666' }}
                  >
                    Continue aprendendo e expandindo suas conquistas
                  </Typography>
                  <Button
                    variant="outlined"
                    sx={{
                      borderColor: '#2C5F2D',
                      color: '#2C5F2D',
                      '&:hover': {
                        borderColor: '#1e4620',
                        backgroundColor: '#e8f5e9',
                      },
                    }}
                  >
                    Ir para Página Principal
                  </Button>
                </CardContent>
              </Card>
            )}
          </Box>
        )}
    </Container>
  );
}
