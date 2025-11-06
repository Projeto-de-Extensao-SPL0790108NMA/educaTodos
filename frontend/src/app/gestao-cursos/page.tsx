'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
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
  Container,
  TextField,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/services/apiClient';

interface Course {
  id: number;
  titulo: string;
  categoria: string;
  grau_dificuldade: string;
  is_active: boolean;
  created_at: string;
}

export default function GestaoCursosPage() {
  const router = useRouter();
  const [cursos, setCursos] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState('a-z');
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);

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

  // Filtrar e ordenar cursos
  const getFilteredAndSortedCursos = () => {
    let filtered = cursos.filter((curso) =>
      curso.titulo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (filterOption) {
      case 'a-z':
        filtered.sort((a, b) => a.titulo.localeCompare(b.titulo));
        break;
      case 'z-a':
        filtered.sort((a, b) => b.titulo.localeCompare(a.titulo));
        break;
      case 'categoria':
        filtered.sort((a, b) => a.categoria.localeCompare(b.categoria));
        break;
      case 'iniciante':
        filtered = filtered.filter((curso) => curso.grau_dificuldade === 'iniciante');
        break;
      case 'intermediario':
        filtered = filtered.filter((curso) => curso.grau_dificuldade === 'intermediario');
        break;
      case 'avancado':
        filtered = filtered.filter((curso) => curso.grau_dificuldade === 'avancado');
        break;
      case 'ativo':
        filtered = filtered.filter((curso) => curso.is_active === true);
        break;
      case 'inativo':
        filtered = filtered.filter((curso) => curso.is_active === false);
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredCursos = getFilteredAndSortedCursos();

  // Paginação
  const paginatedCursos = filteredCursos.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const totalPages = Math.ceil(filteredCursos.length / rowsPerPage);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            color: '#1F1D2B',
            fontFamily: 'Poppins',
            fontWeight: 700,
            fontSize: '40px',
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
            fontSize: '24px',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#2a2838',
            },
          }}
        >
          Criar Curso
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Box com fundo #EDEDED contendo filtros e tabela */}
      <Box sx={{ backgroundColor: '#EDEDED', padding: 3, borderRadius: 2 }}>
        {/* Filtros e Busca */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <FormControl sx={{ minWidth: 250 }} size="small">
            <InputLabel
              sx={{
                fontFamily: 'Poppins',
                color: '#000000',
                '&.Mui-focused': { color: '#1F1D2B' },
              }}
            >
              Filtrar por
            </InputLabel>
            <style>
              {`
                .MuiSelect-icon {
                  color: #000000 !important;
                }
              `}
            </style>
            <Select
              value={filterOption}
              label="Filtrar por"
              onChange={(e) => setFilterOption(e.target.value)}
              sx={{
                fontFamily: 'Poppins',
                color: '#000000',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1F1D2B',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1F1D2B',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1F1D2B',
                },
              }}
            >
              <MenuItem value="a-z" sx={{ fontFamily: 'Poppins' }}>
                Alfabética (A-Z)
              </MenuItem>
              <MenuItem value="z-a" sx={{ fontFamily: 'Poppins' }}>
                Alfabética (Z-A)
              </MenuItem>
              <MenuItem value="categoria" sx={{ fontFamily: 'Poppins' }}>
                Categoria
              </MenuItem>
              <MenuItem value="iniciante" sx={{ fontFamily: 'Poppins' }}>
                Dificuldade: Iniciante
              </MenuItem>
              <MenuItem value="intermediario" sx={{ fontFamily: 'Poppins' }}>
                Dificuldade: Intermediário
              </MenuItem>
              <MenuItem value="avancado" sx={{ fontFamily: 'Poppins' }}>
                Dificuldade: Avançado
              </MenuItem>
              <MenuItem value="ativo" sx={{ fontFamily: 'Poppins' }}>
                Status: Ativo
              </MenuItem>
              <MenuItem value="inativo" sx={{ fontFamily: 'Poppins' }}>
                Status: Inativo
              </MenuItem>
            </Select>
          </FormControl>

          <TextField
            placeholder="Buscar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#1F1D2B', fontSize: '20px' }} />
                </InputAdornment>
              ),
              sx: {
                fontFamily: 'Poppins',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1F1D2B',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1F1D2B',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1F1D2B',
                },
              },
            }}
            InputLabelProps={{
              sx: { color: '#000000' },
            }}
            inputProps={{
              style: { color: '#000000' },
            }}
            FormHelperTextProps={{
              sx: { color: '#000000' },
            }}
            sx={{
              minWidth: 300,
              '& .MuiInputBase-input::placeholder': {
                color: '#000000',
                opacity: 1,
                fontFamily: 'Poppins',
              },
            }}
          />
        </Box>

        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontFamily: 'Poppins', padding: '8px 16px', color: '#fff' }}>
                  <strong>Título</strong>
                </TableCell>
                <TableCell sx={{ fontFamily: 'Poppins', padding: '8px 16px', color: '#fff' }}>
                  <strong>Categoria</strong>
                </TableCell>
                <TableCell sx={{ fontFamily: 'Poppins', padding: '8px 16px', color: '#fff' }}>
                  <strong>Dificuldade</strong>
                </TableCell>
                <TableCell align="center" sx={{ fontFamily: 'Poppins', padding: '8px 16px', color: '#fff' }}>
                  <strong>Status</strong>
                </TableCell>
                <TableCell align="center" sx={{ fontFamily: 'Poppins', padding: '8px 16px', color: '#fff' }}>
                  <strong>Ações</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedCursos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ fontFamily: 'Poppins', color: '#000000', padding: '8px 16px' }}>
                    Nenhum curso encontrado
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCursos.map((curso, index) => (
                  <TableRow
                    key={curso.id}
                    hover
                    sx={{
                      backgroundColor: index % 2 === 0 ? '#D9D9D9' : '#FFFFFF',
                    }}
                  >
                    <TableCell sx={{ fontFamily: 'Poppins', color: '#000000', padding: '8px 16px' }}>
                      {curso.titulo}
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'Poppins', color: '#000000', padding: '8px 16px' }}>
                      {curso.categoria}
                    </TableCell>
                    <TableCell sx={{ padding: '8px 16px' }}>
                      <Chip
                        label={getDificuldadeLabel(curso.grau_dificuldade)}
                        sx={{
                          backgroundColor: getDificuldadeColor(curso.grau_dificuldade),
                          color: '#FFFFFF',
                          fontFamily: 'Poppins',
                          fontWeight: 500,
                          fontSize: '12px',
                        }}
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ padding: '8px 16px' }}>
                      <Chip
                        label={curso.is_active ? 'Ativo' : 'Inativo'}
                        sx={{
                          backgroundColor: curso.is_active ? '#2C5F2D' : '#999999',
                          color: '#FFFFFF',
                          fontFamily: 'Poppins',
                          fontWeight: 500,
                          fontSize: '12px',
                        }}
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ padding: '8px 16px' }}>
                      <IconButton
                        onClick={() => router.push(`/gestao-cursos/editar/${curso.id}`)}
                        sx={{
                          padding: '8px',
                          '&:hover': {
                            backgroundColor: 'rgba(31, 29, 43, 0.04)',
                          },
                        }}
                      >
                        <Image src="/edit.svg" alt="Editar" width={24} height={24} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Paginação */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 2,
            mb: 2,
          }}
        >
          <Typography
            sx={{
              fontFamily: 'Poppins',
              color: '#000000',
              fontSize: '14px',
            }}
          >
            Página {page + 1} de {totalPages === 0 ? 1 : totalPages} ({filteredCursos.length} cursos)
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              onClick={() => handleChangePage(0)}
              disabled={page === 0}
              sx={{
                minWidth: '40px',
                backgroundColor: '#1F1D2B',
                color: '#FFFFFF',
                fontFamily: 'Poppins',
                '&:hover': {
                  backgroundColor: '#2a2838',
                },
                '&:disabled': {
                  backgroundColor: '#D9D9D9',
                  color: '#666666',
                },
              }}
            >
              {'<<'}
            </Button>
            <Button
              onClick={() => handleChangePage(page - 1)}
              disabled={page === 0}
              sx={{
                minWidth: '40px',
                backgroundColor: '#1F1D2B',
                color: '#FFFFFF',
                fontFamily: 'Poppins',
                '&:hover': {
                  backgroundColor: '#2a2838',
                },
                '&:disabled': {
                  backgroundColor: '#D9D9D9',
                  color: '#666666',
                },
              }}
            >
              {'<'}
            </Button>
            <Button
              onClick={() => handleChangePage(page + 1)}
              disabled={page >= totalPages - 1}
              sx={{
                minWidth: '40px',
                backgroundColor: '#1F1D2B',
                color: '#FFFFFF',
                fontFamily: 'Poppins',
                '&:hover': {
                  backgroundColor: '#2a2838',
                },
                '&:disabled': {
                  backgroundColor: '#D9D9D9',
                  color: '#666666',
                },
              }}
            >
              {'>'}
            </Button>
            <Button
              onClick={() => handleChangePage(totalPages - 1)}
              disabled={page >= totalPages - 1}
              sx={{
                minWidth: '40px',
                backgroundColor: '#1F1D2B',
                color: '#FFFFFF',
                fontFamily: 'Poppins',
                '&:hover': {
                  backgroundColor: '#2a2838',
                },
                '&:disabled': {
                  backgroundColor: '#D9D9D9',
                  color: '#666666',
                },
              }}
            >
              {'>>'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
