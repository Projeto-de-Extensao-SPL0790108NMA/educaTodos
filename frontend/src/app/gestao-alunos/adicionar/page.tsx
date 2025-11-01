'use client'

import React, { useState } from 'react'
import { 
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper
} from '@mui/material'
import { useAuth } from '@/providers/AuthProvider'
import { apiFetch } from '@/services/apiClient'

/**
 * Página para adicionar novos alunos (detentos) ao sistema.
 * 
 * Funcionalidades:
 * - Proteção de rota (apenas usuários autenticados)
 * - Máscara automática dd/mm/aaaa para data de nascimento
 * - Validação realista de data (idade entre 10 e 120 anos)
 * - Validação completa de campos conforme backend
 * - Exibição da matrícula gerada após criação
 * 
 * Nota: O backend atual não persiste birth_date (apenas full_name e password).
 * A data é validada no frontend para futura integração.
 */
export default function AdicionarAlunoPage() {
  const { user, loading } = useAuth()

  const [formData, setFormData] = useState({
    nome: '',
    dataNascimento: '',
    senha: '',
    confirmSenha: ''
  })

  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [success, setSuccess] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [createdInmate, setCreatedInmate] = useState<{ name: string; registration_number: string; password: string } | null>(null)

  // Aplica máscara dd/mm/aaaa automaticamente
  const applyDateMask = (value: string): string => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 2) return numbers
    if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`
  }

  // Converte dd/mm/aaaa para aaaa-mm-dd
  const convertToISO = (dateStr: string): string => {
    if (!dateStr) return ''
    if (dateStr.includes('-')) return dateStr // Já está no formato ISO
    
    const parts = dateStr.split('/')
    if (parts.length === 3) {
      const [day, month, year] = parts
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }
    return dateStr
  }

  // Valida data no formato dd/mm/aaaa com verificações rigorosas
  const isValidDate = (dateStr: string): { valid: boolean; message?: string } => {
    if (!dateStr || dateStr.length !== 10) {
      return { valid: false, message: 'Data incompleta. Use dd/mm/aaaa' }
    }
    
    const parts = dateStr.split('/')
    if (parts.length !== 3) {
      return { valid: false, message: 'Formato inválido. Use dd/mm/aaaa' }
    }
    
    const [day, month, year] = parts.map(Number)
    
    // Verifica se são números válidos
    if (isNaN(day) || isNaN(month) || isNaN(year) || !day || !month || !year) {
      return { valid: false, message: 'Data inválida - use apenas números' }
    }
    
    // Validações de limites realistas
    const currentYear = new Date().getFullYear()
    const currentDate = new Date()
    const minYear = 1920 // Idade máxima realista (103 anos em 2023)
    const maxYear = currentYear - 16 // Mínimo 16 anos de idade para detentos
    
    if (year < minYear) {
      return { valid: false, message: `Ano muito antigo. Use ano a partir de ${minYear}` }
    }
    
    if (year > maxYear) {
      return { valid: false, message: `Idade mínima de 16 anos. Use ano até ${maxYear}` }
    }
    
    // Validação de mês
    if (month < 1 || month > 12) {
      return { valid: false, message: 'Mês inválido. Use valores de 1 a 12' }
    }
    
    // Validação rigorosa de dias por mês (com ano bissexto)
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
    const daysInMonth = [
      31, // Janeiro
      isLeapYear ? 29 : 28, // Fevereiro
      31, // Março
      30, // Abril
      31, // Maio
      30, // Junho
      31, // Julho
      31, // Agosto
      30, // Setembro
      31, // Outubro
      30, // Novembro
      31  // Dezembro
    ]
    
    const maxDaysForMonth = daysInMonth[month - 1]
    
    if (day < 1 || day > maxDaysForMonth) {
      const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                          'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
      return { 
        valid: false, 
        message: `${monthNames[month - 1]} tem apenas ${maxDaysForMonth} dias` 
      }
    }
    
    // Cria objeto Date e valida se é uma data real
    const birthDate = new Date(year, month - 1, day)
    
    // Verifica se o objeto Date criou uma data válida
    // (JavaScript pode criar datas inválidas que precisam ser checadas)
    if (birthDate.getDate() !== day || 
        birthDate.getMonth() !== month - 1 || 
        birthDate.getFullYear() !== year) {
      return { valid: false, message: 'Data inexistente no calendário' }
    }
    
    // Verifica se a data não é futura
    if (birthDate > currentDate) {
      return { valid: false, message: 'Data de nascimento não pode ser futura' }
    }
    
    // Verifica se a data não é muito recente (menos de 16 anos)
    const sixteenYearsAgo = new Date()
    sixteenYearsAgo.setFullYear(currentYear - 16)
    if (birthDate > sixteenYearsAgo) {
      return { valid: false, message: 'Idade mínima de 16 anos não atingida' }
    }
    
    return { valid: true }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    if (name === 'dataNascimento') {
      const masked = applyDateMask(value)
      setFormData(prev => ({ ...prev, [name]: masked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const validar = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome completo é obrigatório.'
    } else if (formData.nome.trim().length < 3) {
      newErrors.nome = 'Nome deve ter pelo menos 3 caracteres.'
    }
    
    if (!formData.dataNascimento) {
      newErrors.dataNascimento = 'Data de Nascimento é obrigatória.'
    } else {
      const dateValidation = isValidDate(formData.dataNascimento)
      if (!dateValidation.valid) {
        newErrors.dataNascimento = dateValidation.message || 'Data inválida.'
      }
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
    setSuccess(null)
    setCreatedInmate(null)
    
    const newErrors = validar()
    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      setSubmitting(true)
      
      try {
        // Payload conforme esperado pelo backend (AdminCreateInmateSerializer)
        const payload = {
          full_name: formData.nome.trim(),
          password: formData.senha,
          // Nota: birth_date não é usado pelo backend atual, mas podemos adicionar como metadata futuramente
        }

        // Endpoint correto conforme backend
        const response = await apiFetch("/api/accounts/admin/inmates/", {
          method: "POST",
          body: JSON.stringify(payload),
        })

        setSuccess('Aluno criado com sucesso!')
        setCreatedInmate({
          name: response.nome_completo || response.full_name || formData.nome,
          registration_number: response.matricula || 'N/A',
          password: formData.senha // Salva a senha para exibir
        })

        // Limpa o formulário
        setFormData({
          nome: '',
          dataNascimento: '',
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

  if (loading) return null

  // Verifica se o usuário está autenticado e é staff (admin)
  if (!user || !user.is_staff) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 4, mb: 4 }}>
          <Alert severity="error">
            Acesso negado. Apenas administradores podem adicionar alunos.
          </Alert>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gestão de Alunos &gt; Adicionar novo aluno
        </Typography>

        {success && createdInmate && (
          <Alert severity="success" sx={{ mb: 2 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>✓ Aluno criado com sucesso!</strong>
            </Typography>
            <Typography variant="body2">
              <strong>Nome:</strong> {createdInmate.name}
            </Typography>
            <Typography variant="body2">
              <strong>Matrícula gerada:</strong> {createdInmate.registration_number}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: 'warning.main' }}>
              <strong>Senha criada:</strong> {createdInmate.password}
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', mt: 1, fontStyle: 'italic' }}>
              ⚠️ Guarde essa senha! Ela não será exibida novamente.
            </Typography>
          </Alert>
        )}

        {errors.api && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.api}
          </Alert>
        )}

        <Paper sx={{ p: 3 }}>
          <Box 
            component="form" 
            onSubmit={handleSubmit} 
            noValidate 
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              id="nome"
              name="nome"
              label="Nome do aluno"
              fullWidth
              value={formData.nome}
              onChange={handleChange}
              error={!!errors.nome}
              helperText={errors.nome}
            />

            <TextField
              id="dataNascimento"
              name="dataNascimento"
              label="Data de Nascimento (dd/mm/aaaa)"
              type="text"
              fullWidth
              value={formData.dataNascimento}
              onChange={handleChange}
              error={!!errors.dataNascimento}
              helperText={errors.dataNascimento || 'Digite no formato dd/mm/aaaa'}
              placeholder="dd/mm/aaaa"
              inputProps={{ maxLength: 10 }}
            />

            <TextField
              id="senha"
              name="senha"
              label="Senha de Acesso"
              type="password"
              fullWidth
              value={formData.senha}
              onChange={handleChange}
              error={!!errors.senha}
              helperText={errors.senha}
            />

            <TextField
              id="confirmSenha"
              name="confirmSenha"
              label="Confirmar senha"
              type="password"
              fullWidth
              value={formData.confirmSenha}
              onChange={handleChange}
              error={!!errors.confirmSenha}
              helperText={errors.confirmSenha}
            />

            <Box sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={submitting}
              >
                {submitting ? 'Adicionando...' : 'Adicionar Aluno'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}