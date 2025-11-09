import { useState, useEffect } from "react";
import { apiFetch } from "@/services/apiClient";
import { Course, Lesson, LessonProgressData } from "./types";

interface UseProgressoAulaProps {
  courseId: string | string[];
  aulaAtual: Lesson | null;
  videoRef: HTMLVideoElement | null;
}

export const useProgressoAula = ({ courseId, aulaAtual, videoRef }: UseProgressoAulaProps) => {
  const [aulasCompletas, setAulasCompletas] = useState<Set<number>>(new Set());
  const [tempoNaAula, setTempoNaAula] = useState(0);
  const [progressoCarregado, setProgressoCarregado] = useState(false);
  const [cursoCompleto, setCursoCompleto] = useState(false);

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
      const data = await apiFetch(`/api/courses/completions/by-course/${courseId}/`);
      if (data.completed_at) {
        setCursoCompleto(true);
      }
    } catch (err: any) {
      // Curso não concluído - isso é esperado e não é um erro real
      // Apenas define como false sem logar
      setCursoCompleto(false);
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
      
      await apiFetch('/api/courses/progress/update-progress/', {
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

  const todasAulasCompletas = (curso: Course | null): boolean => {
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

  return {
    aulasCompletas,
    tempoNaAula,
    progressoCarregado,
    cursoCompleto,
    carregarTodasAsAulasCompletas,
    verificarCursoConcluido,
    salvarProgresso,
    todasAulasCompletas,
    setProgressoCarregado,
    setTempoNaAula,
  };
};
