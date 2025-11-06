import React from 'react';
import { Box, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

interface BotoesAcaoCursoProps {
  loading: boolean;
  labelBotaoPrincipal: string;
  onVoltar?: () => void;
}

export default function BotoesAcaoCurso({
  loading,
  labelBotaoPrincipal,
  onVoltar,
}: BotoesAcaoCursoProps) {
  const router = useRouter();

  const handleVoltar = () => {
    if (onVoltar) {
      onVoltar();
    } else {
      router.push('/gestao-cursos');
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
      <Button
        variant="outlined"
        onClick={handleVoltar}
        sx={{
          borderColor: '#000000',
          color: '#000000',
          '&:hover': {
            borderColor: '#000000',
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
          fontFamily: 'Poppins, sans-serif',
        }}
      >
        Cancelar
      </Button>
      <Button
        type="submit"
        variant="contained"
        disabled={loading}
        sx={{
          backgroundColor: '#1F1D2B',
          color: '#FFFFFF',
          '&:hover': { backgroundColor: '#2a2838' },
          fontFamily: 'Poppins, sans-serif',
        }}
      >
        {loading ? 'Processando...' : labelBotaoPrincipal}
      </Button>
    </Box>
  );
}
