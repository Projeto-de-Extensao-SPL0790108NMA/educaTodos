import React from 'react';
import {
  Box,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Menu,
} from '@mui/material';
import UploadImageField from './UploadImageField';

interface FormularioCursoProps {
  titulo: string;
  setTitulo: (value: string) => void;
  subtitulo: string;
  setSubtitulo: (value: string) => void;
  categoria: string;
  setCategoria: (value: string) => void;
  grauDificuldade: string;
  setGrauDificuldade: (value: string) => void;
  resumo: string;
  setResumo: (value: string) => void;
  isActive: boolean;
  setIsActive: (value: boolean) => void;
  imagemPreview: string;
  onImageChange: (file: File | null) => void;
  labelBotaoImagem?: string;
  embedded?: boolean;
  fieldSize?: 'small' | 'medium';
  fieldSx?: any;
  compact?: boolean;
}

export default function FormularioCurso({
  titulo,
  setTitulo,
  subtitulo,
  setSubtitulo,
  categoria,
  setCategoria,
  grauDificuldade,
  setGrauDificuldade,
  resumo,
  setResumo,
  imagemPreview,
  onImageChange,
  fieldSize = 'small',
  fieldSx = {},
  compact = true,
}: FormularioCursoProps) {
  const defaultFieldSx = {
    backgroundColor: 'transparent',
    maxWidth: 720,
    '& .MuiInputBase-input': { color: '#000000', py: fieldSize === 'small' ? '6px' : undefined },
    '& .MuiInputLabel-root': { color: '#000000' },
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      backgroundColor: '#FFFFFF',
      '& fieldset': { borderColor: '#000000' },
      '&:hover fieldset': { borderColor: '#000000' },
      '&.Mui-focused fieldset': { borderColor: '#1F1D2B' },
    },
    ...fieldSx,
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: compact ? 1.5 : 2 }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          color: '#000000',
          fontFamily: 'Poppins, sans-serif',
        }}
      >
        Informações do Curso
      </Typography>

      <TextField
        size={fieldSize}
        label="Título do Curso"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        required
        fullWidth
        sx={defaultFieldSx}
      />

      <TextField
        size={fieldSize}
        label="Subtítulo do Curso"
        value={subtitulo}
        onChange={(e) => setSubtitulo(e.target.value)}
        fullWidth
        sx={defaultFieldSx}
      />

      <TextField
        size={fieldSize}
        label="Categoria"
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
        required
        fullWidth
        sx={defaultFieldSx}
      />

      <FormControl 
        fullWidth 
        variant='outlined' 
        sx={defaultFieldSx}
      >
        <InputLabel id='grau-dificuldade-label' sx={{ color: '#000000' }}>
          Grau de Dificuldade
        </InputLabel>
        <Select
          labelId='grau-dificuldade-label'
          id='grau-dificuldade'
          size={fieldSize}
          value={grauDificuldade}
          onChange={(e) => setGrauDificuldade(e.target.value)}
          label="Grau de Dificuldade"
          sx={{ 
            color: '#000000',
            borderRadius: '8px',
            '& .MuiSelect-icon':{
              color: '#000000',
            }
          }}
        >
          <MenuItem value="iniciante">Iniciante</MenuItem>
          <MenuItem value="intermediario">Intermediário</MenuItem>
          <MenuItem value="avancado">Avançado</MenuItem>
        </Select>
      </FormControl>

      <TextField
        size={fieldSize}
        label="Resumo"
        value={resumo}
        onChange={(e) => setResumo(e.target.value)}
        required
        fullWidth
        multiline
        rows={4}
        sx={defaultFieldSx}
      />

      <Box>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: '#000000',
            marginBottom: 1,
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          IMAGEM DO CURSO
        </Typography>

        <UploadImageField
          value={null}
          onChange={onImageChange}
          sx={{ maxWidth: 720 }}
        />
      </Box>
    </Box>
  );
}
