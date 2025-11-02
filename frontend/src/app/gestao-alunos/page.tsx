'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { 
  Container, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  CircularProgress,
  Alert,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useRouter } from 'next/navigation'
import { apiFetch } from '@/services/apiClient'
import EditInmateModal from '../components/EditInmateModal'

interface Inmate {
  id: string
  full_name: string
  matricula: string
  status: string
  created_at: string
  must_change_password: boolean
}

export default function GestaoAlunosPage() {
  const [inmates, setInmates] = useState<Inmate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openEditModal, setOpenEditModal] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedInmate, setSelectedInmate] = useState<Inmate | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterOption, setFilterOption] = useState('a-z')
  const router = useRouter()

  useEffect(() => {
    fetchInmates()
  }, [])

  const fetchInmates = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiFetch('/api/accounts/admin/inmates/list/', {
        method: 'GET'
      })
      
      setInmates(response)
    } catch (err) {
      console.error('Erro ao buscar inmates:', err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar alunos')
    } finally {
      setLoading(false)
    }
  }

  const handleAddStudent = () => {
    router.push('/gestao-alunos/adicionar')
  }

  const handleEditStudent = (inmate: Inmate) => {
    setSelectedInmate(inmate)
    setOpenEditModal(true)
  }

  const handleCloseEditModal = () => {
    setOpenEditModal(false)
    setSelectedInmate(null)
    setError(null)
  }

  const handleSaveEdit = async (inmateId: string, updateData: any) => {
    setSubmitting(true)
    setError(null)

    try {
      await apiFetch(`/api/accounts/admin/inmates/${inmateId}/`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      })

      // Recarrega a lista
      await fetchInmates()
      handleCloseEditModal()
    } catch (err) {
      console.error('Erro ao atualizar aluno:', err)
      setError(err instanceof Error ? err.message : 'Erro ao atualizar aluno')
      throw err
    } finally {
      setSubmitting(false)
    }
  }

  const handleOpenDeleteDialog = (inmate: Inmate) => {
    setSelectedInmate(inmate)
    setOpenDeleteDialog(true)
  }

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false)
    setSelectedInmate(null)
  }

  const handleConfirmDelete = async () => {
    if (!selectedInmate) return

    setSubmitting(true)
    setError(null)

    try {
      await apiFetch(`/api/accounts/admin/inmates/${selectedInmate.id}/`, {
        method: 'DELETE'
      })

      // Recarrega a lista
      await fetchInmates()
      handleCloseDeleteDialog()
    } catch (err) {
      console.error('Erro ao deletar aluno:', err)
      setError(err instanceof Error ? err.message : 'Erro ao deletar aluno')
    } finally {
      setSubmitting(false)
    }
  }

  // Filtrar e ordenar alunos
  const getFilteredAndSortedInmates = () => {
    let filtered = inmates.filter((inmate) =>
      inmate.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    switch (filterOption) {
      case 'a-z':
        filtered.sort((a, b) => a.full_name.localeCompare(b.full_name))
        break
      case 'z-a':
        filtered.sort((a, b) => b.full_name.localeCompare(a.full_name))
        break
      case 'matricula':
        filtered.sort((a, b) => a.matricula.localeCompare(b.matricula))
        break
      case 'ativo':
        filtered = filtered.filter((inmate) => inmate.status === 'Ativo')
        break
      case 'provisoria':
        filtered = filtered.filter((inmate) => inmate.must_change_password === true)
        break
      default:
        break
    }

    return filtered
  }

  const filteredInmates = getFilteredAndSortedInmates()

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography 
          variant="h4" 
          component="h1"
          sx={{ 
            color: '#1F1D2B', 
            fontFamily: 'Poppins', 
            fontWeight: 700, 
            fontSize: '40px' 
          }}
        >
          Gestão de Alunos
        </Typography>
        <Button 
          variant="contained"
          onClick={handleAddStudent}
          sx={{
            backgroundColor: '#1F1D2B',
            color: '#FFFFFF',
            fontFamily: 'Poppins',
            fontWeight: 500,
            fontSize: '24px',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#2a2838'
            }
          }}
        >
          Adicionar Aluno
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
        <FormControl sx={{ minWidth: 250 }}>
            <InputLabel 
            sx={{ 
              fontFamily: 'Poppins',
              color: '#000000',
              '&.Mui-focused': { color: '#1F1D2B' }
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
              borderColor: '#1F1D2B'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#1F1D2B'
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#1F1D2B'
              }
            }}
            >
            <MenuItem value="a-z" sx={{ fontFamily: 'Poppins' }}>Alfabética (A-Z)</MenuItem>
            <MenuItem value="z-a" sx={{ fontFamily: 'Poppins' }}>Alfabética (Z-A)</MenuItem>
            <MenuItem value="matricula" sx={{ fontFamily: 'Poppins' }}>Matrícula (Numérica)</MenuItem>
            <MenuItem value="ativo" sx={{ fontFamily: 'Poppins' }}>Status: Ativo</MenuItem>
            <MenuItem value="provisoria" sx={{ fontFamily: 'Poppins' }}>Status: Senha Provisória</MenuItem>
          </Select>
        </FormControl>

        <TextField
          placeholder="Buscar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
          <SearchIcon sx={{ color: '#1F1D2B' }} />
              </InputAdornment>
            ),
            sx: {
              fontFamily: 'Poppins',
              '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#1F1D2B'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: '#1F1D2B'
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: '#1F1D2B'
              }
            }
          }}
          InputLabelProps={{
            sx: { color: '#000000' }
          }}
          inputProps={{
            style: { color: '#000000' },
          }}
          FormHelperTextProps={{
            sx: { color: '#000000' }
          }}
          sx={{
            minWidth: 300,
            '& .MuiInputBase-input::placeholder': {
              color: '#000000',
              opacity: 1,
              fontFamily: 'Poppins'
            }
          }}
        />
            </Box>

        <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontFamily: 'Poppins'}}><strong>Nome Completo</strong></TableCell>
              <TableCell sx={{ fontFamily: 'Poppins'}}><strong>Matrícula</strong></TableCell>
              <TableCell sx={{ fontFamily: 'Poppins'}}><strong>Status</strong></TableCell>
              <TableCell align="center" sx={{ fontFamily: 'Poppins'}}><strong>Ações</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInmates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ fontFamily: 'Poppins', color: '#000000' }}>
                  Nenhum aluno encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredInmates.map((inmate, index) => (
                <TableRow 
                  key={inmate.id} 
                  hover
                  sx={{ 
                    backgroundColor: index % 2 === 0 ? '#D9D9D9' : '#FFFFFF'
                  }}
                >
                  <TableCell sx={{ fontFamily: 'Poppins', color: '#000000' }}>{inmate.full_name}</TableCell>
                  <TableCell sx={{ fontFamily: 'Poppins', color: '#000000' }}>{inmate.matricula}</TableCell>
                  <TableCell sx={{ fontFamily: 'Poppins', color: '#000000' }}>{inmate.status}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => handleEditStudent(inmate)}
                      sx={{
                        padding: '8px',
                        '&:hover': {
                          backgroundColor: 'rgba(31, 29, 43, 0.04)'
                        }
                      }}
                    >
                      <Image 
                        src="/edit.svg" 
                        alt="Editar" 
                        width={24} 
                        height={24}
                      />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      </Box>

      {/* Modal de Edição */}
      <EditInmateModal
        open={openEditModal}
        inmate={selectedInmate}
        onClose={handleCloseEditModal}
        onSave={handleSaveEdit}
        onDelete={handleOpenDeleteDialog}
        submitting={submitting}
      />

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja deletar o aluno <strong>{selectedInmate?.full_name}</strong>?
          </Typography>
          <Typography color="error" sx={{ mt: 2 }}>
            Esta ação não pode ser desfeita!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={submitting}>
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            variant="contained" 
            color="error"
            disabled={submitting}
          >
            {submitting ? 'Deletando...' : 'Deletar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}