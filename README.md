<p align="center">
  <img width="300" height="300" alt="Logo do Conhecimento Livre"
       src="https://github.com/user-attachments/assets/7dbe14d6-ac35-4027-ab2f-b267b9d18758" />
</p>

<h1 align="center">📚 Conhecimento Livre</h1>
<p align="center">
  <strong>Sistema de Ensino para Ressocialização de Detentos</strong><br>
  <strong>Universidade UNINORTE – Curso de Ciência da Computação – 8º Período</strong>
</p>

---

## 📑 Índice

* [📘 Descrição do Projeto](#-descrição-do-projeto)
* [🎯 Problema e Oportunidade](#-problema-e-oportunidade)
* [💡 Solução Proposta](#-solução-proposta)
* [⚙ Tecnologias-Chave](#-tecnologias-chave)
* [📂 Estrutura do Projeto](#-estrutura-do-projeto)
* [📦 Instalação e Execução](#-instalação-e-execução)
* [▶️ Uso Rápido](#uso-rapido)
* [👨‍🎓 Adicionar Usuário Aluno](#adicionar-usuario-aluno)
* [🔐 Requisitos Não Funcionais](#-requisitos-não-funcionais)
* [🧭 Roteiro](#-roteiro)
* [👥 Equipe](#-equipe)
* [📚 Referências](#-referências)

---

## 📘 Descrição do Projeto

O **Conhecimento Livre** é um sistema de ensino digital voltado para o ambiente prisional brasileiro, com o objetivo de **reduzir a reincidência criminal** através de educação e qualificação profissional.

A plataforma é composta por dois módulos principais:

* **Aplicação Mestre (Administrativa)**: utilizada por administradores e instrutores.
* **Aplicação Cliente (Aluno)**: executada nos computadores dos detentos, em modo **100% offline**.

A solução combina **EdTech** e **segurança**, mantendo operação offline com sincronização controlada.

---

## 🎯 Problema e Oportunidade

* A reincidência criminal no Brasil pode chegar a **70%** em alguns estados.
* A carência de acesso à educação e capacitação dentro do sistema prisional **agrava** o cenário.

**Oportunidade:** entregar uma plataforma **segura, acessível e offline**, capaz de transformar o tempo de reclusão em oportunidade de aprendizado.

---

## 💡 Solução Proposta

A plataforma oferece:

* 📚 **Cursos modulares** (alfabetização, ensino fundamental, técnico-profissionalizante).
* 🕹️ **Conteúdo gamificado** e **adaptativo**.
* 📴 **Operação offline** com sincronização posterior controlada.
* ♿ **Interface acessível** para baixa literacia digital.
* 📊 **Dashboard administrativo** com métricas e relatórios de progresso.

---

## ⚙ Tecnologias-Chave

| Camada / Categoria                | Tecnologia                                   | Descrição                                               |
|----------------------------------|----------------------------------------------|---------------------------------------------------------|
| Front-end                        | **Next.js (React) + TypeScript + MUI**       | UI moderna, responsiva e acessível                      |
| Backend (API principal)          | **Django (Python) + DRF + SimpleJWT**        | API REST segura com autenticação JWT                    |
| Serviços/Microserviços | **Node.js + Express**                         | Endpoints auxiliares/integrações quando necessário      |
| Testes de API                    | **Postman**                                   | Validação de requisições e respostas do backend         |
| Banco de Dados                   | **PostgreSQL (prod) / SQLite (dev)**         | Armazenamento relacional confiável                      |
| DevOps                           | **GitHub Actions + Docker**                   | CI/CD e padronização/empacotamento de ambiente          |
| Segurança                        | **Criptografia + RBAC + Logs**                | Proteção de dados, controle de acesso e auditoria       |

---

## 📂 Estrutura do Projeto
```
bash
/
├── .github/
│   └── workflows/
│       └── docker-ci.yml            # Pipeline CI (build/test)
│
├── backend/                         # Django (API)
│   ├── .env                         # Variáveis locais do backend
│   ├── apps/
│   ├── conhecimento_livre/
│   ├── .gitattributes
│   ├── .gitignore
│   ├── COURSES_API_DOCUMENTATION.md
│   ├── db.sqlite3
│   ├── Dockerfile
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/                        # Next.js (Web)
│   ├── .next/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   ├── .gitignore
│   ├── Dockerfile
│   ├── jsconfig.json
│   ├── next-env.d.ts
│   ├── next.config.mjs
│   ├── next.config.ts
│   ├── package-lock.json
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```
> **Rotas de API (principais)**
>
> * `POST /api/auth/token/` · `POST /api/auth/token/refresh/` (JWT)
> * `GET /api/accounts/me/` · `POST /api/accounts/auth/change-password/`
> * `GET /api/courses/courses/` · `GET /api/courses/sections/` · `GET /api/courses/lessons/` · `GET /api/courses/attachments/`

---

## 📦 Instalação e Execução

### ✅ Pré-requisitos

* Git
* Python **3.11+**
* Node.js **18+** (recomendado **20 LTS**)

### ⚙️ Instalação

**Backend**

```bash
cd backend
python -m venv .venv
python -m pip install -U pip
python -m pip install -r requirements.txt
python manage.py migrate
```

**Frontend**

```bash
cd ../frontend
npm install
```

> **Nota:** Em DEV o front funciona **sem `.env`** (proxy/fallback configurado). Só crie `frontend/.env` se precisar apontar manualmente a API:
> `VITE_API_URL=http://127.0.0.1:8000`

### ▶️ Execução

**Backend**

```bash
python manage.py runserver   # http://127.0.0.1:8000
```

**Frontend**

```bash
npm run dev                  # ex.: http://localhost:3000 ou 5173
```

**Acesso:**

* Criar admin: `python manage.py createsuperuser` → `/admin`.
* Perfis: o login é **único**; o perfil (aluno/professor) é decidido após autenticação.

---

<a id="uso-rapido"></a>
## ▶️ Uso Rápido

1. Entre em **/admin** (Django) com o usuário **ADMIN** criado.
2. **Crie um usuário com perfil ALUNO** (veja a seção abaixo) para navegar no front.
3. No frontend, autentique na **tela única de login**; o backend decide o perfil (aluno/professor) após o JWT.

---

<a id="adicionar-usuario-aluno"></a>
## 👨‍🎓 Adicionar Usuário Aluno

A autenticação é **única**; o backend decide o perfil. Para aluno, use a **matrícula como `username`** e **não** marque permissões administrativas.

### Via Shell do Django

**Shell do Django:**  

**Entrar**
```python
Python manage.py shell
```  
```python
from django.contrib.auth import get_user_model
U = get_user_model()
matricula = "20250001"
senha = "SenhaAluno123!"
u, _ = U.objects.get_or_create(username=matricula, defaults={"email": "aluno01@local"})
u.set_password(senha)
u.is_staff = False
u.is_superuser = False
u.save()
print("Aluno pronto:", u.username)
# (Opcional) criar perfil Inmate se existir
try:
    from accounts.models import Inmate
    Inmate.objects.get_or_create(user=u)
except Exception:
    pass
```
**Sair**
```python 
exit ()
```
### Teste rápido do login do aluno

```bash
curl -s http://127.0.0.1:8000/api/auth/token/ -H 'Content-Type: application/json' \
  -d '{"username":"20250001","password":"SenhaAluno123!"}'
```

Se retornar `{ access, refresh }`, o aluno está pronto para usar o front.

---

## 🔐 Requisitos Não Funcionais

**1) Segurança e Auditoria**

* **Criptografia**: dados protegidos em repouso e em trânsito.
* **RBAC**: permissões distintas para administradores, instrutores e alunos.
* **Logs**: registro de ações críticas (login, criação/edição/remoção) com trilha de auditoria.

**2) Usabilidade e Acessibilidade**

* **Interface intuitiva** com ícones e elementos claros.
* **Baixa curva de aprendizado** (tarefas essenciais em até 3 cliques).
* **Compatibilidade** com hardware modesto.

**3) Desempenho e Escalabilidade**

* **Tempo de resposta** ≤ 2s em condições normais.
* **Operação offline** com sincronização posterior.
* **Escala** para múltiplas unidades prisionais sem degradação perceptível.

**4) Confiabilidade e Manutenibilidade**

* **Integridade de dados**: 0% de perda em sincronizações, mesmo com falhas de rede/energia.
* **Boas práticas** (SOLID, Clean Code) e convenções.
* **Testes automatizados**: cobertura **≥ 80%** (unitários e integrados).

**5) Matriz de Validação**

| Categoria        | Requisito                                        | Prioridade |
| ---------------- | ------------------------------------------------ | ---------- |
| Segurança        | Criptografia em repouso e em trânsito            | Alto       |
| Usabilidade      | Interface acessível para baixa literacia digital | Alto       |
| Compatibilidade  | Funcionamento em desktops de baixo custo         | Alto       |
| Desempenho       | Tempo de resposta ≤ 2s nas ações principais      | Alto       |
| Confiabilidade   | Nenhuma perda de dados em sincronizações         | Alto       |
| Manutenibilidade | Cobertura de testes ≥ 80%                        | Média      |

---

## 🧭 Roteiro

**Fase 1 – MVP (0–6 meses)**

* Módulo administrativo (cadastro de usuários, cursos e conteúdos)
* Cliente offline (acesso ao conteúdo e registro de progresso)
* Dashboard com estatísticas básicas (alunos ativos, cursos e progresso)
* Base infra (Docker + Django + Next.js)
* Testes de usabilidade/desempenho em ambiente prisional

**Fase 2 – Expansão e Otimização (6–12 meses)**

* Cursos técnico-profissionalizantes
* Relatórios avançados e exportação
* Gamificação (pontuação, conquistas, ranking)
* Sincronização otimizada entre estações
* Monitoramento e segurança aprimorados

**Fase 3 – Evolução e IA (12–24 meses)**

* IA educacional para trilhas personalizadas
* Análises preditivas e relatórios
* Integração com redes externas/APIs governamentais
* Backups automatizados e ambiente redundante
* Versão web ampliada e multiunidade

**📅 Marcos**

| Período         | Entregas-Chave                        | Status    |
| --------------- | ------------------------------------- | --------- |
| 0–6 meses (MVP) | Login, cursos e dashboard             | ✅ Em dev  |
| 6–12 meses      | Relatórios, gamificação e otimizações | 🕒 Futuro |
| 12–24 meses     | IA, automação e integrações externas  | 🕒 Futuro |

---

## 👥 Equipe

| Nome                         | Função                    |
| ---------------------------- | ------------------------- |
| Alice Regina de Souza        | UI/UX                     |
| Axl John Lima da Costa       | Desenvolvedor Front-End   |
| Daniel Alves Silva Filho     | QA                        |
| Daniel Mendonça da Silva     | DEPOIS                    |
| Isaque Perez Maia            | CEO                       |
| Julia da Silva Oliveira      | DevOps                    |
| João Vinícius B. Macedo      | Desenvolvedor Back-End    |
| Lucas Araújo Amorim          | Desenvolvedor Front-End   |
| Nicolas Dias Xavier          | Desenvolvedor Back-End    |
| Renan Quintelo Nascimento    | DevOps                    |
| Rosiely Libertino de Menezes | QA                        |
| Thiago Pena Araújo           | Analista de Negócios (AN) |

---

## 📚 Referências

* **Next.js + TypeScript** — [https://nextjs.org/docs](https://nextjs.org/docs) / [https://www.typescriptlang.org/docs/](https://www.typescriptlang.org/docs/)
* **React** — [https://react.dev/learn](https://react.dev/learn)
* **Django** — [https://docs.djangoproject.com/](https://docs.djangoproject.com/)
* **Django REST Framework** — [https://www.django-rest-framework.org/](https://www.django-rest-framework.org/)
* **SimpleJWT** — [https://django-rest-framework-simplejwt.readthedocs.io/](https://django-rest-framework-simplejwt.readthedocs.io/)
* **Material UI (MUI)** — [https://mui.com/](https://mui.com/)
* **PostgreSQL** — [https://www.postgresql.org/docs/](https://www.postgresql.org/docs/)
* **SQLite** — [https://sqlite.org/docs.html](https://sqlite.org/docs.html)
* **Docker** — [https://docs.docker.com/](https://docs.docker.com/)
* **GitHub Actions** — [https://docs.github.com/actions](https://docs.github.com/actions)
* **OWASP DevSecOps Guideline** — [https://owasp.org/www-project-devsecops-guideline/latest/index.html](https://owasp.org/www-project-devsecops-guideline/latest/index.html)
