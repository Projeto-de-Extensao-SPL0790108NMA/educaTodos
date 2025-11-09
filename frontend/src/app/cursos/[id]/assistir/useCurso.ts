import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/services/apiClient";
import { Course, Lesson } from "./types";

interface UseCursoProps {
  courseId: string | string[];
  aulaId: string | null;
}

export const useCurso = ({ courseId, aulaId }: UseCursoProps) => {
  const router = useRouter();
  const [curso, setCurso] = useState<Course | null>(null);
  const [aulaAtual, setAulaAtual] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCurso = async () => {
    try {
      setLoading(true);
      const data = await apiFetch<Course>(`/api/courses/courses/${courseId}/`);
      setCurso(data);
      
      // Se não houver aulaId, define a primeira aula como atual
      if (!aulaId && data.sections && data.sections.length > 0) {
        const firstSection = data.sections[0];
        if (firstSection.lessons && firstSection.lessons.length > 0) {
          setAulaAtual(firstSection.lessons[0]);
        }
      }
    } catch (err) {
      setError("Erro ao carregar o curso. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
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

  const mudarAula = async (aulaId: number, videoRef: HTMLVideoElement | null, aulasCompletas: Set<number>, salvarProgresso: (concluido: boolean, retryCount: number, videoTime?: number) => Promise<void>) => {
    // Salva progresso do vídeo antes de mudar de aula (apenas se tiver vídeo e não estiver completa)
    if (aulaAtual && videoRef && !aulasCompletas.has(aulaAtual.id)) {
      const currentTime = Math.floor(videoRef.currentTime);
      await salvarProgresso(false, 0, currentTime);
    }
    router.push(`/cursos/${courseId}/assistir?aula=${aulaId}`);
  };

  useEffect(() => {
    if (curso && aulaId) {
      encontrarAula(Number(aulaId));
    }
  }, [curso, aulaId]);

  return {
    curso,
    aulaAtual,
    loading,
    error,
    fetchCurso,
    mudarAula,
  };
};
