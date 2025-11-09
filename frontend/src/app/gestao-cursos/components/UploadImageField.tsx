import React, { useRef, useState, useEffect } from 'react';
import { Box, Paper, Typography, IconButton } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

type UploadImageFieldProps = {
  value?: File | null;
  onChange?: (file: File | null) => void;
  accept?: string;
  placeholder?: string;
  maxSizeBytes?: number;
  sx?: any;
};

export default function UploadImageField({
  value = null,
  onChange,
  accept = 'image/*',
  placeholder = 'SELECIONE OU ARRASTE AQUI',
  maxSizeBytes,
  sx,
}: UploadImageFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(value);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // sync prop -> internal
    setFile(value || null);
  }, [value]);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleFiles = (files: FileList | null) => {
    setError(null);
    if (!files || files.length === 0) return;
    const f = files[0];
    if (maxSizeBytes && f.size > maxSizeBytes) {
      setError('Arquivo muito grande');
      return;
    }
    setFile(f);
    onChange?.(f);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  return (
    <Box sx={{ width: '100%', ...sx }}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        onChange={handleInputChange}
        aria-hidden
      />

      <Paper
        onClick={openFileDialog}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        elevation={0}
        sx={{
          cursor: 'pointer',
          borderRadius: '12px',
          border: '2px solid #333',
          backgroundColor: '#f5f5f5',
          padding: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 56,
          transition: 'background-color 0.15s, border-color 0.15s',
          ...(dragOver && {
            backgroundColor: '#efecec',
            borderColor: '#1F1D2B',
          }),
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            {!preview ? (
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  letterSpacing: 1,
                  color: '#333',
                }}
              >
                {placeholder}
              </Typography>
            ) : (
              // preview
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  component="img"
                  src={preview}
                  alt="preview"
                  sx={{
                    width: 80,
                    height: 48,
                    objectFit: 'cover',
                    borderRadius: 1,
                    border: '1px solid rgba(0,0,0,0.08)',
                  }}
                />
                <Typography sx={{ color: '#333', fontWeight: 600 }}>
                  {file?.name}
                </Typography>
              </Box>
            )}
          </Box>

          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              openFileDialog();
            }}
            aria-label="upload"
            sx={{
              bgcolor: '#ffffff',
              border: '1px solid rgba(0,0,0,0.12)',
              width: 36,
              height: 36,
              '&:hover': { bgcolor: '#fafafa' },
            }}
          >
            <UploadFileIcon />
          </IconButton>
        </Box>
      </Paper>

      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}
