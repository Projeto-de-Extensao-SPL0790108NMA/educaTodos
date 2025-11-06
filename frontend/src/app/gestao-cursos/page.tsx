'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/services/apiClient';

interface Course {
  id: number;
  titulo: string;
  categoria: string;
  grau_dificuldade: string;
  total_sections: number;
  total_lessons: number;
  is_active: boolean;
  created_at: string;
}

export default function GestaoCursosPage() {
  const router = useRouter();
  const [cursos, setCursos] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCursos();
  }, []);

  const fetchCursos = async () => {
    try {
      setLoading(true);
      const data = await apiFetch<Course[]>('/api/courses/courses/');
      setCursos(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar cursos');
    } finally {
      setLoading(false);
    }
  };

  const getDificuldadeColor = (dificuldade: string) => {
    switch (dificuldade) {
      case 'iniciante':
        return '#2C5F2D';
      case 'intermediario':
        return '#FFA500';
      case 'avancado':
        return '#6B1515';
      default:
        return '#1F1D2B';
    }
  };

  const getDificuldadeLabel = (dificuldade: string) => {
    switch (dificuldade) {
      case 'iniciante':
        return 'Iniciante';
      case 'intermediario':
        return 'Intermediário';
      case 'avancado':
        return 'Avançado';
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
          minHeight: '400px',
        }}
      >
        <CircularProgress sx={{ color: '#1F1D2B' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4 }}>
      {/* Cabeçalho */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 3,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontFamily: 'Poppins',
            fontWeight: 600,
            color: '#000000',
          }}
        >
          Gestão de Cursos
        </Typography>

        <Button
          variant="contained"
          onClick={() => router.push('/gestao-cursos/criar')}
          sx={{
            backgroundColor: '#1F1D2B',
            color: '#FFFFFF',
            fontFamily: 'Poppins',
            fontWeight: 500,
            textTransform: 'none',
            padding: '10px 30px',
            '&:hover': {
              backgroundColor: '#2d2a3d',
            },
          }}
        >
          + Criar Curso
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {error}
        </Alert>
      )}

      {/* Tabela de Cursos */}
      <TableContainer
        component={Paper}
        sx={{
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#1F1D2B' }}>
              <TableCell
                sx={{
                  color: '#FFFFFF',
                  fontFamily: 'Poppins',
                  fontWeight: 600,
                }}
              >
                Título
              </TableCell>
              <TableCell
                sx={{
                  color: '#FFFFFF',
                  fontFamily: 'Poppins',
                  fontWeight: 600,
                }}
              >
                Categoria
              </TableCell>
              <TableCell
                sx={{
                  color: '#FFFFFF',
                  fontFamily: 'Poppins',
                  fontWeight: 600,
                }}
              >
                Dificuldade
              </TableCell>
              <TableCell
                sx={{
                  color: '#FFFFFF',
                  fontFamily: 'Poppins',
                  fontWeight: 600,
                }}
                align="center"
              >
                Seções
              </TableCell>
              <TableCell
                sx={{
                  color: '#FFFFFF',
                  fontFamily: 'Poppins',
                  fontWeight: 600,
                }}
                align="center"
              >
                Aulas
              </TableCell>
              <TableCell
                sx={{
                  color: '#FFFFFF',
                  fontFamily: 'Poppins',
                  fontWeight: 600,
                }}
                align="center"
              >
                Status
              </TableCell>
              <TableCell
                sx={{
                  color: '#FFFFFF',
                  fontFamily: 'Poppins',
                  fontWeight: 600,
                }}
                align="center"
              >
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cursos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography
                    sx={{
                      fontFamily: 'Poppins',
                      color: '#666',
                      padding: 3,
                    }}
                  >
                    Nenhum curso cadastrado. Clique em "Criar Curso" para
                    começar.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              cursos.map((curso, index) => (
                <TableRow
                  key={curso.id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? '#D9D9D9' : '#FFFFFF',
                  }}
                >
                  <TableCell
                    sx={{
                      fontFamily: 'Poppins',
                      color: '#000000',
                    }}
                  >
                    {curso.titulo}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: 'Poppins',
                      color: '#000000',
                    }}
                  >
                    {curso.categoria}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getDificuldadeLabel(curso.grau_dificuldade)}
                      sx={{
                        backgroundColor: getDificuldadeColor(
                          curso.grau_dificuldade
                        ),
                        color: '#FFFFFF',
                        fontFamily: 'Poppins',
                        fontWeight: 500,
                        fontSize: '12px',
                      }}
                    />
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontFamily: 'Poppins',
                      color: '#000000',
                    }}
                  >
                    {curso.total_sections}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontFamily: 'Poppins',
                      color: '#000000',
                    }}
                  >
                    {curso.total_lessons}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={curso.is_active ? 'Ativo' : 'Inativo'}
                      sx={{
                        backgroundColor: curso.is_active
                          ? '#2C5F2D'
                          : '#999999',
                        color: '#FFFFFF',
                        fontFamily: 'Poppins',
                        fontWeight: 500,
                        fontSize: '12px',
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() =>
                        router.push(`/gestao-cursos/editar/${curso.id}`)
                      }
                      sx={{
                        borderColor: '#1F1D2B',
                        color: '#1F1D2B',
                        fontFamily: 'Poppins',
                        textTransform: 'none',
                        '&:hover': {
                          borderColor: '#1F1D2B',
                          backgroundColor: 'rgba(31, 29, 43, 0.04)',
                        },
                      }}
                    >
                      Ver Detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
