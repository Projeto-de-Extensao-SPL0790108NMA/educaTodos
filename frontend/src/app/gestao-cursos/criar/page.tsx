'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Alert,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/services/apiClient';
import { ModalSecao, ModalAula } from './components/index';
import {
  FormularioCurso,
  SecaoAulas,
  LayoutCursoDuasColunas,
  BotoesAcaoCurso,
} from '../components';

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

export default function CriarCursoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

  const salvarSecao = () => {
    if (!tempSecao.titulo || !tempSecao.descricao) {
      setError('Título e Descrição da Seção são obrigatórios');
      return;
    }

    if (secaoEmEdicao) {
      // Editando seção existente
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
    } else {
      // Criando nova seção
      const novaSecao: Secao = {
        id: `secao-${Date.now()}`,
        titulo: tempSecao.titulo || '',
        subtitulo: tempSecao.subtitulo || '',
        descricao_subtitulo: tempSecao.descricao_subtitulo || '',
        descricao: tempSecao.descricao || '',
        aulas: [],
      };
      setSecoes([...secoes, novaSecao]);
    }

    fecharModalSecao();
    setError('');
  };

  const removerSecao = (secaoId: string) => {
    setSecoes(secoes.filter((s) => s.id !== secaoId));
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

  const salvarAula = () => {
    if (!tempAula.titulo || !tempAula.descricao) {
      setError('Título e Descrição da Aula são obrigatórios');
      return;
    }

    setSecoes(
      secoes.map((s) => {
        if (s.id === secaoParaAula) {
          if (aulaEmEdicao) {
            // Editando aula existente
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
          } else {
            // Criando nova aula
            const novaAula: Aula = {
              id: `aula-${Date.now()}`,
              titulo: tempAula.titulo || '',
              subtitulo: tempAula.subtitulo || '',
              descricao: tempAula.descricao || '',
              video: tempAula.video || null,
              duracao_minutos: tempAula.duracao_minutos || '',
              anexos: tempAula.anexos || [],
            };
            return { ...s, aulas: [...s.aulas, novaAula] };
          }
        }
        return s;
      })
    );

    fecharModalAula();
    setError('');
  };

  const removerAula = (secaoId: string, aulaId: string) => {
    setSecoes(
      secoes.map((s) => {
        if (s.id === secaoId) {
          return { ...s, aulas: s.aulas.filter((a) => a.id !== aulaId) };
        }
        return s;
      })
    );
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
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // 1. Criar o curso
      const courseFormData = new FormData();
      courseFormData.append('titulo', titulo);
      courseFormData.append('subtitulo', subtitulo);
      courseFormData.append('categoria', categoria);
      courseFormData.append('grau_dificuldade', grauDificuldade);
      courseFormData.append('resumo', resumo);
      courseFormData.append('is_active', isActive.toString());
      if (imagem) {
        courseFormData.append('imagem', imagem);
      }

      const courseResponse = await apiFetch('/api/courses/courses/', {
        method: 'POST',
        body: courseFormData,
      });

      const courseId = courseResponse.id;

      // 2. Criar as seções
      for (let i = 0; i < secoes.length; i++) {
        const secao = secoes[i];

        const sectionData = {
          course: courseId,
          titulo: secao.titulo,
          subtitulo: secao.subtitulo,
          descricao_subtitulo: secao.descricao_subtitulo,
          descricao: secao.descricao,
          ordem: i + 1,
        };

        const sectionResponse = await apiFetch('/api/courses/sections/', {
          method: 'POST',
          body: JSON.stringify(sectionData),
        });

        const sectionId = sectionResponse.id;

        // 3. Criar as aulas da seção
        for (let j = 0; j < secao.aulas.length; j++) {
          const aula = secao.aulas[j];

          const lessonFormData = new FormData();
          lessonFormData.append('section', sectionId.toString());
          lessonFormData.append('titulo', aula.titulo);
          lessonFormData.append('subtitulo', aula.subtitulo);
          lessonFormData.append('descricao', aula.descricao);
          lessonFormData.append('ordem', (j + 1).toString());

          if (aula.duracao_minutos) {
            lessonFormData.append('duracao_minutos', aula.duracao_minutos);
          }

          if (aula.video) {
            lessonFormData.append('video', aula.video);
          }

          const lessonResponse = await apiFetch('/api/courses/lessons/', {
            method: 'POST',
            body: lessonFormData,
          });

          const lessonId = lessonResponse.id;

          // 4. Criar os anexos da aula
          for (const anexo of aula.anexos) {
            if (anexo.arquivo) {
              const attachmentFormData = new FormData();
              attachmentFormData.append('lesson', lessonId.toString());
              attachmentFormData.append('titulo', anexo.titulo);
              attachmentFormData.append('arquivo', anexo.arquivo);

              await apiFetch('/api/courses/attachments/', {
                method: 'POST',
                body: attachmentFormData,
              });
            }
          }
        }
      }

      setSuccess('Curso criado com sucesso!');
      setTimeout(() => {
        router.push('/gestao-cursos');
      }, 2000);
    } catch (err: any) {
      console.error('Erro ao criar curso:', err);
      setError(err.message || 'Erro ao criar curso');
    } finally {
      setLoading(false);
    }
  };

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
        Criar Novo Curso
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

        <BotoesAcaoCurso loading={loading} labelBotaoPrincipal="Criar Curso" />
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
