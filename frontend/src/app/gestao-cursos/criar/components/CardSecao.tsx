import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Typography,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { CardAula } from './CardAula';

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

interface CardSecaoProps {
  secao: Secao;
  index: number;
  onEditar: (secao: Secao) => void;
  onRemover: (secaoId: string) => void;
  onEditarAula: (secaoId: string, aula: Aula) => void;
  onRemoverAula: (secaoId: string, aulaId: string) => void;
  onAdicionarAula: (secaoId: string) => void;
}

export function CardSecao({
  secao,
  index,
  onEditar,
  onRemover,
  onEditarAula,
  onRemoverAula,
  onAdicionarAula,
}: CardSecaoProps) {
  return (
    <Card
      sx={{
        marginBottom: 2,
        backgroundColor: '#F9F9F9',
        border: '1px solid #E0E0E0',
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: '#000000',
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            {secao.titulo || `Seção ${index + 1}`}
          </Typography>
          <Box>
            <IconButton
              onClick={() => onEditar(secao)}
              sx={{ color: '#1F1D2B' }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={() => onRemover(secao.id)}
              sx={{ color: '#6B1515' }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>

        {secao.subtitulo && (
          <Typography
            variant="body2"
            sx={{
              color: '#666666',
              marginBottom: 1,
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            {secao.subtitulo}
          </Typography>
        )}

        {secao.descricao && (
          <Typography
            variant="body2"
            sx={{
              color: '#666666',
              marginBottom: 2,
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            {secao.descricao}
          </Typography>
        )}

        <Divider sx={{ marginY: 2 }} />

        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            color: '#000000',
            marginBottom: 1,
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          Aulas ({secao.aulas.length})
        </Typography>

        {secao.aulas.map((aula, aulaIndex) => (
          <CardAula
            key={aula.id}
            aula={aula}
            aulaIndex={aulaIndex}
            secaoIndex={index}
            onEditar={(secId, aulaIndex) => onEditarAula(secao.id, secao.aulas[aulaIndex])}
            onRemover={(secId, aulaIndex) => onRemoverAula(secao.id, secao.aulas[aulaIndex].id)}
          />
        ))}

        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => onAdicionarAula(secao.id)}
          fullWidth
          sx={{
            marginTop: 2,
            borderColor: '#1F1D2B',
            color: '#1F1D2B',
            '&:hover': {
              borderColor: '#1F1D2B',
              backgroundColor: 'rgba(31, 29, 43, 0.04)',
            },
            fontFamily: 'Poppins, sans-serif',
            textTransform: 'none',
          }}
        >
          Adicionar Aula
        </Button>
      </CardContent>
    </Card>
  );
}
