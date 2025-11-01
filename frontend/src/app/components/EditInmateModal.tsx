'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Alert
} from '@mui/material'

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

interface EditInmateModalProps {
  open: boolean
  inmate: Inmate | null
  onClose: () => void
  onSave: (inmateId: string, data: any) => Promise<void>
  onDelete: (inmate: Inmate) => void
  submitting: boolean
}

export default function EditInmateModal({
  open,
  inmate,
  onClose,
  onSave,
  onDelete,
  submitting
}: EditInmateModalProps) {
  const [editFormData, setEditFormData] = useState<EditFormData>({
    full_name: '',
    password: '',
    confirmPassword: '',
    must_change_password: false
  })
  const [error, setError] = useState<string | null>(null)

  // Atualiza os dados do formulário quando o inmate mudar
  useEffect(() => {
    if (inmate) {
      setEditFormData({
        full_name: inmate.full_name,
        password: '',
        confirmPassword: '',
        must_change_password: inmate.must_change_password
      })
      setError(null)
    }
  }, [inmate])

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

  const handleSave = async () => {
    if (!inmate) return

    // Validação de senha
    if (editFormData.password && editFormData.password !== editFormData.confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    if (editFormData.password && editFormData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }

    setError(null)

    const updateData: any = {
      full_name: editFormData.full_name,
      must_change_password: editFormData.must_change_password
    }

    // Adiciona senha apenas se foi fornecida
    if (editFormData.password) {
      updateData.password = editFormData.password
    }

    try {
      await onSave(inmate.id, updateData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar aluno')
    }
  }

  const handleDelete = () => {
    if (inmate) {
      onClose()
      onDelete(inmate)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
          value={inmate?.matricula || ''}
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
          onClick={handleDelete} 
          color="error"
          disabled={submitting}
        >
          Deletar Aluno
        </Button>
        <Box>
          <Button onClick={onClose} disabled={submitting} sx={{ mr: 1 }}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            disabled={submitting}
          >
            {submitting ? 'Salvando...' : 'Salvar'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}
