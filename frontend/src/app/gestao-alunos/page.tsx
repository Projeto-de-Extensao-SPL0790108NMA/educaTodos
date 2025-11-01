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
  DialogActions
} from '@mui/material'
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