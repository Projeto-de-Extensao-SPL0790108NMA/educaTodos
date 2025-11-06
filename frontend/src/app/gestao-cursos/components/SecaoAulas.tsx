import React from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { CardSecao } from '../criar/components';

interface Anexo {
  id: string;
  titulo: string;
  arquivo: File | null;
}

interface Aula {
  id: string;
  titulo: string;
  subtitulo: string;
  descricao: string;
  video: File | null;
  duracao_minutos: string;
  anexos: Anexo[];
}

interface Secao {
  id: string;
  titulo: string;
  subtitulo: string;
  descricao_subtitulo: string;
  descricao: string;
  aulas: Aula[];
}

interface SecaoAulasProps {
  secoes: Secao[];
  onEditarSecao: (secao: Secao) => void;
  onRemoverSecao: (secaoId: string) => void;
  onEditarAula: (secaoId: string, aula: Aula) => void;
  onRemoverAula: (secaoId: string, aulaId: string) => void;
  onAdicionarAula: (secaoId: string) => void;
  onAdicionarSecao: () => void;
}

export default function SecaoAulas({
  secoes,
  onEditarSecao,
  onRemoverSecao,
  onEditarAula,
  onRemoverAula,
  onAdicionarAula,
  onAdicionarSecao,
}: SecaoAulasProps) {
  return (
    <Paper
      elevation={3}
      sx={{
        padding: 3,
        backgroundColor: '#FFFFFF',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          marginBottom: 2,
          fontWeight: 600,
          color: '#000000',
          fontFamily: 'Poppins, sans-serif',
        }}
      >
        Seções e Aulas
      </Typography>

      {secoes.map((secao, index) => (
        <CardSecao
          key={secao.id}
          secao={secao}
          index={index}
          onEditar={onEditarSecao}
          onRemover={onRemoverSecao}
          onEditarAula={onEditarAula}
          onRemoverAula={onRemoverAula}
          onAdicionarAula={onAdicionarAula}
        />
      ))}

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onAdicionarSecao}
        fullWidth
        sx={{
          backgroundColor: '#1F1D2B',
          color: '#FFFFFF',
          '&:hover': { backgroundColor: '#2a2838' },
          fontFamily: 'Poppins, sans-serif',
          textTransform: 'none',
          padding: '12px',
        }}
      >
        Adicionar Seção
      </Button>
    </Paper>
  );
}
