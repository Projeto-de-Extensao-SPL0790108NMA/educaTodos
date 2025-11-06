import React from 'react';
import {
  Box,
  IconButton,
  Typography,
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AttachFileIcon from '@mui/icons-material/AttachFile';

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

interface CardAulaProps {
  aula: Aula;
  aulaIndex: number;
  secaoIndex: number;
  onEditar: (secaoIndex: number, aulaIndex: number) => void;
  onRemover: (secaoIndex: number, aulaIndex: number) => void;
}

export function CardAula({
  aula,
  aulaIndex,
  secaoIndex,
  onEditar,
  onRemover,
}: CardAulaProps) {
  return (
    <Box
      sx={{
        padding: 2,
        marginBottom: 1,
        backgroundColor: '#FFFFFF',
        border: '1px solid #E0E0E0',
        borderRadius: '4px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 500,
            color: '#000000',
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          {aula.titulo || `Aula ${aulaIndex + 1}`}
        </Typography>
        {aula.subtitulo && (
          <Typography
            variant="body2"
            sx={{
              color: '#666666',
              fontSize: '0.85rem',
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            {aula.subtitulo}
          </Typography>
        )}
        <Box sx={{ display: 'flex', gap: 1, marginTop: 1, flexWrap: 'wrap' }}>
          {aula.duracao_minutos && (
            <Chip
              label={`${aula.duracao_minutos} min`}
              size="small"
              sx={{
                backgroundColor: '#EDEDED',
                color: '#000000',
                fontFamily: 'Poppins, sans-serif',
              }}
            />
          )}
          {aula.video && (
            <Chip
              label="Vídeo"
              size="small"
              sx={{
                backgroundColor: '#1F1D2B',
                color: '#FFFFFF',
                fontFamily: 'Poppins, sans-serif',
              }}
            />
          )}
          {aula.anexos && aula.anexos.length > 0 && (
            <Chip
              icon={<AttachFileIcon sx={{ color: '#FFFFFF !important' }} />}
              label={`${aula.anexos.length} anexo(s)`}
              size="small"
              sx={{
                backgroundColor: '#1F1D2B',
                color: '#FFFFFF',
                fontFamily: 'Poppins, sans-serif',
              }}
            />
          )}
        </Box>
      </Box>
      <Box>
        <IconButton
          onClick={() => onEditar(secaoIndex, aulaIndex)}
          sx={{ color: '#1F1D2B' }}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          onClick={() => onRemover(secaoIndex, aulaIndex)}
          sx={{ color: '#6B1515' }}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
