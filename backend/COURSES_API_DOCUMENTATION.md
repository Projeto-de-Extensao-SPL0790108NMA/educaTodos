# Sistema de Gerenciamento de Cursos - Documentação da API

## Visão Geral

O sistema de cursos foi implementado com uma estrutura hierárquica completa:
- **Curso** → contém várias **Seções** → cada seção contém várias **Aulas** → cada aula pode ter vários **Anexos**

## Modelos Criados

### 1. Course (Curso)
- `titulo`: Título do curso
- `subtitulo`: Subtítulo do curso
- `categoria`: Categoria do curso
- `grau_dificuldade`: Nível (iniciante, intermediário, avançado)
- `resumo`: Descrição detalhada do curso
- `imagem`: Upload da imagem do curso
- `is_active`: Status ativo/inativo
- `created_at`, `updated_at`: Datas de criação e atualização

### 2. Section (Seção)
- `course`: Foreign Key para Course
- `titulo`: Título da seção
- `subtitulo`: Subtítulo da seção
- `descricao`: Descrição da seção
- `ordem`: Número da ordem de exibição (permite ordenação customizada)
- `created_at`, `updated_at`: Datas

### 3. Lesson (Aula)
- `section`: Foreign Key para Section
- `titulo`: Título da aula
- `subtitulo`: Subtítulo da aula
- `descricao`: Descrição da aula
- `video`: Upload de arquivo de vídeo
- `duracao_minutos`: Duração estimada da aula
- `ordem`: Número da ordem de exibição
- `created_at`, `updated_at`: Datas

### 4. LessonAttachment (Anexo da Aula)
- `lesson`: Foreign Key para Lesson
- `titulo`: Título do arquivo
- `arquivo`: Upload do arquivo anexo
- `tipo_arquivo`: Tipo (PDF, DOC, etc.)
- `tamanho_kb`: Tamanho do arquivo em KB
- `created_at`: Data de upload

## Endpoints da API

### Cursos
**Base URL:** `/api/courses/`

#### Listar todos os cursos
- **GET** `/api/courses/courses/`
- **Permissão:** Autenticado
- **Query Params:**
  - `categoria`: Filtrar por categoria
  - `dificuldade`: Filtrar por nível (iniciante, intermediario, avancado)
  - `is_active`: Filtrar por status (true/false)
  - `search`: Buscar no título e resumo

#### Criar curso (Admin)
- **POST** `/api/courses/courses/`
- **Permissão:** IsAdminUser
- **Body (multipart/form-data):**
```json
{
  "titulo": "Python Básico",
  "subtitulo": "Introdução à Programação",
  "categoria": "Programação",
  "grau_dificuldade": "iniciante",
  "resumo": "Curso completo de Python para iniciantes",
  "imagem": [arquivo],
  "is_active": true
}
```

#### Detalhes do curso
- **GET** `/api/courses/courses/{id}/`
- **Permissão:** Autenticado

#### Atualizar curso (Admin)
- **PUT/PATCH** `/api/courses/courses/{id}/`
- **Permissão:** IsAdminUser

#### Deletar curso (Admin)
- **DELETE** `/api/courses/courses/{id}/`
- **Permissão:** IsAdminUser

#### Listar seções de um curso
- **GET** `/api/courses/courses/{id}/sections/`
- **Permissão:** Autenticado

---

### Seções
**Base URL:** `/api/courses/sections/`

#### Listar seções
- **GET** `/api/courses/sections/`
- **Permissão:** Autenticado
- **Query Params:**
  - `course`: Filtrar por ID do curso

#### Criar seção (Admin)
- **POST** `/api/courses/sections/`
- **Permissão:** IsAdminUser
- **Body:**
```json
{
  "course": 1,
  "titulo": "Introdução ao Python",
  "subtitulo": "Conceitos Básicos",
  "descricao": "Aprenda os fundamentos da linguagem Python",
  "ordem": 1
}
```

#### Detalhes da seção
- **GET** `/api/courses/sections/{id}/`
- **Permissão:** Autenticado

#### Atualizar seção (Admin)
- **PUT/PATCH** `/api/courses/sections/{id}/`
- **Permissão:** IsAdminUser

#### Deletar seção (Admin)
- **DELETE** `/api/courses/sections/{id}/`
- **Permissão:** IsAdminUser

#### Listar aulas de uma seção
- **GET** `/api/courses/sections/{id}/lessons/`
- **Permissão:** Autenticado

---

### Aulas
**Base URL:** `/api/courses/lessons/`

#### Listar aulas
- **GET** `/api/courses/lessons/`
- **Permissão:** Autenticado
- **Query Params:**
  - `section`: Filtrar por ID da seção

#### Criar aula (Admin)
- **POST** `/api/courses/lessons/`
- **Permissão:** IsAdminUser
- **Body (multipart/form-data):**
```json
{
  "section": 1,
  "titulo": "Variáveis e Tipos de Dados",
  "subtitulo": "Primeira Aula",
  "descricao": "Aprenda sobre variáveis em Python",
  "video": [arquivo de vídeo],
  "duracao_minutos": 45,
  "ordem": 1
}
```

