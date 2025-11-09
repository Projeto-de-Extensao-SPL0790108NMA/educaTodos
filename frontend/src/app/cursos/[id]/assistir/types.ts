export interface LessonAttachment {
  id: number;
  titulo: string;
  arquivo: string;
  tipo_arquivo: string;
  tamanho_kb: number;
}

export interface Lesson {
  id: number;
  titulo: string;
  subtitulo: string;
  descricao: string;
  video: string | null;
  duracao_minutos: number;
  ordem: number;
  attachments: LessonAttachment[];
}

export interface Section {
  id: number;
  titulo: string;
  ordem: number;
  lessons: Lesson[];
}

export interface Course {
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

export interface LessonProgressData {
  id?: number;
  lesson: number;
  current_time: number;
  completed: boolean;
  last_watched?: string;
}
