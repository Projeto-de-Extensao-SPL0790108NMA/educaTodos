'use client'

import React, { useState } from 'react'
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  IconButton
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { apiFetch } from '@/services/apiClient'

interface AddStudentModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

interface CreatedInmate {
  name: string
  registration_number: string
  username: string
  password: string
}

export default function AddStudentModal({ open, onClose, onSuccess }: AddStudentModalProps) {
  const [formData, setFormData] = useState({
    nome: '',
    senha: '',
    confirmSenha: ''
  })

  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [submitting, setSubmitting] = useState(false)
  const [createdInmate, setCreatedInmate] = useState<CreatedInmate | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleClose = () => {
    if (!submitting) {
      setFormData({ nome: '', senha: '', confirmSenha: '' })
      setErrors({})
      setCreatedInmate(null)
      setShowSuccessModal(false)
      onClose()
    }
  }

  const handleCreateAnother = () => {
    setShowSuccessModal(false)
    setCreatedInmate(null)
    setFormData({ nome: '', senha: '', confirmSenha: '' })
    setErrors({})
  }

  const handleGoToManagement = () => {
    handleClose()
    onSuccess()
  }

  const validar = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome completo é obrigatório.'
    } else if (formData.nome.trim().length < 3) {
      newErrors.nome = 'Nome deve ter pelo menos 3 caracteres.'
    }
    
    if (!formData.senha) {
      newErrors.senha = 'Senha é obrigatória.'
    } else if (formData.senha.length < 6) {
      newErrors.senha = 'Senha deve ter pelo menos 6 caracteres.'
    }
    
    if (formData.senha !== formData.confirmSenha) {
      newErrors.confirmSenha = 'As senhas não coincidem.'
    }
    
    return newErrors
  }

  const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    
    const newErrors = validar()
    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      setSubmitting(true)
      
      try {
        const payload = {
          full_name: formData.nome.trim(),
          password: formData.senha,
        }

        const response = await apiFetch("/api/accounts/admin/inmates/", {
          method: "POST",
          body: JSON.stringify(payload),
        })

        setCreatedInmate({
          name: response.nome_completo || response.full_name || formData.nome,
          registration_number: response.matricula || 'N/A',
          username: response.username || 'N/A',
          password: formData.senha
        })
        setShowSuccessModal(true)

        // Limpa o formulário
        setFormData({
          nome: '',
          senha: '',
          confirmSenha: ''
        })
        setErrors({})
        
      } catch (error: any) {
        const errorMsg = error?.message || 'Erro ao criar aluno'
        setErrors({ api: errorMsg })
      } finally {
        setSubmitting(false)
      }
    }
  }

  return (
    <>
      {/* Modal Principal de Adicionar Aluno */}
      <Dialog 
        open={open && !showSuccessModal} 
        onClose={handleClose}
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#EDEDED',
            color: '#000000',
            borderRadius: 2
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid #000000',
          pb: 2
        }}>
          <Typography  sx={{ color: '#000000', fontFamily: 'Poppins', fontWeight: 600 }}>
            Adicionar Novo Aluno
          </Typography>
          <IconButton onClick={handleClose} disabled={submitting}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          {errors.api && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.api}
            </Alert>
          )}

          <Box 
            component="form" 
            id="add-student-form"
            onSubmit={handleSubmit} 
            noValidate 
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <Box>
              <Typography sx={{ mb: 1, color: '#000000', fontSize: '15px', fontWeight: 400, fontFamily: 'Poppins' }}>
                Nome do aluno
              </Typography>
              <TextField
                id="nome"
                name="nome"
                fullWidth
                value={formData.nome}
                onChange={handleChange}
                error={!!errors.nome}
                helperText={errors.nome}
                sx={{
                  '& .MuiInputBase-root': {
                    backgroundColor: '#FFFFFF',
                    color: '#000000',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 400
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
                    color: '#d32f2f',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 400
                  }
                }}
              />
            </Box>

            <Box>
              <Typography sx={{ mb: 1, color: '#000000', fontSize: '15px', fontWeight: 400, fontFamily: 'Poppins' }}>
                Senha de Acesso
              </Typography>
              <TextField
                id="senha"
                name="senha"
                type="password"
                fullWidth
                value={formData.senha}
                onChange={handleChange}
                error={!!errors.senha}
                helperText={errors.senha}
                sx={{
                  '& .MuiInputBase-root': {
                    backgroundColor: '#FFFFFF',
                    color: '#000000',
                    fontFamily: 'Poppins',
                    fontWeight: 400
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
                    color: '#d32f2f',
                    fontFamily: 'Poppins',
                    fontWeight: 400
                  }
                }}
              />
            </Box>

            <Box>
              <Typography sx={{ mb: 1, color: '#000000', fontSize: '15px', fontWeight: 400, fontFamily: 'Poppins' }}>
                Confirmar senha
              </Typography>
              <TextField
                id="confirmSenha"
                name="confirmSenha"
                type="password"
                fullWidth
                value={formData.confirmSenha}
                onChange={handleChange}
                error={!!errors.confirmSenha}
                helperText={errors.confirmSenha}
                sx={{
                  '& .MuiInputBase-root': {
                    backgroundColor: '#FFFFFF',
                    color: '#000000',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 400
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
                    color: '#d32f2f',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 400
                  }
                }}
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'center' }}>
          <Button
            type="submit"
            form="add-student-form"
            variant="contained"
            disabled={submitting}
            sx={{
              width: '200px',
              backgroundColor: '#1F1D2B',
              color: '#FFFFFF',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: '#2a2836'
              },
              '&:disabled': {
                backgroundColor: '#1F1D2B',
                opacity: 0.6
              }
            }}
          >
            {submitting ? 'Enviando...' : 'Enviar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Sucesso */}
      <Dialog 
        open={showSuccessModal} 
        onClose={() => {}}
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#EDEDED',
            color: '#000000',
            border: '2px solid #000000',
            borderRadius: 2
          }
        }}
      >
        <DialogContent sx={{ pt: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, color: '#000000', fontFamily: 'Poppins', fontWeight: 600, textAlign: 'center' }}>
            ✓ Aluno criado com sucesso!
          </Typography>
          
          {createdInmate && (
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ mb: 1, color: '#000000', fontFamily: 'Poppins', fontWeight: 400 }}>
                <strong>Nome:</strong> {createdInmate.name}
              </Typography>
              <Typography sx={{ mb: 1, color: '#000000', fontFamily: 'Poppins', fontWeight: 400 }}>
                <strong>Matrícula:</strong> {createdInmate.registration_number}
              </Typography>
              <Typography sx={{ mb: 1, color: '#2C5F2D', fontFamily: 'Poppins', fontWeight: 600, fontSize: '16px' }}>
                <strong>Usuário para login:</strong> {createdInmate.username}
              </Typography>
              <Typography sx={{ mb: 2, color: '#000000', fontFamily: 'Poppins', fontWeight: 400 }}>
                <strong>Senha criada:</strong> {createdInmate.password}
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', color: '#6B1515', fontFamily: 'Poppins', fontWeight: 500, fontStyle: 'italic' }}>
                ⚠️ Guarde essas credenciais! O usuário e a senha não serão exibidos novamente.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ 
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
            onClick={handleGoToManagement}
            variant="contained"
            sx={{
              width: '250px',
              margin: '0 auto',
              backgroundColor: '#1F1D2B',
              color: '#FFFFFF',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 500,
              textAlign: 'center',
              justifyContent: 'center',
              '&:hover': {
                backgroundColor: '#2a2836'
              }
            }}
          >
            Fechar
          </Button>
          <Button 
            onClick={handleCreateAnother}
            variant="contained"
            sx={{
              width: '250px',
              margin: '0 auto',
              backgroundColor: '#1F1D2B',
              color: '#FFFFFF',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 500,
              textAlign: 'center',
              justifyContent: 'center',
              '&:hover': {
                backgroundColor: '#2a2836'
              }
            }}
          >
            Criar Outro Aluno
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
