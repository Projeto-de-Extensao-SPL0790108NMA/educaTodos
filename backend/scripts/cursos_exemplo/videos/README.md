# 🎥 Pasta de Vídeos

Coloque aqui os **vídeos das aulas**.

## Formatos suportados:
- `.mp4` (recomendado)
- `.webm`
- `.mkv`
- `.avi`

## Exemplo:
```
videos/
├── aula01-instalacao.mp4
├── aula02-variaveis.mp4
├── aula03-condicionais.mp4
└── matematica-01-adicao-subtracao.mp4
```

## Como usar no JSON:
```json
{
  "aulas": [
    {
      "titulo": "Instalação e Configuração",
      "video": "videos/aula01-instalacao.mp4"
    }
  ]
}
```

Os arquivos aqui serão copiados para `media/courses/videos/` durante a importação.
