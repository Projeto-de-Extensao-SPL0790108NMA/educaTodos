'use client'

import React, { useState, useEffect } from 'react'
import { 
  Container, 
  Typography, 
  Box, 
  Paper,
  CircularProgress
} from '@mui/material'
import { apiFetch } from '@/services/apiClient'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function VisaoGeralPage() {
  const [loading, setLoading] = useState(true)
  const [novosAlunos, setNovosAlunos] = useState(0)

  useEffect(() => {
    fetchNovosAlunos()
  }, [])

  const fetchNovosAlunos = async () => {
    try {
      setLoading(true)
      const response = await apiFetch('/api/accounts/admin/inmates/list/', {
        method: 'GET'
      })
      
      // Filtrar alunos criados nos últimos 2 meses
      const doisMesesAtras = new Date()
      doisMesesAtras.setMonth(doisMesesAtras.getMonth() - 2)
      
      const alunosRecentes = response.filter((inmate: any) => {
        const dataCriacao = new Date(inmate.created_at)
        return dataCriacao >= doisMesesAtras
      })
      
      setNovosAlunos(alunosRecentes.length)
    } catch (err) {
      console.error('Erro ao buscar alunos:', err)
    } finally {
      setLoading(false)
    }
  }

  // Dados fictícios para demonstração
  const stats = {
    certificadosEmitidos: 128,
    horasAssistidas: 3420
  }

  const alunosPorCurso = [
    { curso: 'Matemática Básica', alunos: 35 },
    { curso: 'Português', alunos: 42 },
    { curso: 'História do Brasil', alunos: 28 },
    { curso: 'Ciências', alunos: 31 },
    { curso: 'Inglês Básico', alunos: 25 }
  ]

  const desempenhoPorCurso = [
    { curso: 'Matemática', desempenho: 78 },
    { curso: 'Português', desempenho: 85 },
    { curso: 'História', desempenho: 72 },
    { curso: 'Ciências', desempenho: 81 },
    { curso: 'Inglês', desempenho: 88 }
  ]

  const COLORS = ['#1F1D2B', '#6B1515', '#2C5F2D', '#FFA500', '#4169E1']

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
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
          Visão Geral
        </Typography>
      </Box>

      <Box sx={{ backgroundColor: '#EDEDED', padding: 3, borderRadius: 2 }}>
        {/* Três caixas de estatísticas */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
          <Box
            sx={{
              flex: '1 1 300px',
              backgroundColor: '#1F1D2B',
              padding: 3,
              borderRadius: 2,
              textAlign: 'center'
            }}
          >
            <Typography
              sx={{
                color: '#FFFFFF',
                fontFamily: 'Poppins',
                fontWeight: 500,
                fontSize: '20px',
                mb: 1
              }}
            >
              Novos Alunos
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <Typography
                sx={{
                  color: '#FFFFFF',
                  fontFamily: 'Poppins',
                  fontWeight: 700,
                  fontSize: '48px'
                }}
              >
                {loading ? <CircularProgress size={48} sx={{ color: '#FFFFFF' }} /> : novosAlunos}
              </Typography>
              <img 
                src="/plusavatar.svg" 
                alt="Certificado" 
                style={{ width: 30, height: 30 }} 
              />
            </Box>
          </Box>

            <Box
              sx={{
                flex: '1 1 300px',
                backgroundColor: '#1F1D2B',
                padding: 3,
                borderRadius: 2,
                textAlign: 'center'
              }}
            >
              <Typography
                sx={{
                  color: '#FFFFFF',
                  fontFamily: 'Poppins',
                  fontWeight: 500,
                  fontSize: '20px',
                  mb: 1
                }}
              >
                Certificados Emitidos
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <Typography
                  sx={{
                    color: '#FFFFFF',
                    fontFamily: 'Poppins',
                    fontWeight: 700,
                    fontSize: '48px'
                  }}
                >
                  + {stats.certificadosEmitidos}
                </Typography>
                <img 
                  src="/flag.svg" 
                  alt="Certificado" 
                  style={{ width: 30, height: 30 }} 
                />
              </Box>
            </Box>

          <Box
            sx={{
              flex: '1 1 300px',
              backgroundColor: '#1F1D2B',
              padding: 3,
              borderRadius: 2,
              textAlign: 'center'
            }}
          >
            <Typography
              sx={{
                color: '#FFFFFF',
                fontFamily: 'Poppins',
                fontWeight: 500,
                fontSize: '20px',
                mb: 1
              }}
            >
              Horas Assistidas
            </Typography>
            <Typography
              sx={{
              color: '#FFFFFF',
              fontFamily: 'Poppins',
              fontWeight: 700,
              fontSize: '48px'
              }}
            >
              {stats.horasAssistidas.toLocaleString('pt-BR')}H
            </Typography>
          </Box>
        </Box>

        {/* Título Desempenho Total */}
        <Typography
          sx={{
            color: '#1F1D2B',
            fontFamily: 'Poppins',
            fontWeight: 700,
            fontSize: '32px',
            mb: 3
          }}
        >
          Desempenho Total
        </Typography>

        {/* Dois gráficos lado a lado */}
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {/* Gráfico: Alunos por Curso */}
          <Box sx={{ flex: '1 1 400px' }}>
            <Typography
              sx={{
                color: '#1F1D2B',
                fontFamily: 'Poppins',
                fontWeight: 600,
                fontSize: '24px',
                mb: 2
              }}
            >
              Alunos por Curso
            </Typography>
            <Paper sx={{ padding: 2, backgroundColor: '#FFFFFF' }}>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={alunosPorCurso}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.alunos}`}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="alunos"
                  >
                    {alunosPorCurso.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ fontFamily: 'Poppins', fontSize: '12px' }}
                    formatter={(value, name, props: any) => [`${value} alunos`, props.payload.curso]}
                  />
                  <Legend 
                    wrapperStyle={{ fontFamily: 'Poppins', fontSize: '12px' }}
                    formatter={(value, entry: any) => entry.payload.curso}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Box>

          {/* Gráfico: Desempenho por Curso */}
          <Box sx={{ flex: '1 1 400px' }}>
            <Typography
              sx={{
                color: '#1F1D2B',
                fontFamily: 'Poppins',
                fontWeight: 600,
                fontSize: '24px',
                mb: 2,
                textAlign: 'center'
              }}
            >
              Desempenho por Curso
            </Typography>
            <Paper sx={{ padding: 2, backgroundColor: '#FFFFFF', display: 'flex', justifyContent: 'center' }}>
              <ResponsiveContainer width="90%" height={250}>
                <BarChart data={desempenhoPorCurso} margin={{ top: 5, right: 10, left: 10, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                  <XAxis 
                    dataKey="curso" 
                    angle={-45}
                    textAnchor="end"
                    height={50}
                    style={{ fontFamily: 'Poppins', fontSize: '10px' }}
                    stroke="#000000"
                  />
                  <YAxis 
                    domain={[0, 100]}
                    style={{ fontFamily: 'Poppins', fontSize: '10px' }}
                    stroke="#000000"
                  />
                  <Tooltip 
                    contentStyle={{ fontFamily: 'Poppins', fontSize: '11px', backgroundColor: '#FFFFFF', border: '1px solid #1F1D2B' }}
                    formatter={(value) => [`${value}%`, 'Desempenho Médio']}
                  />
                  <Bar dataKey="desempenho" fill="#1F1D2B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}
