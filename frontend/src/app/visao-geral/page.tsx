'use client'

import React from 'react'
import { Container, Typography, Paper } from '@mui/material'

export default function VisaoGeralPage() {
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Visão Geral
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Aqui você terá uma visão geral dos dados do sistema.
        </Typography>
      </Paper>
    </Container>
  )
}
