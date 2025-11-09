'use client';

import React, { useState, useEffect } from 'react';
import { Box, Alert, CircularProgress, Typography } from '@mui/material';
import { useRouter, useParams } from 'next/navigation';
import { apiFetch } from '@/services/apiClient';
import { ModalSecao, ModalAula } from '../../criar/components/index';
import {
  FormularioCurso,
  SecaoAulas,
  LayoutCursoDuasColunas,
  BotoesAcaoCurso,
} from '../../components';

interface Anexo {
  id: string;
  titulo: string;
  arquivo: File | null;
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

interface Secao {
  id: string;
  titulo: string;
  subtitulo: string;
  descricao_subtitulo: string;
  descricao: string;
  aulas: Aula[];
}

export default function EditarCursoPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id;

  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Dados do Curso
  const [titulo, setTitulo] = useState('');
  const [subtitulo, setSubtitulo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [grauDificuldade, setGrauDificuldade] = useState('iniciante');
  const [resumo, setResumo] = useState('');
  const [imagem, setImagem] = useState<File | null>(null);
  const [imagemPreview, setImagemPreview] = useState<string>('');
  const [imagemAtual, setImagemAtual] = useState<string>('');
  const [isActive, setIsActive] = useState(true);

  // Seções e Aulas
  const [secoes, setSecoes] = useState<Secao[]>([]);

  // Controle dos Modais
  const [modalSecaoAberto, setModalSecaoAberto] = useState(false);
  const [modalAulaAberto, setModalAulaAberto] = useState(false);
  const [secaoEmEdicao, setSecaoEmEdicao] = useState<Secao | null>(null);
  const [aulaEmEdicao, setAulaEmEdicao] = useState<Aula | null>(null);
  const [secaoParaAula, setSecaoParaAula] = useState<string>('');

  // Estados temporários para os modais
  const [tempSecao, setTempSecao] = useState<Partial<Secao>>({
    titulo: '',
    subtitulo: '',
    descricao_subtitulo: '',
    descricao: '',
  });

  const [tempAula, setTempAula] = useState<Partial<Aula>>({
    titulo: '',
    subtitulo: '',
    descricao: '',
    video: null,
    duracao_minutos: '',
    anexos: [],
  });

  // Carregar dados do curso
  useEffect(() => {
    if (courseId) {
      fetchCurso();
    }
  }, [courseId]);

  const fetchCurso = async () => {
    try {
      setLoading(true);
      const data = await apiFetch(`/api/courses/courses/${courseId}/`);
      
      // Preencher dados do curso
      setTitulo(data.titulo || '');
      setSubtitulo(data.subtitulo || '');
      setCategoria(data.categoria || '');
      setGrauDificuldade(data.grau_dificuldade || 'iniciante');
      setResumo(data.resumo || '');
      setIsActive(data.is_active ?? true);
      
      if (data.imagem) {
        setImagemAtual(data.imagem);
        setImagemPreview(data.imagem);
      }

      // Carregar seções e aulas
      if (data.sections && data.sections.length > 0) {
        const secoesCarregadas = await Promise.all(
          data.sections.map(async (section: any) => {
            // Buscar detalhes completos da seção incluindo aulas
            const sectionDetail = await apiFetch(`/api/courses/sections/${section.id}/`);
            
            const aulas = sectionDetail.lessons?.map((lesson: any) => ({
              id: lesson.id.toString(),
              titulo: lesson.titulo,
              subtitulo: lesson.subtitulo,
              descricao: lesson.descricao,
              video: null,
              duracao_minutos: lesson.duracao_minutos?.toString() || '',
              anexos: [],
            })) || [];

            return {
              id: section.id.toString(),
              titulo: section.titulo,
              subtitulo: section.subtitulo,
              descricao_subtitulo: section.descricao_subtitulo || '',
              descricao: section.descricao,
              aulas,
            };
          })
        );
        setSecoes(secoesCarregadas);
      }
    } catch (err: any) {
      console.error('Erro ao carregar curso:', err);
      setError(err.message || 'Erro ao carregar curso');
    } finally {
      setLoading(false);
    }
  };

  // Handler para imagem
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagem(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagemPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // ===== FUNÇÕES DO MODAL DE SEÇÃO =====
  const abrirModalNovaSecao = () => {
    setSecaoEmEdicao(null);
    setTempSecao({
      titulo: '',
      subtitulo: '',
      descricao_subtitulo: '',
      descricao: '',
    });
    setModalSecaoAberto(true);
  };

  const abrirModalEditarSecao = (secao: Secao) => {
    setSecaoEmEdicao(secao);
    setTempSecao({
      titulo: secao.titulo,
      subtitulo: secao.subtitulo,
      descricao_subtitulo: secao.descricao_subtitulo,
      descricao: secao.descricao,
    });
    setModalSecaoAberto(true);
  };

  const fecharModalSecao = () => {
    setModalSecaoAberto(false);
    setSecaoEmEdicao(null);
    setTempSecao({
      titulo: '',
      subtitulo: '',
      descricao_subtitulo: '',
      descricao: '',
    });
  };

  const salvarSecao = async () => {
    if (!tempSecao.titulo || !tempSecao.descricao) {
      setError('Título e Descrição da Seção são obrigatórios');
      return;
    }

    try {
      if (secaoEmEdicao) {
        // Editando seção existente
        const secaoData = {
          course: courseId,
          titulo: tempSecao.titulo,
          subtitulo: tempSecao.subtitulo,
          descricao_subtitulo: tempSecao.descricao_subtitulo,
          descricao: tempSecao.descricao,
          ordem: secoes.findIndex(s => s.id === secaoEmEdicao.id) + 1,
        };

        await apiFetch(`/api/courses/sections/${secaoEmEdicao.id}/`, {
          method: 'PUT',
          body: JSON.stringify(secaoData),
        });

        setSecoes(
          secoes.map((s) =>
            s.id === secaoEmEdicao.id
              ? {
                  ...s,
                  titulo: tempSecao.titulo || '',
                  subtitulo: tempSecao.subtitulo || '',
                  descricao_subtitulo: tempSecao.descricao_subtitulo || '',
                  descricao: tempSecao.descricao || '',
                }
              : s
          )
        );
        setSuccess('Seção atualizada com sucesso!');
      } else {
        // Criando nova seção
        const secaoData = {
          course: courseId,
          titulo: tempSecao.titulo,
          subtitulo: tempSecao.subtitulo,
          descricao_subtitulo: tempSecao.descricao_subtitulo,
          descricao: tempSecao.descricao,
          ordem: secoes.length + 1,
        };

        const response = await apiFetch('/api/courses/sections/', {
          method: 'POST',
          body: JSON.stringify(secaoData),
        });

        const novaSecao: Secao = {
          id: response.id.toString(),
          titulo: tempSecao.titulo || '',
          subtitulo: tempSecao.subtitulo || '',
          descricao_subtitulo: tempSecao.descricao_subtitulo || '',
          descricao: tempSecao.descricao || '',
          aulas: [],
        };
        setSecoes([...secoes, novaSecao]);
        setSuccess('Seção criada com sucesso!');
      }

      fecharModalSecao();
      setError('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Erro ao salvar seção:', err);
      setError(err.message || 'Erro ao salvar seção');
    }
  };

  const removerSecao = async (secaoId: string) => {
    if (!confirm('Tem certeza que deseja remover esta seção e todas as suas aulas?')) {
      return;
    }

    try {
      await apiFetch(`/api/courses/sections/${secaoId}/`, {
        method: 'DELETE',
      });
      setSecoes(secoes.filter((s) => s.id !== secaoId));
      setSuccess('Seção removida com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Erro ao remover seção:', err);
      setError(err.message || 'Erro ao remover seção');
    }
  };

  // ===== FUNÇÕES DO MODAL DE AULA =====
  const abrirModalNovaAula = (secaoId: string) => {
    setSecaoParaAula(secaoId);
    setAulaEmEdicao(null);
    setTempAula({
      titulo: '',
      subtitulo: '',
      descricao: '',
      video: null,
      duracao_minutos: '',
      anexos: [],
    });
    setModalAulaAberto(true);
  };

  const abrirModalEditarAula = (secaoId: string, aula: Aula) => {
    setSecaoParaAula(secaoId);
    setAulaEmEdicao(aula);
    setTempAula({
      titulo: aula.titulo,
      subtitulo: aula.subtitulo,
      descricao: aula.descricao,
      video: aula.video,
      duracao_minutos: aula.duracao_minutos,
      anexos: [...aula.anexos],
    });
    setModalAulaAberto(true);
  };

  const fecharModalAula = () => {
    setModalAulaAberto(false);
    setAulaEmEdicao(null);
    setSecaoParaAula('');
    setTempAula({
      titulo: '',
      subtitulo: '',
      descricao: '',
      video: null,
      duracao_minutos: '',
      anexos: [],
    });
  };

  const salvarAula = async () => {
    if (!tempAula.titulo || !tempAula.descricao) {
      setError('Título e Descrição da Aula são obrigatórios');
      return;
    }

    try {
      const lessonFormData = new FormData();
      lessonFormData.append('section', secaoParaAula);
      lessonFormData.append('titulo', tempAula.titulo || '');
      lessonFormData.append('subtitulo', tempAula.subtitulo || '');
      lessonFormData.append('descricao', tempAula.descricao || '');
      
      if (tempAula.duracao_minutos) {
        lessonFormData.append('duracao_minutos', tempAula.duracao_minutos);
      }

      if (tempAula.video) {
        lessonFormData.append('video', tempAula.video);
      }

      if (aulaEmEdicao) {
        // Editando aula existente
        const secao = secoes.find(s => s.id === secaoParaAula);
        const ordem = secao?.aulas.findIndex(a => a.id === aulaEmEdicao.id) || 0;
        lessonFormData.append('ordem', (ordem + 1).toString());

        await apiFetch(`/api/courses/lessons/${aulaEmEdicao.id}/`, {
          method: 'PUT',
          body: lessonFormData,
        });

        setSecoes(
          secoes.map((s) => {
            if (s.id === secaoParaAula) {
              return {
                ...s,
                aulas: s.aulas.map((a) =>
                  a.id === aulaEmEdicao.id
                    ? {
                        ...a,
                        titulo: tempAula.titulo || '',
                        subtitulo: tempAula.subtitulo || '',
                        descricao: tempAula.descricao || '',
                        video: tempAula.video || null,
                        duracao_minutos: tempAula.duracao_minutos || '',
                        anexos: tempAula.anexos || [],
                      }
                    : a
                ),
              };
            }
            return s;
          })
        );
        setSuccess('Aula atualizada com sucesso!');
      } else {
        // Criando nova aula
        const secao = secoes.find(s => s.id === secaoParaAula);
        lessonFormData.append('ordem', ((secao?.aulas.length || 0) + 1).toString());

        const response = await apiFetch('/api/courses/lessons/', {
          method: 'POST',
          body: lessonFormData,
        });

        const novaAula: Aula = {
          id: response.id.toString(),
          titulo: tempAula.titulo || '',
          subtitulo: tempAula.subtitulo || '',
          descricao: tempAula.descricao || '',
          video: tempAula.video || null,
          duracao_minutos: tempAula.duracao_minutos || '',
          anexos: tempAula.anexos || [],
        };

        setSecoes(
          secoes.map((s) => {
            if (s.id === secaoParaAula) {
              return { ...s, aulas: [...s.aulas, novaAula] };
            }
            return s;
          })
        );
        setSuccess('Aula criada com sucesso!');
      }

      fecharModalAula();
      setError('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Erro ao salvar aula:', err);
      setError(err.message || 'Erro ao salvar aula');
    }
  };

  const removerAula = async (secaoId: string, aulaId: string) => {
    if (!confirm('Tem certeza que deseja remover esta aula?')) {
      return;
    }

    try {
      await apiFetch(`/api/courses/lessons/${aulaId}/`, {
        method: 'DELETE',
      });

      setSecoes(
        secoes.map((s) => {
          if (s.id === secaoId) {
            return { ...s, aulas: s.aulas.filter((a) => a.id !== aulaId) };
          }
          return s;
        })
      );
      setSuccess('Aula removida com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Erro ao remover aula:', err);
      setError(err.message || 'Erro ao remover aula');
    }
  };

  // ===== FUNÇÕES DE ANEXOS =====
  const adicionarAnexo = () => {
    const novoAnexo: Anexo = {
      id: `anexo-${Date.now()}`,
      titulo: '',
      arquivo: null,
    };
    setTempAula({
      ...tempAula,
      anexos: [...(tempAula.anexos || []), novoAnexo],
    });
  };

  const removerAnexo = (anexoId: string) => {
    setTempAula({
      ...tempAula,
      anexos: (tempAula.anexos || []).filter((a) => a.id !== anexoId),
    });
  };

  const atualizarAnexoTitulo = (anexoId: string, titulo: string) => {
    setTempAula({
      ...tempAula,
      anexos: (tempAula.anexos || []).map((a) =>
        a.id === anexoId ? { ...a, titulo } : a
      ),
    });
  };

  const atualizarAnexoArquivo = (anexoId: string, arquivo: File | null) => {
    setTempAula({
      ...tempAula,
      anexos: (tempAula.anexos || []).map((a) =>
        a.id === anexoId ? { ...a, arquivo } : a
      ),
    });
  };

  // ===== SUBMISSÃO DO FORMULÁRIO =====
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!titulo.trim()) {
      setError('O título do curso é obrigatório');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    if (!categoria.trim()) {
      setError('A categoria é obrigatória');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    if (!resumo.trim()) {
      setError('O resumo é obrigatório');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    setLoadingSubmit(true);
    setError('');
    setSuccess('');

    try {
      // Atualizar dados do curso
      const courseFormData = new FormData();
      courseFormData.append('titulo', titulo.trim());
      courseFormData.append('subtitulo', subtitulo.trim());
      courseFormData.append('categoria', categoria.trim());
      courseFormData.append('grau_dificuldade', grauDificuldade);
      courseFormData.append('resumo', resumo.trim());
      courseFormData.append('is_active', isActive.toString());
      
      // Só envia a imagem se foi selecionada uma NOVA imagem (File object)
      // Não envia se for apenas a URL da imagem existente
      if (imagem && imagem instanceof File) {
        courseFormData.append('imagem', imagem);
      }

      console.log('Enviando atualização do curso:', {
        titulo: titulo.trim(),
        subtitulo: subtitulo.trim(),
        categoria: categoria.trim(),
        grau_dificuldade: grauDificuldade,
        resumo: resumo.trim(),
        is_active: isActive,
        tem_nova_imagem: !!(imagem && imagem instanceof File),
        mantem_imagem_existente: !!imagemAtual && !imagem,
      });

      await apiFetch(`/api/courses/courses/${courseId}/`, {
        method: 'PUT',
        body: courseFormData,
      });

      setSuccess('Curso atualizado com sucesso!');
      setTimeout(() => {
        router.push('/gestao-cursos');
      }, 2000);
    } catch (err: any) {
      console.error('Erro ao atualizar curso:', err);
      setError(err.message || 'Erro ao atualizar curso');
      
      // Scroll para o topo para mostrar o erro
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#EDEDED',
        }}
      >
        <CircularProgress sx={{ color: '#1F1D2B' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4, backgroundColor: '#EDEDED', minHeight: '100vh' }}>
      <Typography
        variant="h4"
        sx={{
          marginBottom: 3,
          fontWeight: 600,
          color: '#000000',
          fontFamily: 'Poppins, sans-serif',
        }}
      >
        Editar Curso
      </Typography>

      {error && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ marginBottom: 2 }}>
          {success}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <LayoutCursoDuasColunas
          colunaEsquerda={
            <FormularioCurso
              titulo={titulo}
              setTitulo={setTitulo}
              subtitulo={subtitulo}
              setSubtitulo={setSubtitulo}
              categoria={categoria}
              setCategoria={setCategoria}
              grauDificuldade={grauDificuldade}
              setGrauDificuldade={setGrauDificuldade}
              resumo={resumo}
              setResumo={setResumo}
              isActive={isActive}
              setIsActive={setIsActive}
              imagemPreview={imagemPreview}
              onImageChange={handleImageChange}
              labelBotaoImagem={imagem || imagemAtual ? 'Trocar Imagem' : 'Upload Imagem do Curso'}
            />
          }
          colunaDireita={
            <SecaoAulas
              secoes={secoes}
              onEditarSecao={abrirModalEditarSecao}
              onRemoverSecao={removerSecao}
              onEditarAula={abrirModalEditarAula}
              onRemoverAula={removerAula}
              onAdicionarAula={abrirModalNovaAula}
              onAdicionarSecao={abrirModalNovaSecao}
            />
          }
        />

        <BotoesAcaoCurso
          loading={loadingSubmit}
          labelBotaoPrincipal="Salvar Alterações"
        />
      </form>

      {/* MODAIS */}
      <ModalSecao
        aberto={modalSecaoAberto}
        secaoEmEdicao={secaoEmEdicao}
        tempSecao={tempSecao}
        setTempSecao={setTempSecao}
        onFechar={fecharModalSecao}
        onSalvar={salvarSecao}
      />

      <ModalAula
        aberto={modalAulaAberto}
        aulaEmEdicao={aulaEmEdicao}
        tempAula={tempAula}
        setTempAula={setTempAula}
        onFechar={fecharModalAula}
        onSalvar={salvarAula}
        onAdicionarAnexo={adicionarAnexo}
        onRemoverAnexo={removerAnexo}
        onAtualizarAnexoTitulo={atualizarAnexoTitulo}
        onAtualizarAnexoArquivo={atualizarAnexoArquivo}
      />
    </Box>
  );
}
