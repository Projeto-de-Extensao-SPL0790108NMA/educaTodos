'use client'

import React, { useState, useEffect } from 'react'
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton
} from '@mui/material'
import { useRouter } from 'next/navigation'
import { apiFetch } from '@/services/apiClient'

interface Inmate {
  id: string
  full_name: string
  matricula: string
  status: string
  created_at: string
  must_change_password: boolean
}

interface EditFormData {
  full_name: string
  password: string
  confirmPassword: string
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
  const [editFormData, setEditFormData] = useState<EditFormData>({
    full_name: '',
    password: '',
    confirmPassword: '',
    must_change_password: false
  })
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
    setEditFormData({
      full_name: inmate.full_name,
      password: '',
      confirmPassword: '',
      must_change_password: inmate.must_change_password
    })
    setOpenEditModal(true)
  }

  const handleCloseEditModal = () => {
    setOpenEditModal(false)
    setSelectedInmate(null)
    setEditFormData({
      full_name: '',
      password: '',
      confirmPassword: '',
      must_change_password: false
    })
    setError(null)
  }

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleStatusChange = (e: any) => {
    setEditFormData(prev => ({
      ...prev,
      must_change_password: e.target.value === 'provisoria'
    }))
  }

  const handleSaveEdit = async () => {
    if (!selectedInmate) return

    // Validação de senha
    if (editFormData.password && editFormData.password !== editFormData.confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    if (editFormData.password && editFormData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const updateData: any = {
        full_name: editFormData.full_name,
        must_change_password: editFormData.must_change_password
      }

      // Adiciona senha apenas se foi fornecida
      if (editFormData.password) {
        updateData.password = editFormData.password
      }

      await apiFetch(`/api/accounts/admin/inmates/${selectedInmate.id}/`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      })

      // Recarrega a lista
      await fetchInmates()
      handleCloseEditModal()
    } catch (err) {
      console.error('Erro ao atualizar aluno:', err)
      setError(err instanceof Error ? err.message : 'Erro ao atualizar aluno')
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
        <Typography variant="h4" component="h1">
          Gestão de Alunos
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleAddStudent}
        >
          Adicionar Aluno
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Nome Completo</strong></TableCell>
              <TableCell><strong>Matrícula</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="center"><strong>Ações</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inmates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Nenhum aluno cadastrado
                </TableCell>
              </TableRow>
            ) : (
              inmates.map((inmate) => (
                <TableRow key={inmate.id} hover>
                  <TableCell>{inmate.full_name}</TableCell>
                  <TableCell>{inmate.matricula}</TableCell>
                  <TableCell>{inmate.status}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleEditStudent(inmate)}
                    >
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de Edição */}
      <Dialog open={openEditModal} onClose={handleCloseEditModal} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Aluno</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Nome Completo"
            name="full_name"
            value={editFormData.full_name}
            onChange={handleEditFormChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Matrícula"
            value={selectedInmate?.matricula || ''}
            margin="normal"
            disabled
            helperText="A matrícula não pode ser alterada"
          />

          <TextField
            fullWidth
            label="Nova Senha (opcional)"
            name="password"
            type="password"
            value={editFormData.password}
            onChange={handleEditFormChange}
            margin="normal"
            helperText="Deixe em branco para não alterar a senha"
          />

          <TextField
            fullWidth
            label="Confirmar Nova Senha"
            name="confirmPassword"
            type="password"
            value={editFormData.confirmPassword}
            onChange={handleEditFormChange}
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={editFormData.must_change_password ? 'provisoria' : 'ativo'}
              onChange={handleStatusChange}
              label="Status"
            >
              <MenuItem value="ativo">Ativo</MenuItem>
              <MenuItem value="provisoria">Senha Provisória</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
          <Button 
            onClick={() => {
              handleCloseEditModal()
              if (selectedInmate) {
                handleOpenDeleteDialog(selectedInmate)
              }
            }} 
            color="error"
            disabled={submitting}
          >
            Deletar Aluno
          </Button>
          <Box>
            <Button onClick={handleCloseEditModal} disabled={submitting} sx={{ mr: 1 }}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveEdit} 
              variant="contained" 
              disabled={submitting}
            >
              {submitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

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