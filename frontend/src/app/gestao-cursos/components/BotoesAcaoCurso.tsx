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
      <Button
        variant="outlined"
        onClick={handleVoltar}
        sx={{
          backgroundColor: '#6B1515',
          color: '#FFFFFF',
          '&:hover': {
            borderColor: '#6B1515',
            backgroundColor: '#6B1515',
          },
          fontFamily: 'Poppins, sans-serif',
        }}
      >
        Deletar
      </Button>

    </Box>
  );
}