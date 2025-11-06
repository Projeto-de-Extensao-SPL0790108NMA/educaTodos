import React from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  FormControlLabel,
  Switch,
} from '@mui/material';

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
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  labelBotaoImagem?: string;
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
  isActive,
  setIsActive,
  imagemPreview,
  onImageChange,
  labelBotaoImagem = 'Upload Imagem do Curso',
}: FormularioCursoProps) {
  return (
    <Paper
      elevation={3}
      sx={{
        padding: 3,
        backgroundColor: '#FFFFFF',
        height: 'fit-content',
        position: 'sticky',
        top: 20,
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
        Informações do Curso
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Título do Curso"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
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
          label="Subtítulo do Curso"
          value={subtitulo}
          onChange={(e) => setSubtitulo(e.target.value)}
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
          label="Categoria"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
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

        <FormControl
          fullWidth
          sx={{
            backgroundColor: '#FFFFFF',
            '& .MuiInputLabel-root': { color: '#000000' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#000000' },
              '&:hover fieldset': { borderColor: '#000000' },
              '&.Mui-focused fieldset': { borderColor: '#1F1D2B' },
            },
          }}
        >
          <InputLabel sx={{ color: '#000000' }}>
            Grau de Dificuldade
          </InputLabel>
          <Select
            value={grauDificuldade}
            onChange={(e) => setGrauDificuldade(e.target.value)}
            label="Grau de Dificuldade"
            sx={{ color: '#000000' }}
          >
            <MenuItem value="iniciante">Iniciante</MenuItem>
            <MenuItem value="intermediario">Intermediário</MenuItem>
            <MenuItem value="avancado">Avançado</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Resumo"
          value={resumo}
          onChange={(e) => setResumo(e.target.value)}
          required
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

        <FormControlLabel
          control={
            <Switch
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#1F1D2B',
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: '#1F1D2B',
                },
              }}
            />
          }
          label="Curso Ativo"
          sx={{
            color: '#000000',
            fontFamily: 'Poppins, sans-serif',
            '& .MuiFormControlLabel-label': {
              color: '#000000',
              fontFamily: 'Poppins, sans-serif',
            },
          }}
        />

        <Box>
          <Button
            variant="contained"
            component="label"
            sx={{
              backgroundColor: '#1F1D2B',
              color: '#FFFFFF',
              '&:hover': { backgroundColor: '#2a2838' },
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            {labelBotaoImagem}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={onImageChange}
            />
          </Button>
          {imagemPreview && (
            <Box sx={{ marginTop: 2 }}>
              <img
                src={imagemPreview}
                alt="Preview"
                style={{
                  maxWidth: '200px',
                  maxHeight: '200px',
                  borderRadius: '8px',
                }}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Paper>
  );
}
