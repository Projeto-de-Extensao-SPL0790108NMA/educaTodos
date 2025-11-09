"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Box, Container, Typography, CircularProgress, Alert, Button } from "@mui/material";
import { apiFetch } from "@/services/apiClient";
import { useCurso } from "./useCurso";
import { useProgressoAula } from "./useProgressoAula";
import { VideoPlayer } from "./VideoPlayer";
import { LessonContentTabs } from "./LessonContentTabs";
import { LearningTrack } from "./LearningTrack";

export default function AssistirCursoPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const aulaId = searchParams.get("aula");

  const [tabValue, setTabValue] = useState(0);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
  const [concluindoCurso, setConcluindoCurso] = useState(false);
  const [secoesExpandidas, setSecoesExpandidas] = useState<Set<number>>(new Set());

  // Hook customizado para gerenciar o curso
  const { curso, aulaAtual, loading, error, fetchCurso, mudarAula } = useCurso({
    courseId: params.id,
    aulaId,
  });

  // Hook customizado para gerenciar o progresso
  const {
    aulasCompletas,
    progressoCarregado,
    cursoCompleto,
    carregarTodasAsAulasCompletas,
    verificarCursoConcluido,
    salvarProgresso,
    todasAulasCompletas,
    setProgressoCarregado,
    setTempoNaAula,
  } = useProgressoAula({
    courseId: params.id,
    aulaAtual,
    videoRef,
  });

  // Carrega curso e progresso na montagem
  useEffect(() => {
    if (params.id) {
      fetchCurso();
      carregarTodasAsAulasCompletas();
      verificarCursoConcluido();
    }
  }, [params.id]);

  // Reset quando muda de aula
  useEffect(() => {
    if (curso && aulaId) {
      setProgressoCarregado(false);
      setTempoNaAula(0);
    }
  }, [curso, aulaId]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const toggleSecao = (secaoId: number) => {
    setSecoesExpandidas((prev) => {
      const novoSet = new Set(prev);
      if (novoSet.has(secaoId)) {
        novoSet.delete(secaoId);
      } else {
        novoSet.add(secaoId);
      }
      return novoSet;
    });
  };

  const concluirCurso = async () => {
    try {
      setConcluindoCurso(true);
      const data = await apiFetch("/api/courses/completions/complete-course/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
    <Box>
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
            <VideoPlayer aulaAtual={aulaAtual} setVideoRef={setVideoRef} />
            <LessonContentTabs
              aulaAtual={aulaAtual}
              tabValue={tabValue}
              handleTabChange={handleTabChange}
            />
          </Box>

          {/* Coluna Direita - Trilha de Aprendizagem */}
          <Box>
            <LearningTrack
              curso={curso}
              aulaAtual={aulaAtual}
              aulasCompletas={aulasCompletas}
              secoesExpandidas={secoesExpandidas}
              toggleSecao={toggleSecao}
              mudarAula={(aulaId) => mudarAula(aulaId, videoRef, aulasCompletas, salvarProgresso)}
              cursoCompleto={cursoCompleto}
              concluindoCurso={concluindoCurso}
              todasAulasCompletas={todasAulasCompletas(curso)}
              concluirCurso={concluirCurso}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
