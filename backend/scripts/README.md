# 🛠️ Scripts do educaTodos

Esta pasta contém scripts utilitários para gerenciamento do sistema.

## 📜 Scripts Disponíveis

### 1. `create_users.py`
Cria usuários e detentos (inmates) para testes.

**Uso:**
```bash
cd /home/eligado/educaTodos/backend
python scripts/create_users.py
```

**Funcionalidades:**
- Criação de superusuários (opcional)
- Criação de inmates com matrículas no formato DL-YYYY-NNNN
- Geração de nomes brasileiros aleatórios
- Exportação de credenciais para arquivo

---

### 2. `import_courses.py`
Importa cursos completos a partir de um arquivo JSON.

**Uso:**
```bash
cd /home/eligado/educaTodos/backend
python scripts/import_courses.py scripts/cursos_exemplo/exemplo_cursos.json
```

**Funcionalidades:**
- Importa cursos com seções, aulas e anexos
- Faz upload automático de imagens, vídeos e anexos
- Valida estrutura do JSON antes de importar
- Exibe progresso detalhado durante a importação

**Documentação completa:** [IMPORT_COURSES_README.md](./IMPORT_COURSES_README.md)

---

## 📁 Estrutura

```
scripts/
├── README.md                      # Este arquivo
├── IMPORT_COURSES_README.md       # Documentação detalhada de importação
├── create_users.py                # Script de criação de usuários
├── import_courses.py              # Script de importação de cursos
└── cursos_exemplo/                # Exemplo de estrutura para importação
    ├── exemplo_cursos.json        # JSON de exemplo
    ├── imagens/                   # Imagens dos cursos (capas)
    │   └── README.md
    ├── videos/                    # Vídeos das aulas
    │   └── README.md
    └── anexos/                    # Materiais complementares
        └── README.md
```

---

## 🚀 Início Rápido

### Criando usuários de teste:
```bash
cd /home/eligado/educaTodos/backend
python scripts/create_users.py
```

### Importando cursos de exemplo:
```bash
cd /home/eligado/educaTodos/backend
python scripts/import_courses.py scripts/cursos_exemplo/exemplo_cursos.json
```

**Nota:** Antes de importar, adicione os arquivos de mídia (imagens, vídeos, anexos) nas pastas correspondentes dentro de `cursos_exemplo/`.

---

## 📝 Notas Importantes

1. **Todos os scripts devem ser executados do diretório `/backend`**
2. Os caminhos no JSON devem ser relativos ao diretório onde está o JSON
3. Arquivos não encontrados geram avisos mas não impedem a importação
4. O banco de dados SQLite pode travar se houver múltiplos acessos simultâneos

---

## 🆘 Ajuda

Para mais detalhes sobre importação de cursos, consulte:
- [IMPORT_COURSES_README.md](./IMPORT_COURSES_README.md)

Para dúvidas sobre o formato do JSON:
- Veja o arquivo [cursos_exemplo/exemplo_cursos.json](./cursos_exemplo/exemplo_cursos.json)
