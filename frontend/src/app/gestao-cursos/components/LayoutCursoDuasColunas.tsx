import React from 'react';
import { Box } from '@mui/material';

interface LayoutCursoDuasColunasProps {
  colunaEsquerda: React.ReactNode;
  colunaDireita: React.ReactNode;
}

export default function LayoutCursoDuasColunas({
  colunaEsquerda,
  colunaDireita,
}: LayoutCursoDuasColunasProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: 3,
        marginBottom: 3,
      }}
    >
      {/* COLUNA ESQUERDA */}
      <Box>{colunaEsquerda}</Box>

      {/* COLUNA DIREITA */}
      <Box>{colunaDireita}</Box>
    </Box>
  );
}
