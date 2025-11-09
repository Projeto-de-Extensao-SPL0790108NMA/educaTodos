import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';


interface UploadVideoFieldProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
  placeholder?: string;
  previewWidth?: number;
  showControls?: boolean;
  sx?: object;
  maxSizeBytes?: number;
}

const UploadVideoField: React.FC<UploadVideoFieldProps> = ({
  value,
  onChange,
  accept = 'video/*',
  placeholder = 'Selecione ou arraste o vídeo aqui',
  previewWidth = 280,
  showControls = true,
  sx = {},
  maxSizeBytes,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (value) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [value]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file && maxSizeBytes && file.size > maxSizeBytes) {
      alert('O vídeo excede o tamanho máximo permitido.');
      return;
    }
    onChange(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0] || null;
    if (file && (!maxSizeBytes || file.size <= maxSizeBytes)) {
      onChange(file);
    }
  };

  return (
    <Paper
      variant="outlined"
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      sx={{
        borderRadius: '20px',
        border: '2px dashed #BDBDBD',
        backgroundColor: '#FAFAFA',
        padding: 3,
        textAlign: 'center',
        transition: '0.3s',
        cursor: 'pointer',
        '&:hover': { borderColor: '#1976D2', backgroundColor: '#F0F8FF' },
        ...sx,
      }}
    >
      {!previewUrl ? (
        <Box>
          
          <Typography
            sx={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 500,
              color: '#000',
              fontSize: 16,
              mb: 1,
            }}
          >
            {placeholder}
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: 13,
              color: '#757575',
            }}
          >
            Clique ou arraste um arquivo de vídeo aqui
          </Typography>
        </Box>
      ) : (
        <Box>
          <Typography
            sx={{
              mb: 1,
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 500,
              color: '#000',
            }}
          >
            Pré-visualização do vídeo:
          </Typography>
          <video
            src={previewUrl}
            width={previewWidth}
            controls={showControls}
            style={{
              borderRadius: '15px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
            }}
          />
        </Box>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        hidden
        onChange={handleFileSelect}
      />
    </Paper>
  );
};

export default UploadVideoField;
