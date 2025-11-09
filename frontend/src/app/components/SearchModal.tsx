"use client";

import * as React from 'react';
import {
  Box,
  InputBase,
  Typography,
  Modal,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  IconButton,
  Chip
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/services/apiClient';

interface Course {
  id: number;
  titulo: string;
  resumo: string;
  categoria: string;
  imagem: string;
  grau_dificuldade: string;
}

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export default function SearchModal({ open, onClose, initialQuery = '' }: SearchModalProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState(initialQuery);
  const [searchResults, setSearchResults] = React.useState<Course[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);

  // Atualiza a query quando o modal abre com uma query inicial
  React.useEffect(() => {
    if (open && initialQuery) {
      setSearchQuery(initialQuery);
      handleSearch(initialQuery);
    }
  }, [open, initialQuery]);

  // Função para buscar cursos
  const handleSearch = React.useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    try {
      const response = await apiFetch<Course[]>(`/api/courses/courses/?search=${encodeURIComponent(query)}`);
      console.log('Resposta da API:', response);
      
      if (Array.isArray(response)) {
        setSearchResults(response);
      } else {
        console.error('Resposta não é um array:', response);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Erro ao buscar cursos:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Handler para pressionar Enter na barra de busca do modal
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && searchQuery.trim()) {
      handleSearch(searchQuery);
    }
  };

  const handleCourseClick = (courseId: number) => {
    router.push(`/cursos/${courseId}`);
    onClose();
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleCloseModal = () => {
    onClose();
    setSearchQuery('');
    setSearchResults([]);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Iniciante':
        return '#4CAF50';
      case 'Intermediário':
        return '#FF9800';
      case 'Avançado':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleCloseModal}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(4px)',
      }}
    >
      <Box
        sx={{
          bgcolor: '#1A1A1A',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          p: 0,
          maxWidth: '1000px',
          maxHeight: '85vh',
          overflow: 'hidden',
          width: '95%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header do Modal */}
        <Box
          sx={{
            p: 3,
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography 
            variant="h5" 
            component="h2" 
            sx={{ 
              fontWeight: 700,
              color: '#FFFFFF',
              fontFamily: 'Poppins',
            }}
          >
            Buscar Cursos
          </Typography>
          <IconButton 
            onClick={handleCloseModal}
            sx={{ 
              color: '#FFFFFF',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Barra de pesquisa */}
        <Box sx={{ p: 3, pb: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#2A2A2A",
              borderRadius: 3,
              px: 3,
              py: 1.5,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              '&:focus-within': {
                border: '1px solid #2C5F2D',
                boxShadow: '0 0 0 3px rgba(44, 95, 45, 0.1)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <img
              src='/search.svg'
              alt='Search'
              style={{
                width: '20px',
                height: '20px',
                marginRight: '12px',
                opacity: 0.7,
              }}
            />
            <InputBase
              placeholder="Digite o nome ou categoria do curso..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              autoFocus
              sx={{ 
                flex: 1,
                color: '#FFFFFF',
                fontSize: '16px',
                fontFamily: 'Poppins',
                '& ::placeholder': {
                  color: '#B0B0B0',
                  opacity: 1,
                },
              }}
            />
          </Box>
        </Box>

        {/* Conteúdo - Resultados */}
        <Box sx={{ 
          flex: 1, 
          overflow: 'auto', 
          px: 3, 
          pb: 3,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#1A1A1A',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#3A3A3A',
            borderRadius: '4px',
            '&:hover': {
              background: '#4A4A4A',
            },
          },
        }}>
          {isSearching ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress sx={{ color: '#2C5F2D' }} />
            </Box>
          ) : searchResults.length > 0 ? (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                },
                gap: 3,
              }}
            >
              {searchResults.map((course) => (
                <Card
                  key={course.id}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    backgroundColor: '#2A2A2A',
                    borderRadius: 2,
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(44, 95, 45, 0.3)',
                      borderColor: '#2C5F2D',
                    },
                  }}
                  onClick={() => handleCourseClick(course.id)}
                >
                  {course.imagem && (
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="140"
                        image={course.imagem}
                        alt={course.titulo}
                        sx={{
                          objectFit: 'cover',
                          backgroundColor: '#3A3A3A',
                        }}
                      />
                      {/* Overlay gradiente */}
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: '50%',
                          background: 'linear-gradient(to top, rgba(42, 42, 42, 0.9), transparent)',
                        }}
                      />
                    </Box>
                  )}
                  <CardContent sx={{ flex: 1, p: 2 }}>
                    <Typography 
                      variant="h6" 
                      component="div" 
                      gutterBottom
                      sx={{
                        fontWeight: 600,
                        fontSize: '16px',
                        color: '#FFFFFF',
                        fontFamily: 'Poppins',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        mb: 1.5,
                      }}
                    >
                      {course.titulo}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
                      <Chip
                        label={course.categoria}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(44, 95, 45, 0.2)',
                          color: '#4CAF50',
                          fontWeight: 500,
                          fontSize: '12px',
                          height: '24px',
                          border: '1px solid rgba(76, 175, 80, 0.3)',
                        }}
                      />
                      {course.grau_dificuldade && (
                        <Chip
                          label={course.grau_dificuldade}
                          size="small"
                          sx={{
                            backgroundColor: `${getDifficultyColor(course.grau_dificuldade)}20`,
                            color: getDifficultyColor(course.grau_dificuldade),
                            fontWeight: 500,
                            fontSize: '12px',
                            height: '24px',
                            border: `1px solid ${getDifficultyColor(course.grau_dificuldade)}40`,
                          }}
                        />
                      )}
                    </Box>

                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        color: '#B0B0B0',
                        fontSize: '14px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {course.resumo}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : searchQuery ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#B0B0B0',
                  fontFamily: 'Poppins',
                  mb: 1,
                }}
              >
                Nenhum curso encontrado
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ color: '#757575' }}
              >
                Tente buscar por "{searchQuery}" com outros termos
              </Typography>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#B0B0B0',
                  fontFamily: 'Poppins',
                  mb: 1,
                }}
              >
                Comece a buscar
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ color: '#757575' }}
              >
                Digite o nome ou categoria do curso e pressione Enter
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  );
}

