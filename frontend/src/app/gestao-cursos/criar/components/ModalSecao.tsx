import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from '@mui/material';

interface TempSecao {
  titulo?: string;
  subtitulo?: string;
  descricao_subtitulo?: string;
  descricao?: string;
}

interface Secao {
  id: string;
  titulo: string;
  subtitulo: string;
  descricao_subtitulo: string;
  descricao: string;
  aulas: any[];
}

interface ModalSecaoProps {
  aberto: boolean;
  secaoEmEdicao: Secao | null;
  tempSecao: TempSecao;
  setTempSecao: (secao: TempSecao) => void;
  onFechar: () => void;
  onSalvar: () => void;
}

export function ModalSecao({
  aberto,
  secaoEmEdicao,
  tempSecao,
  setTempSecao,
  onFechar,
  onSalvar,
}: ModalSecaoProps) {
  return (
    <Dialog open={aberto} onClose={onFechar} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          fontWeight: 600,
          color: '#000000',
          fontFamily: 'Poppins, sans-serif',
        }}
      >
        {secaoEmEdicao ? 'Editar Seção' : 'Nova Seção'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 1 }}>
          <TextField
            label="Título da Seção"
            value={tempSecao.titulo || ''}
            onChange={(e) =>
              setTempSecao({ ...tempSecao, titulo: e.target.value })
            }
            required
            fullWidth
            sx={{
              backgroundColor: '#FFFFFF',
              '& .MuiInputBase-input': { color: '#000000' },
              '& .MuiInputLabel-root': { color: '#000000' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#000000' },
                '&:hover fieldset': { borderColor: '#000000' },
                '&.Mui-focused fieldset': { borderColor: '#1F1D2B' },
              },
            }}
          />

          <TextField
            label="Subtítulo da Seção"
            value={tempSecao.subtitulo || ''}
            onChange={(e) =>
              setTempSecao({ ...tempSecao, subtitulo: e.target.value })
            }
            fullWidth
            sx={{
              backgroundColor: '#FFFFFF',
              '& .MuiInputBase-input': { color: '#000000' },
              '& .MuiInputLabel-root': { color: '#000000' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#000000' },
                '&:hover fieldset': { borderColor: '#000000' },
                '&.Mui-focused fieldset': { borderColor: '#1F1D2B' },
              },
            }}
          />

          <TextField
            label="Descrição do Subtítulo"
            value={tempSecao.descricao_subtitulo || ''}
            onChange={(e) =>
              setTempSecao({ ...tempSecao, descricao_subtitulo: e.target.value })
            }
            fullWidth
            sx={{
              backgroundColor: '#FFFFFF',
              '& .MuiInputBase-input': { color: '#000000' },
              '& .MuiInputLabel-root': { color: '#000000' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#000000' },
                '&:hover fieldset': { borderColor: '#000000' },
                '&.Mui-focused fieldset': { borderColor: '#1F1D2B' },
              },
            }}
          />

          <TextField
            label="Descrição da Seção"
            value={tempSecao.descricao || ''}
            onChange={(e) =>
              setTempSecao({ ...tempSecao, descricao: e.target.value })
            }
            fullWidth
            multiline
            rows={4}
            sx={{
              backgroundColor: '#FFFFFF',
              '& .MuiInputBase-input': { color: '#000000' },
              '& .MuiInputLabel-root': { color: '#000000' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#000000' },
                '&:hover fieldset': { borderColor: '#000000' },
                '&.Mui-focused fieldset': { borderColor: '#1F1D2B' },
              },
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onFechar}
          sx={{
            color: '#000000',
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={onSalvar}
          variant="contained"
          sx={{
            backgroundColor: '#1F1D2B',
            color: '#FFFFFF',
            '&:hover': { backgroundColor: '#2a2838' },
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
