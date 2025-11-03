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

- [📘 Descrição do Projeto](#-descrição-do-projeto)
- [🎯 Problema e Oportunidade](#-problema-e-oportunidade)
- [💡 Solução Proposta](#-solução-proposta)
- [⚙ Tecnologias-Chave](#-tecnologias-chave)
- [📂 Estrutura do Projeto](#-estrutura-do-projeto)
- [📦 Instalação e Execução](#-instalação-e-execução)
- [🔐 Requisitos Não Funcionais](#-requisitos-não-funcionais)
- [🧭 Roadmap](#-roadmap)
- [👥 Equipe](#-equipe)
- [📚 Referências](#-referências)

---

## 🧭 Descrição do Projeto

O *Conhecimento Livre* é um sistema de ensino digital voltado para o *ambiente prisional brasileiro, com o objetivo de* *reduzir as taxas de reincidência criminal* através da *educação e qualificação profissional*.  

A plataforma é composta por dois módulos principais:
- *Aplicação Mestre (Administrativa):* utilizada por administradores e instrutores.
- *Aplicação Cliente (Aluno):* executada nos computadores dos detentos, em modo *100% offline*.

A solução é inovadora por combinar *tecnologia educacional (EdTech) e* *segurança reforçada.*

---

## 🎯 Problema e Oportunidade

A reincidência criminal no Brasil pode chegar a *70%* em alguns estados.  
A falta de acesso à educação e qualificação profissional dentro das prisões *contribui diretamente para esse cenário*.  
O *Conhecimento Livre* nasce como resposta a essa lacuna — uma plataforma de ensino *segura, acessível e offline, adaptada ao ambiente prisional e capaz de* *transformar o tempo de reclusão em oportunidade de aprendizado.*

---

## 💡 Solução Proposta

A plataforma *Conhecimento Livre* oferece:
- Cursos modulares (alfabetização, ensino fundamental, técnico-profissionalizante);
- Conteúdo *gamificado e adaptativo*;
- Operação *offline*, com sincronização local controlada;
- *Interface acessível* para públicos com baixa literacia digital;
- *Dashboard administrativo* com métricas de desempenho e relatórios de progresso.

---

## ⚙ Tecnologias-Chave

| Camada            | Tecnologia                      | Descrição                                     |
|-------------------|----------------------------------|-----------------------------------------------|
| Frontend          | React + Next.js + MUI           | UI moderna, responsiva e acessível            |
| Backend           | Django (Python)                 | API segura e escalável                        |
| Banco de Dados    | PostgreSQL (prod) / SQLite (dev)| Armazenamento confiável                       |
| DevOps            | GitHub Actions + Docker         | CI/CD e containerização                       |
| Segurança         | Criptografia + RBAC + Logs      | Proteção de dados e auditoria
---

## 📂 Estrutura do Projeto

```bash
/
├── backend/                         # Aplicação principal em Django (Python)
│   ├── conhecimento_livre/          # Diretório da aplicação Django
│   ├── db.sqlite3                   # Banco de dados local (SQLite)
│   ├── manage.py                    # Script de gerenciamento do Django
│   └── requirements.txt             # Dependências do backend
│
├── frontend/                        # Aplicação web (Next.js + React)
│   ├── public/                      # Arquivos estáticos (imagens, ícones, etc.)
│   ├── src/
│   │   └── app/                     # Código-fonte principal (páginas e componentes)
│   ├── .gitignore                   # Arquivos ignorados pelo Git
│   ├── jsconfig.json                # Configurações do ambiente JS
│   ├── next.config.mjs              # Configurações do Next.js
│   ├── package.json                 # Dependências e scripts npm
│   ├── package-lock.json            # Versões travadas das dependências
│   ├── postcss.config.mjs           # Configuração do PostCSS
│   └── README.md                    # Documentação específica do frontend
│
└── README.md                        # Documentação geral do projeto

```

---

## 📦 Instalação e Execução (Em andamento)

---

## 🔐 Requisitos Não Funcionais

Os requisitos não funcionais do projeto *Conhecimento Livre* definem os padrões de qualidade e as restrições operacionais necessárias para garantir a *segurança,* *usabilidade,* *desempenho* e *manutenibilidade* da plataforma.


### <strong>1. Segurança e Auditoria</strong>

- *Encriptação de Dados:*  
  Todos os dados devem ser protegidos com algoritmos de encriptação robustos, tanto *em repouso* (armazenamento local) quanto *em trânsito* (transferência em rede).  

- *Controle de Acesso (RBAC):*  
  A aplicação deve implementar *níveis de permissão* distintos para administradores, instrutores e alunos.  

- *Logs e Auditoria:*  
  Toda ação crítica do sistema (login, criação, edição e exclusão) deve ser registrada em logs imutáveis.  


### <strong>2. Usabilidade e Acessibilidade</strong>

- *Interface Intuitiva:*  
  O sistema deve priorizar uma interface visual, com *ícones e elementos claros*, reduzindo a necessidade de leitura extensa.  

- *Baixa Curva de Aprendizado:*  
  O usuário deve conseguir executar tarefas essenciais em até *três cliques*.  

- *Compatibilidade com Hardware Modesto:*  
  A aplicação deve funcionar corretamente em computadores de *baixo custo e especificações limitadas*.  


### <strong>3. Desempenho e Escalabilidade</strong>

- *Tempo de Resposta:*  
  A aplicação deve responder às interações do usuário em até *2 segundos* em condições normais de uso.  

- *Processamento Offline:*  
  As operações críticas devem funcionar *sem conexão com a internet*, utilizando sincronização posterior.  

- *Escalabilidade:*  
  A arquitetura do sistema deve suportar aumento no número de usuários, cursos e unidades prisionais *sem degradação significativa* de desempenho.  


### <strong>4. Confiabilidade e Manutenibilidade</strong>

- *Integridade dos Dados:*  
  A transferência e sincronização devem garantir *0% de perda de dados*, mesmo em caso de falhas de rede ou energia.  

- *Código Limpo e Padrões de Projeto:*  
  O sistema deve seguir boas práticas de desenvolvimento (*SOLID, **Clean Code*) e convenções de nomenclatura.  

- *Testes Automatizados:*  
  O sistema deve possuir *cobertura mínima de 80%* com testes unitários e integrados.  


### <strong>5. Matriz de Validação dos Requisitos Não Funcionais</strong>

| Categoria        | Requisito                                                  | Prioridade |
|------------------|-------------------------------------------------------------|-------------|
| *Segurança*    | Encriptação de dados em repouso e em trânsito.              | Alta        |
| *Usabilidade*  | Interface acessível e simples para baixa literacia digital. | Alta        |
| *Compatibilidade* | Funcionamento em desktops de baixo custo.                | Alta        |
| *Desempenho*   | Tempo de resposta ≤ 2s nas ações principais.                | Alta        |
| *Confiabilidade* | Nenhuma perda de dados em sincronizações.                 | Alta        |
| *Manutenibilidade* | Cobertura de testes superior a 80%.                     | Média       | 


---


## 🧭 Roadmap

O desenvolvimento do *Conhecimento Livre* será conduzido em três fases principais, priorizando a entrega progressiva de valor e estabilidade do sistema.


### <strong>Fase 1 – MVP (0–6 meses)</strong>
*Objetivo:* disponibilizar uma versão mínima funcional da plataforma para uso piloto em ambiente controlado.

*Entregas principais:*
- Módulo administrativo (cadastro de usuários, cursos e conteúdos);
- Cliente offline (acesso ao conteúdo e registro de progresso);
- Dashboard com estatísticas básicas (alunos ativos, cursos e progresso);
- Banco de dados inicial e infraestrutura mínima (Docker + Django + Next.js);
- Testes de usabilidade e desempenho em ambiente prisional controlado.


### <strong>Fase 2 – Expansão e Otimização (6–12 meses)</strong>
*Objetivo:* ampliar o escopo do sistema, introduzindo novas funcionalidades e melhorias com base no feedback inicial.

*Entregas principais:*
- Implementação de cursos técnico-profissionalizantes;
- Relatórios avançados e exportação de dados administrativos;
- Mecanismo de gamificação (pontuação, conquistas e ranking);
- Sincronização otimizada entre estações cliente e servidor;
- Integração com módulos de segurança e monitoramento de uso.


### <strong>Fase 3 – Evolução e Inteligência (12–24 meses)</strong>
*Objetivo:* consolidar o sistema como uma solução completa de educação prisional e integrar tecnologias de personalização.

*Entregas principais:*
- Implementação de *IA Educacional* para trilhas personalizadas;
- Análise de dados para geração de relatórios preditivos;
- Integração com redes de ensino externas e APIs governamentais;
- Automação de backups e implantação de ambiente redundante;
- Versão Web ampliada e suporte multiunidade.


### <strong>📅 Marcos Principais</strong>

| Período             | Entregas-Chave                                  | Status Esperado |
|---------------------|--------------------------------------------------|-----------------|
| 0–6 meses (MVP)     | Versão inicial com login, cursos e dashboard     | ✅ Em desenvolvimento |
| 6–12 meses (Expansão) | Relatórios, gamificação e otimizações            | 🕒 Futuro |
| 12–24 meses (Evolução) | IA, automação e integração com parceiros externos | 🕒 Futuro |

---

## 👥 Equipe

| Nome                          | Função               |
|-------------------------------|----------------------|
| Alice Regina de Souza         | UI/UX                |
| Axl John Lima da Costa        | Dev Front-End            |
| Daniel Alves Silva Filho      | QA                   |
| Daniel Mendonça da Silva      | PO                   |
| Isaque Perez Maia             | CEO                  |
| Julia da Silva Oliveira       | DevOps               |
| João Vinícius B. Macedo       | Dev Back-End             |
| Lucas Araújo Amorim           | Dev Front-End             |
| Nicolas Dias Xavier           | Dev Back-End              |
| Renan Quintelo Nascimento | DevOps           |
| Rosiely Libertino de Menezes  | QA                   |
| Thiago Pena Araújo            | Analista de Negócios (AN) |

---

## 📚 Referências (Em andamento)


