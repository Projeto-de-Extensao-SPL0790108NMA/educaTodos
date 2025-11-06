import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  IconButton,
  Typography,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachFileIcon from '@mui/icons-material/AttachFile';

interface Anexo {
  id: string;
  titulo: string;
  arquivo: File | null;
}

interface TempAula {
  titulo?: string;
  subtitulo?: string;
  descricao?: string;
  video?: File | null;
  duracao_minutos?: string;
  anexos?: Anexo[];
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

interface ModalAulaProps {
  aberto: boolean;
  aulaEmEdicao: Aula | null;
  tempAula: TempAula;
  setTempAula: (aula: TempAula) => void;
  onFechar: () => void;
  onSalvar: () => void;
  onAdicionarAnexo: () => void;
  onRemoverAnexo: (anexoId: string) => void;
  onAtualizarAnexoTitulo: (anexoId: string, novoTitulo: string) => void;
  onAtualizarAnexoArquivo: (anexoId: string, arquivo: File) => void;
}

export function ModalAula({
  aberto,
  aulaEmEdicao,
  tempAula,
  setTempAula,
  onFechar,
  onSalvar,
  onAdicionarAnexo,
  onRemoverAnexo,
  onAtualizarAnexoTitulo,
  onAtualizarAnexoArquivo,
}: ModalAulaProps) {
  const [erroArquivo, setErroArquivo] = useState<string>('');

  // Tipos de arquivo permitidos para anexos (documentos)
  const tiposPermitidos = [
    'application/pdf',                                                      // PDF
    'application/msword',                                                   // DOC
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
    'application/vnd.ms-excel',                                            // XLS
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',  // XLSX
    'application/vnd.ms-powerpoint',                                       // PPT
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PPTX
    'text/plain',                                                          // TXT
    'application/rtf',                                                     // RTF
    'application/vnd.oasis.opendocument.text',                            // ODT
    'application/vnd.oasis.opendocument.spreadsheet',                     // ODS
    'application/vnd.oasis.opendocument.presentation',                    // ODP
  ];

  const extensoesPermitidas = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf,.odt,.ods,.odp';

  const validarArquivoAnexo = (arquivo: File): boolean => {
    if (!tiposPermitidos.includes(arquivo.type)) {
      // Verificação adicional por extensão (fallback)
      const extensao = arquivo.name.split('.').pop()?.toLowerCase();
      const extensoesValidas = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'odt', 'ods', 'odp'];
      
      if (!extensao || !extensoesValidas.includes(extensao)) {
        setErroArquivo('Apenas documentos são permitidos (PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, RTF, ODT, ODS, ODP)');
        setTimeout(() => setErroArquivo(''), 5000);
        return false;
      }
    }
    setErroArquivo('');
    return true;
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTempAula({ ...tempAula, video: e.target.files[0] });
    }
  };

  const handleAnexoChange = (anexoId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const arquivo = e.target.files[0];
      if (validarArquivoAnexo(arquivo)) {
        onAtualizarAnexoArquivo(anexoId, arquivo);
      } else {
        // Limpar o input
        e.target.value = '';
      }
    }
  };

  return (
    <Dialog open={aberto} onClose={onFechar} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          fontWeight: 600,
          color: '#000000',
          fontFamily: 'Poppins, sans-serif',
        }}
      >
        {aulaEmEdicao ? 'Editar Aula' : 'Nova Aula'}
      </DialogTitle>
      <DialogContent>
        {erroArquivo && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {erroArquivo}
          </Alert>
        )}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 1 }}>
          <TextField
            label="Título da Aula"
            value={tempAula.titulo || ''}
            onChange={(e) =>
              setTempAula({ ...tempAula, titulo: e.target.value })
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
            label="Subtítulo da Aula"
            value={tempAula.subtitulo || ''}
            onChange={(e) =>
              setTempAula({ ...tempAula, subtitulo: e.target.value })
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
            label="Descrição da Aula"
            value={tempAula.descricao || ''}
            onChange={(e) =>
              setTempAula({ ...tempAula, descricao: e.target.value })
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

          <TextField
            label="Duração (minutos)"
            type="number"
            value={tempAula.duracao_minutos || ''}
            onChange={(e) =>
              setTempAula({ ...tempAula, duracao_minutos: e.target.value })
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
              {tempAula.video ? 'Trocar Vídeo' : 'Upload Vídeo'}
              <input
                type="file"
                hidden
                accept="video/*"
                onChange={handleVideoChange}
              />
            </Button>
            {tempAula.video && (
              <Typography
                variant="body2"
                sx={{
                  marginTop: 1,
                  color: '#666666',
                  fontFamily: 'Poppins, sans-serif',
                }}
              >
                Arquivo: {tempAula.video.name}
              </Typography>
            )}
          </Box>

          {/* ANEXOS */}
          <Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 1,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: '#000000',
                  fontFamily: 'Poppins, sans-serif',
                }}
              >
                Anexos
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AttachFileIcon />}
                onClick={onAdicionarAnexo}
                sx={{
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
                Adicionar Anexo
              </Button>
            </Box>

            {tempAula.anexos && tempAula.anexos.map((anexo) => (
              <Box
                key={anexo.id}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  marginBottom: 2,
                }}
              >
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <TextField
                    label="Título do Anexo"
                    value={anexo.titulo}
                    onChange={(e) =>
                      onAtualizarAnexoTitulo(anexo.id, e.target.value)
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
                  <Button
                    variant="outlined"
                    component="label"
                    sx={{
                      borderColor: '#1F1D2B',
                      color: '#1F1D2B',
                      '&:hover': {
                        borderColor: '#1F1D2B',
                        backgroundColor: 'rgba(31, 29, 43, 0.04)',
                      },
                      fontFamily: 'Poppins, sans-serif',
                      textTransform: 'none',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {anexo.arquivo ? 'Trocar' : 'Upload'}
                    <input
                      type="file"
                      hidden
                      accept={extensoesPermitidas}
                      onChange={(e) => handleAnexoChange(anexo.id, e)}
                    />
                  </Button>
                  <IconButton
                    onClick={() => onRemoverAnexo(anexo.id)}
                    sx={{ color: '#6B1515' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
                {anexo.arquivo && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#666666',
                      fontFamily: 'Poppins, sans-serif',
                      marginLeft: 1,
                    }}
                  >
                    📄 {anexo.arquivo.name}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
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
