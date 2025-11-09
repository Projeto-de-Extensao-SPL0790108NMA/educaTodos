"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemButton,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DescriptionIcon from "@mui/icons-material/Description";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { apiFetch } from "@/services/apiClient";
import { API_URL } from "@/services/api";

interface LessonAttachment {
  id: number;
  titulo: string;
  arquivo: string;
  tipo_arquivo: string;
  tamanho_kb: number;
}

interface Lesson {
  id: number;
  titulo: string;
  subtitulo: string;
  descricao: string;
  video: string | null;
  duracao_minutos: number;
  ordem: number;
  attachments: LessonAttachment[];
}

interface Section {
  id: number;
  titulo: string;
  ordem: number;
  lessons: Lesson[];
}

interface Course {
  id: number;
  titulo: string;
  subtitulo: string;
  resumo: string;
  categoria: string;
  grau_dificuldade: string;
  imagem: string | null;
  is_active: boolean;
  sections: Section[];
}

interface LessonProgressData {
  id?: number;
  lesson: number;
  current_time: number;
  completed: boolean;
  last_watched?: string;
}

export default function AssistirCursoPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const aulaId = searchParams.get("aula");

  const [curso, setCurso] = useState<Course | null>(null);
  const [aulaAtual, setAulaAtual] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
  const [progressoCarregado, setProgressoCarregado] = useState(false);
  const [aulasCompletas, setAulasCompletas] = useState<Set<number>>(new Set());
  const [tempoNaAula, setTempoNaAula] = useState(0);
  const [cursoCompleto, setCursoCompleto] = useState(false);
  const [concluindoCurso, setConcluindoCurso] = useState(false);
  const [secoesExpandidas, setSecoesExpandidas] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (params.id) {
      fetchCurso();
      carregarTodasAsAulasCompletas();
      verificarCursoConcluido();
    }
  }, [params.id]);

  useEffect(() => {
    if (curso && aulaId) {
      encontrarAula(Number(aulaId));
      setProgressoCarregado(false); // Reset para nova aula
      setTempoNaAula(0); // Reset do contador de tempo
    }
  }, [curso, aulaId]);

  // Carregar progresso quando a aula mudar
  useEffect(() => {
    if (aulaAtual && videoRef && !progressoCarregado) {
      carregarProgresso();
    }
  }, [aulaAtual, videoRef]);

  // Contador de tempo na aula - marca como completa após 10 segundos
  useEffect(() => {
    if (!aulaAtual) return;
    
    // Se a aula já está completa, não precisa do timer
    if (aulasCompletas.has(aulaAtual.id)) return;

    const intervalo = setInterval(() => {
      setTempoNaAula(prev => {
        const novoTempo = prev + 1;
        
        // Marca como completa após 10 segundos (apenas uma vez)
        if (novoTempo === 10) {
          salvarProgresso(true);
          clearInterval(intervalo); // Para o timer após marcar como completa
        }
        
        return novoTempo;
      });
    }, 1000); // Incrementa a cada 1 segundo

    return () => clearInterval(intervalo);
  }, [aulaAtual, aulasCompletas]);

  // Salvar progresso do vídeo ao sair da página (apenas se tiver vídeo e não estiver completo)
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (aulaAtual && videoRef && !aulasCompletas.has(aulaAtual.id)) {
        const currentTime = Math.floor(videoRef.currentTime);
        
        // Usa sendBeacon para garantir que o request seja enviado mesmo ao fechar
        const data = JSON.stringify({
          lesson: aulaAtual.id,
          current_time: currentTime,
          completed: false,
        });
        
        const token = localStorage.getItem('access_token');
        const blob = new Blob([data], { type: 'application/json' });
        
        // sendBeacon não suporta headers personalizados, então não salva se precisar de auth
        // A aula já terá sido marcada como completa se passou 10 segundos
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [videoRef, aulaAtual, aulasCompletas]);

  const fetchCurso = async () => {
    try {
      setLoading(true);
      const data = await apiFetch<Course>(`/api/courses/courses/${params.id}/`);
      setCurso(data);
    } catch (err) {
      setError("Erro ao carregar o curso. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const carregarTodasAsAulasCompletas = async () => {
    try {
      const data = await apiFetch<LessonProgressData[]>('/api/courses/progress/');
      const completas = new Set(
        data.filter(p => p.completed).map(p => p.lesson)
      );
      setAulasCompletas(completas);
    } catch (err: any) {
      // Sem progresso ainda - isso é normal para usuários novos
    }
  };

  const verificarCursoConcluido = async () => {
    try {
      const data = await apiFetch(`/api/courses/completions/by-course/${params.id}/`);
      if (data.completed_at) {
        setCursoCompleto(true);
      }
    } catch (err: any) {
      // Curso não concluído - isso é esperado e não é um erro real
      // Apenas define como false sem logar
      setCursoCompleto(false);
    }
  };

  const todasAulasCompletas = (): boolean => {
    if (!curso) return false;
    
    // Pega todas as IDs de aulas deste curso
    const aulasDesteCurso = curso.sections.flatMap(section => 
      section.lessons.map(lesson => lesson.id)
    );
    
    // Verifica quantas aulas deste curso estão completas
    const aulasCompletasDesteCurso = aulasDesteCurso.filter(aulaId => 
      aulasCompletas.has(aulaId)
    );
    
    console.log('Debug todasAulasCompletas:', {
      totalAulas: aulasDesteCurso.length,
      aulasCompletas: aulasCompletasDesteCurso.length,
      aulasCompletasIds: Array.from(aulasCompletas),
      aulasDesteCursoIds: aulasDesteCurso
    });
    
    // Todas as aulas deste curso devem estar completas
    return aulasDesteCurso.length > 0 && 
           aulasCompletasDesteCurso.length === aulasDesteCurso.length;
  };

  const concluirCurso = async () => {
    try {
      setConcluindoCurso(true);
      const data = await apiFetch('/api/courses/completions/complete-course/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          course: params.id,
        }),
      });
      
      // Redireciona para a página do certificado
      router.push(`/certificado/${data.certificate_code}`);
    } catch (err: any) {
      console.error("Erro ao concluir curso:", err);
      alert("Erro ao concluir curso. Tente novamente.");
    } finally {
      setConcluindoCurso(false);
    }
  };

  const carregarProgresso = async () => {
    if (!aulaAtual) return;

    try {
      const data = await apiFetch<LessonProgressData>(
        `/api/courses/progress/by-lesson/${aulaAtual.id}/`
      );
      
      if (videoRef && data.current_time > 0) {
        videoRef.currentTime = data.current_time;
      }
      
      setProgressoCarregado(true);
    } catch (err: any) {
      // Sem progresso salvo ainda - isso é normal para aulas não iniciadas
      setProgressoCarregado(true);
    }
  };

  const salvarProgresso = async (concluido: boolean = false, retryCount: number = 0, videoTime?: number) => {
    if (!aulaAtual) return;

    try {
      const currentTime = videoTime !== undefined ? videoTime : (videoRef ? Math.floor(videoRef.currentTime) : 0);
      
      const response = await apiFetch('/api/courses/progress/update-progress/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lesson: aulaAtual.id,
          current_time: currentTime,
          completed: concluido,
        }),
      });
      
      // Atualiza o estado local se marcada como concluída
      if (concluido) {
        setAulasCompletas(prev => new Set([...prev, aulaAtual.id]));
      }
    } catch (err: any) {
      // Retry on 500 errors (database locked) up to 3 times with exponential backoff
      if (err?.message?.includes('500') && retryCount < 3) {
        const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
        await new Promise(resolve => setTimeout(resolve, delay));
        return salvarProgresso(concluido, retryCount + 1, videoTime);
      }
      
      // Apenas loga erro real após todas as tentativas
      if (retryCount >= 3 || !err?.message?.includes('500')) {
        console.error("Erro ao salvar progresso após tentativas:", err);
      }
    }
  };

  const encontrarAula = (aulaId: number) => {
    if (!curso) return;

    for (const section of curso.sections) {
      const aula = section.lessons.find((lesson) => lesson.id === aulaId);
      if (aula) {
        setAulaAtual(aula);
        return;
      }
    }
  };

  const mudarAula = async (aulaId: number) => {
    // Salva progresso do vídeo antes de mudar de aula (apenas se tiver vídeo e não estiver completa)
    if (aulaAtual && videoRef && !aulasCompletas.has(aulaAtual.id)) {
      const currentTime = Math.floor(videoRef.currentTime);
      await salvarProgresso(false, 0, currentTime);
    }
    router.push(`/cursos/${params.id}/assistir?aula=${aulaId}`);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const toggleSecao = (secaoId: number) => {
    setSecoesExpandidas(prev => {
      const novoSet = new Set(prev);
      if (novoSet.has(secaoId)) {
        novoSet.delete(secaoId);
      } else {
        novoSet.add(secaoId);
      }
      return novoSet;
    });
  };

  const converterParaRomano = (num: number): string => {
    const valores = [
      { valor: 1000, simbolo: 'M' },
      { valor: 900, simbolo: 'CM' },
      { valor: 500, simbolo: 'D' },
      { valor: 400, simbolo: 'CD' },
      { valor: 100, simbolo: 'C' },
      { valor: 90, simbolo: 'XC' },
      { valor: 50, simbolo: 'L' },
      { valor: 40, simbolo: 'XL' },
      { valor: 10, simbolo: 'X' },
      { valor: 9, simbolo: 'IX' },
      { valor: 5, simbolo: 'V' },
      { valor: 4, simbolo: 'IV' },
      { valor: 1, simbolo: 'I' }
    ];
    
    let resultado = '';
    let numero = num;
    
    for (const { valor, simbolo } of valores) {
      while (numero >= valor) {
        resultado += simbolo;
        numero -= valor;
      }
    }
    
    return resultado;
  };

  const formatTamanhoArquivo = (tamanhoKb: number): string => {
    if (tamanhoKb < 1024) {
      return `${tamanhoKb} KB`;
    }
    const tamanhoMb = (tamanhoKb / 1024).toFixed(2);
    return `${tamanhoMb} MB`;
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#EDEDED",
        }}
      >
        <CircularProgress sx={{ color: "#1F1D2B" }} />
      </Box>
    );
  }

  if (error || !curso || !aulaAtual) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || "Aula não encontrada."}
        </Alert>
        <Button variant="contained" onClick={() => router.push("/")}>
          Voltar para Home
        </Button>
      </Container>
    );
  }

  return (
    <Box
    >
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Título do Curso */}
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontFamily: "Poppins",
            fontWeight: 700,
            color: "#1F1D2B",
            mb: 3,
          }}
        >
          {curso.titulo}
        </Typography>

        {/* Layout Principal */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 400px" },
            gap: 3,
          }}
        >
          {/* Coluna Esquerda - Vídeo e Tabs */}
          <Box>
            {/* Player de Vídeo */}
            <Box
              sx={{
                backgroundColor: "#000000",
                borderRadius: "12px",
                overflow: "hidden",
                aspectRatio: "16/9",
                mb: 3,
                position: "relative",
              }}
            >
              {aulaAtual.video ? (
                <video
                  ref={(el) => setVideoRef(el)}
                  controls
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                  src={
                    aulaAtual.video.startsWith("http")
                      ? aulaAtual.video
                      : `${API_URL}${aulaAtual.video}`
                  }
                >
                  Seu navegador não suporta a tag de vídeo.
                </video>
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                  }}
                >
                  <PlayArrowIcon
                    sx={{ fontSize: 80, color: "#666666" }}
                  />
                  <Typography
                    sx={{
                      fontFamily: "Poppins",
                      fontSize: "18px",
                      fontWeight: 600,
                      color: "#666666",
                    }}
                  >
                    Vídeo não disponível
                  </Typography>
                </Box>
              )}
            </Box>


            {/* Card com Tabs */}
            <Box
              sx={{
                backgroundColor: "#FFFFFF",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
              }}
            >
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                sx={{
                  borderBottom: "2px solid #EDEDED",
                  px: 2,
                  "& .MuiTab-root": {
                    color: "#666666",
                    fontFamily: "Poppins",
                    fontSize: "15px",
                    fontWeight: 500,
                    textTransform: "none",
                    minWidth: 120,
                    py: 2,
                    transition: "color 0.3s ease",
                    "&.Mui-selected": {
                      color: "#1F1D2B",
                      fontWeight: 700,
                    },
                    "&:hover": {
                      color: "#1F1D2B",
                    },
                  },
                  "& .MuiTabs-indicator": {
                    backgroundColor: "#1F1D2B",
                    height: 4,
                    borderRadius: "4px 4px 0 0",
                  },
                }}
              >
                <Tab icon={<DescriptionIcon />} iconPosition="start" label="Instruções" />
                <Tab icon={<AttachFileIcon />} iconPosition="start" label="Materiais de Apoio" />
              </Tabs>

              <Box sx={{ p: 3 }}>
                {tabValue === 0 && (
                  // Tab Descrição
                  <Typography
                    sx={{
                      fontFamily: "Poppins",
                      color: "#333333",
                      fontSize: "15px",
                      lineHeight: 2,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {aulaAtual.descricao}
                  </Typography>
                )}

                {tabValue === 1 && (
                  // Tab Materiais de Apoio
                  <Box>
                    {aulaAtual.attachments && aulaAtual.attachments.length > 0 ? (
                      <List sx={{ p: 0 }}>
                        {aulaAtual.attachments.map((anexo) => (
                          <ListItem
                            key={anexo.id}
                            sx={{
                              px: 0,
                              py: 1,
                              borderBottom: "1px solid #EDEDED",
                              "&:last-child": {
                                borderBottom: "none",
                              },
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                width: "100%",
                              }}
                            >
                              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <AttachFileIcon sx={{ color: "#1F1D2B" }} />
                                <Box>
                                  <Typography
                                    sx={{
                                      fontFamily: "Poppins",
                                      fontWeight: 600,
                                      color: "#1F1D2B",
                                      fontSize: "14px",
                                    }}
                                  >
                                    {anexo.titulo}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      fontFamily: "Poppins",
                                      color: "#666666",
                                      fontSize: "12px",
                                    }}
                                  >
                                    {anexo.tipo_arquivo} • {formatTamanhoArquivo(anexo.tamanho_kb)}
                                  </Typography>
                                </Box>
                              </Box>
                              <Button
                                variant="outlined"
                                size="small"
                                sx={{
                                  fontFamily: "Poppins",
                                  textTransform: "none",
                                  borderColor: "#1F1D2B",
                                  color: "#1F1D2B",
                                  "&:hover": {
                                    borderColor: "#1F1D2B",
                                    backgroundColor: "rgba(31, 29, 43, 0.04)",
                                  },
                                }}
                                onClick={() => {
                                  const url = anexo.arquivo.startsWith("http")
                                    ? anexo.arquivo
                                    : `${API_URL}${anexo.arquivo}`;
                                  window.open(url, "_blank");
                                }}
                              >
                                Download
                              </Button>
                            </Box>
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Box
                        sx={{
                          textAlign: "center",
                          py: 4,
                        }}
                      >
                        <AttachFileIcon
                          sx={{ fontSize: 48, color: "#CCCCCC", mb: 2 }}
                        />
                        <Typography
                          sx={{
                            fontFamily: "Poppins",
                            color: "#666666",
                            fontSize: "15px",
                          }}
                        >
                          Esta aula não possui materiais de apoio.
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            </Box>
          </Box>

          {/* Coluna Direita - Trilha de Aprendizagem */}
          <Box>
            <Box
              sx={{
                
                position: "sticky",
                top: 16,
              }}
            >
              <Box
                sx={{
                  p: 3,
                  borderBottom: "2px solid #EDEDE",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: "#ffffff",
                    fontFamily: "Poppins",
                    fontWeight: 700,
                    mb: 2,
                  }}
                >
                  Trilha de Aprendizagem
                </Typography>
              </Box>

              <Box
                sx={{
                  maxHeight: "calc(100vh - 200px)",
                  overflowY: "auto",
                  "&::-webkit-scrollbar": {
                    width: "8px",
                  },
                  "&::-webkit-scrollbar-track": {
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#1F1D2B",
                    borderRadius: "4px",
                  },
                }}
              >
                {curso.sections
                  .sort((a, b) => a.ordem - b.ordem)
                  .map((section, index) => (
                    <Box 
                      key={section.id}
                      sx={{
                        borderBottom: index < curso.sections.length - 1 ? "2px solid rgba(255, 255, 255, 0.2)" : "none",
                      }}
                    >
                      {/* Título da Seção - Clicável */}
                      <Box
                        onClick={() => toggleSecao(section.id)}
                        sx={{
                          px: 3,
                          py: 2,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: "Poppins",
                            fontWeight: 600,
                            color: "#ffffff",
                            fontSize: "14px",
                          }}
                        >
                          Seção {converterParaRomano(section.ordem)}: {section.titulo}
                        </Typography>
                        {secoesExpandidas.has(section.id) ? (
                          <ExpandLessIcon sx={{ color: "#ffffff" }} />
                        ) : (
                          <ExpandMoreIcon sx={{ color: "#ffffff" }} />
                        )}
                      </Box>

                      {/* Lista de Aulas - Expandível */}
                      {secoesExpandidas.has(section.id) && (
                        <List sx={{ p: 0 }}>
                          {section.lessons
                            .sort((a, b) => a.ordem - b.ordem)
                            .map((lesson) => (
                            <ListItem key={lesson.id} sx={{ p: 0 }}>
                              <ListItemButton
                                selected={aulaAtual.id === lesson.id}
                                onClick={() => mudarAula(lesson.id)}
                                sx={{
                                  px: 3,
                                  py: 2,
                                  borderLeft: aulaAtual.id === lesson.id
                                    ? "4px solid #1F1D2B"
                                    : "4px solid transparent",
                                  backgroundColor: aulaAtual.id === lesson.id
                                    ? "rgba(31, 29, 43, 0.08)"
                                    : "transparent",
                                  "&:hover": {
                                    backgroundColor: aulaAtual.id === lesson.id
                                      ? "rgba(31, 29, 43, 0.12)"
                                      : "rgba(31, 29, 43, 0.04)",
                                  },
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    width: "100%",
                                  }}
                                >
                                  {aulasCompletas.has(lesson.id) ? (
                                    <CheckCircleIcon
                                      sx={{
                                        fontSize: 20,
                                        color: "#2C5F2D",
                                      }}
                                    />
                                  ) : (
                                    <PlayArrowIcon
                                      sx={{
                                        fontSize: 20,
                                        color: aulaAtual.id === lesson.id
                                          ? "#ffffff"
                                          : "#ffffff",
                                      }}
                                    />
                                  )}
                                  <Box sx={{ flex: 1 }}>
                                    <Typography
                                      sx={{
                                        fontFamily: "Poppins",
                                        fontWeight: aulaAtual.id === lesson.id ? 600 : 500,
                                        color: aulaAtual.id === lesson.id
                                          ? "#ffffff"
                                          : "#ffffff",
                                        fontSize: "13px",
                                      }}
                                    >
                                      {lesson.ordem}. {lesson.titulo}
                                    </Typography>
                                    {lesson.duracao_minutos > 0 && (
                                      <Typography
                                        sx={{
                                          fontFamily: "Poppins",
                                          color: "#ffffff",
                                          fontSize: "11px",
                                          mt: 0.5,
                                        }}
                                      >
                                        {lesson.duracao_minutos} min
                                      </Typography>
                                    )}
                                  </Box>
                                </Box>
                              </ListItemButton>
                            </ListItem>
                          ))}
                        </List>
                      )}
                    </Box>
                  ))}
              </Box>
              
              {/* Botão de Concluir Curso */}
              <Box sx={{ p: 3,}}>
                {!cursoCompleto && (
                  <Button
                    variant="contained"
                    fullWidth
                    disabled={concluindoCurso || !todasAulasCompletas()}
                    onClick={concluirCurso}
                    sx={{
                      backgroundColor: "#2C5F2D",
                      color: "#FFFFFF",
                      fontFamily: "Poppins",
                      fontWeight: 500,
                      textTransform: "none",
                      py: 1.5,
                      "&:hover": {
                        backgroundColor: "#234d24",
                      },
                      "&:disabled": {
                        backgroundColor: "#CCCCCC",
                        color: "#666666",
                      },
                    }}
                  >
                    {concluindoCurso ? "Concluindo..." : todasAulasCompletas() ? "Concluir Curso" : "Complete todas as aulas"}
                  </Button>
                )}
                
                {cursoCompleto && (
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                      borderColor: "#2C5F2D",
                      color: "#2C5F2D",
                      fontFamily: "Poppins",
                      fontWeight: 500,
                      textTransform: "none",
                      py: 1.5,
                      "&:hover": {
                        borderColor: "#234d24",
                        backgroundColor: "rgba(44, 95, 45, 0.04)",
                      },
                    }}
                  >
                    ✓ Curso Concluído
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
