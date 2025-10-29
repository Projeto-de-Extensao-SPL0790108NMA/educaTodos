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

export default function AdicionarAlunoPage() {
  const [formData, setFormData] = useState({
    nome: '',
    matricula: '',
    dataNascimento: '',
    senha: '',
    confirmSenha: ''
  })

  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [success, setSuccess] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validar = () => {
    const newErrors: {[key: string]: string} = {}
    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório.'
    if (!formData.matricula.trim()) newErrors.matricula = 'Matrícula é obrigatória.'
    if (!formData.dataNascimento) newErrors.dataNascimento = 'Data de Nascimento é obrigatória.'
    if (!formData.senha) newErrors.senha = 'Senha é obrigatória.'
    if (formData.senha && formData.senha.length < 6) newErrors.senha = 'Senha deve ter pelo menos 6 caracteres.'
    if (formData.senha !== formData.confirmSenha) newErrors.confirmSenha = 'As senhas não coincidem.'
    return newErrors
  }

  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    setSuccess(null)
    const newErrors = validar()
    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      // TODO: integrar com API backend para criar o aluno.
      const { senha, confirmSenha, ...novoAluno } = formData
      console.log('Criando aluno:', novoAluno)
      setSuccess('Aluno criado com sucesso (simulado).')

      // reset form
      setFormData({
        nome: '',
        matricula: '',
        dataNascimento: '',
        senha: '',
        confirmSenha: ''
      })
      setErrors({})
    }
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gestão de Alunos &gt; Adicionar novo aluno
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
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
              id="matricula"
              name="matricula"
              label="Matrícula"
              fullWidth
              value={formData.matricula}
              onChange={handleChange}
              error={!!errors.matricula}
              helperText={errors.matricula}
            />

            <TextField
              id="dataNascimento"
              name="dataNascimento"
              label="Data de Nascimento"
              type="date"
              fullWidth
              value={formData.dataNascimento}
              onChange={handleChange}
              error={!!errors.dataNascimento}
              helperText={errors.dataNascimento}
              InputLabelProps={{ shrink: true }}
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
              >
                Adicionar Aluno
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}