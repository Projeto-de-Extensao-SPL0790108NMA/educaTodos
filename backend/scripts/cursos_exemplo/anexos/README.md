# 📎 Pasta de Anexos

Coloque aqui os **materiais complementares** das aulas.

## Formatos suportados:
- `.pdf` (documentos)
- `.txt` (texto)
- `.py` (código Python)
- `.js` (código JavaScript)
- `.zip` (arquivos compactados)
- `.docx` / `.doc` (Word)
- `.xlsx` / `.xls` (Excel)
- Qualquer outro tipo de arquivo

## Exemplo:
```
anexos/
├── guia-instalacao.pdf
├── comandos-basicos.txt
├── exercicios-variaveis.pdf
├── exercicios-loops.pdf
└── solucao-loops.py
```

## Como usar no JSON:
```json
{
  "aulas": [
    {
      "titulo": "Instalação",
      "anexos": [
        {
          "titulo": "Guia de Instalação",
          "arquivo": "anexos/guia-instalacao.pdf"
        },
        {
          "titulo": "Comandos Básicos",
          "arquivo": "anexos/comandos-basicos.txt"
        }
      ]
    }
  ]
}
```

Os arquivos aqui serão copiados para `media/courses/attachments/` durante a importação.
