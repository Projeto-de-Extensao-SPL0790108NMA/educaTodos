'use client'

import React from 'react'
import { Container, Typography, Paper } from '@mui/material'

export default function GestaoCursosPage() {
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gestão de Cursos
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Aqui você poderá gerenciar os cursos cadastrados no sistema.
        </Typography>
      </Paper>
    </Container>
  )
}
