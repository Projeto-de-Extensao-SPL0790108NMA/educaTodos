'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
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
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: '#EDEDED',
          color: '#000000',
          border: '1px solid #000000'
        }
      }}
    >
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 2 }}>
          <Box sx={{ mb: 1, color: '#000000', fontSize: '14px', fontWeight: 400 }}>
            NOME DO ALUNO
          </Box>
          <TextField
            fullWidth
            name="full_name"
            value={editFormData.full_name}
            onChange={handleEditFormChange}
            required
            sx={{
              '& .MuiInputBase-root': {
                color: '#000000',
                backgroundColor: '#FFFFFF'
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#000000'
              },
              '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#000000'
              },
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#000000'
              }
            }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ mb: 1, color: '#000000', fontSize: '14px', fontWeight: 400 }}>
            MATRÍCULA
          </Box>
          <TextField
            fullWidth
            value={inmate?.matricula || ''}
            disabled
            helperText="A matrícula não pode ser alterada"
            sx={{
              '& .MuiInputBase-root': {
                color: '#000000',
                backgroundColor: '#FFFFFF'
              },
              '& .MuiInputBase-input.Mui-disabled': {
                WebkitTextFillColor: '#000000',
                color: '#000000'
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#000000'
              },
              '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline': {
                borderColor: '#000000'
              },
              '& .MuiFormHelperText-root': {
                color: '#000000'
              },
              '& .MuiFormHelperText-root.Mui-disabled': {
                color: '#000000'
              }
            }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ mb: 1, color: '#000000', fontSize: '14px', fontWeight: 400 }}>
            NOVA SENHA
          </Box>
          <TextField
            fullWidth
            name="password"
            type="password"
            value={editFormData.password}
            onChange={handleEditFormChange}
            helperText="Deixe em branco para não alterar a senha(opcional)"
            sx={{
              '& .MuiInputBase-root': {
                color: '#000000',
                backgroundColor: '#FFFFFF'
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#000000'
              },
              '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#000000'
              },
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#000000'
              },
              '& .MuiFormHelperText-root': {
                color: '#000000'
              }
            }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ mb: 1, color: '#000000', fontSize: '14px', fontWeight: 400 }}>
            CONFIRMAR NOVA SENHA
          </Box>
          <TextField
            fullWidth
            name="confirmPassword"
            type="password"
            value={editFormData.confirmPassword}
            onChange={handleEditFormChange}
            sx={{
              '& .MuiInputBase-root': {
                color: '#000000',
                backgroundColor: '#FFFFFF'
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#000000'
              },
              '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#000000'
              },
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#000000'
              }
            }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ mb: 1, color: '#000000', fontSize: '14px', fontWeight: 400 }}>
            STATUS
          </Box>
          <FormControl fullWidth>
            <Select
              value={editFormData.must_change_password ? 'provisoria' : 'ativo'}
              onChange={handleStatusChange}
              sx={{
                color: '#000000',
                backgroundColor: '#FFFFFF',
                '& .MuiSelect-icon': {
                  color: '#000000'
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#000000'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#000000'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#000000'
                }
              }}
            >
              <MenuItem value="ativo">Ativo</MenuItem>
              <MenuItem value="provisoria">Senha Provisória</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions sx={{ 
        display: 'flex',
        flexDirection: 'column', 
        alignItems: 'stretch',
        justifyContent: 'center',
        px: 3, 
        pb: 3, 
        gap: 2,
        '& > *': {
          marginLeft: 'auto !important',
          marginRight: 'auto !important'
        }
      }}>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          disabled={submitting}
          sx={{
            width: '200px',
            minWidth: '200px',
            maxWidth: '200px',
            margin: '0 auto',
            backgroundColor: '#1F1D2B',
            color: '#FFFFFF',
            fontFamily: 'Poppins',
            fontWeight: 500,
            textAlign: 'center',
            justifyContent: 'center',
            '&:hover': {
              backgroundColor: '#2a2836'
            },
            '&:disabled': {
              backgroundColor: '#1F1D2B',
              opacity: 0.6
            }
          }}
        >
          {submitting ? 'Salvando...' : 'Confirmar'}
        </Button>
        <Button 
          onClick={handleDelete} 
          variant="contained"
          disabled={submitting}
          sx={{
            width: '200px',
            minWidth: '200px',
            maxWidth: '200px',
            margin: '0 auto',
            backgroundColor: '#6B1515',
            color: '#FFFFFF',
            fontFamily: 'Poppins',
            fontWeight: 500,
            textAlign: 'center',
            justifyContent: 'center',
            '&:hover': {
              backgroundColor: '#8a1c1c'
            },
            '&:disabled': {
              backgroundColor: '#6B1515',
              opacity: 0.6
            }
          }}
        >
          Deletar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