#### Detalhes da aula
- **GET** `/api/courses/lessons/{id}/`
- **Permissão:** Autenticado

#### Atualizar aula (Admin)
- **PUT/PATCH** `/api/courses/lessons/{id}/`
- **Permissão:** IsAdminUser

#### Deletar aula (Admin)
- **DELETE** `/api/courses/lessons/{id}/`
- **Permissão:** IsAdminUser

#### Listar anexos de uma aula
- **GET** `/api/courses/lessons/{id}/attachments/`
- **Permissão:** Autenticado

---

### Anexos
**Base URL:** `/api/courses/attachments/`

#### Listar anexos
- **GET** `/api/courses/attachments/`
- **Permissão:** Autenticado
- **Query Params:**
  - `lesson`: Filtrar por ID da aula

#### Criar anexo (Admin)
- **POST** `/api/courses/attachments/`
- **Permissão:** IsAdminUser
- **Body (multipart/form-data):**
```json
{
  "lesson": 1,
  "titulo": "Slides da Aula",
  "arquivo": [arquivo],
  "tipo_arquivo": "PDF",
  "tamanho_kb": 1024
}
```

#### Detalhes do anexo
- **GET** `/api/courses/attachments/{id}/`
- **Permissão:** Autenticado

#### Atualizar anexo (Admin)
- **PUT/PATCH** `/api/courses/attachments/{id}/`
- **Permissão:** IsAdminUser

#### Deletar anexo (Admin)
- **DELETE** `/api/courses/attachments/{id}/`
- **Permissão:** IsAdminUser

---

## Configuração de Arquivos

### URLs Configuradas
- Arquivos de media acessíveis em: `/media/`
- Imagens de cursos: `/media/courses/images/`
- Vídeos das aulas: `/media/courses/videos/`
- Anexos: `/media/courses/attachments/`

### Configuração no settings.py
```python
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'
```

### Biblioteca Instalada
- **Pillow**: Necessária para suportar ImageField (já instalada)

---

## Admin Interface

Todos os modelos foram registrados no Django Admin com interfaces customizadas:

### CourseAdmin
- Exibe: título, categoria, dificuldade, status, data de criação
- Filtros: categoria, dificuldade, status ativo, data
- Busca: título, subtítulo, resumo
- **Inline:** Adicionar seções diretamente na criação do curso

### SectionAdmin
- Exibe: título, curso, ordem, data
- Filtros: curso, data
- Busca: título, subtítulo, descrição
- **Inline:** Adicionar aulas diretamente na criação da seção

### LessonAdmin
- Exibe: título, seção, ordem, duração, data
- Filtros: curso (via seção), seção, data
- Busca: título, subtítulo, descrição
- **Inline:** Adicionar anexos diretamente na criação da aula

### LessonAttachmentAdmin
- Exibe: título, aula, tipo de arquivo, tamanho, data
- Filtros: tipo de arquivo, data
- Busca: título, título da aula

---

## Permissões

### Operações de Leitura (GET)
- **Permissão:** IsAuthenticated
- Qualquer usuário autenticado pode listar e visualizar cursos, seções, aulas e anexos

### Operações de Escrita (POST, PUT, PATCH, DELETE)
- **Permissão:** IsAdminUser
- Apenas administradores podem criar, editar ou deletar conteúdo

---

## Estrutura de Resposta

### Exemplo de resposta de Course (GET /api/courses/courses/{id}/)
```json
{
  "id": 1,
  "titulo": "Python Básico",
  "subtitulo": "Introdução à Programação",
  "categoria": "Programação",
  "grau_dificuldade": "iniciante",
  "resumo": "Curso completo de Python para iniciantes",
  "imagem": "http://localhost:8000/media/courses/images/python.jpg",
  "is_active": true,
  "sections": [
    {
      "id": 1,
      "titulo": "Introdução ao Python",
      "subtitulo": "Conceitos Básicos",
      "ordem": 1,
      "total_lessons": 5
    }
  ],
  "total_sections": 3,
  "total_lessons": 15,
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-01-15T10:30:00Z"
}
```

---

## Próximos Passos Recomendados

1. **Adicione Cursos de Teste:**
   - Acesse http://127.0.0.1:8000/admin/
   - Crie cursos, seções e aulas de exemplo

2. **Frontend:**
   - Criar página de listagem de cursos
   - Criar página de detalhes do curso (com seções e aulas)
   - Implementar player de vídeo para as aulas
   - Interface de admin para gerenciamento completo

3. **Melhorias Futuras:**
   - Sistema de progresso do aluno (tracking de aulas assistidas)
   - Sistema de avaliações/quizzes
   - Certificados de conclusão
   - Comentários nas aulas
   - Sistema de favoritos
