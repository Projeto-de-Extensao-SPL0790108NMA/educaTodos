# backend/Dockerfile

# 1. Base
FROM python:3.11-slim

# 2. Define variáveis de ambiente
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# 3. Define o diretório de trabalho
WORKDIR /app

# 4. Instala dependências
# Copia primeiro o requirements.txt para aproveitar o cache do Docker
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copia o resto do código da aplicação
COPY . .

# 6. Expõe a porta (standard do gunicorn/django)
EXPOSE 8000

# 7. Comando para executar a aplicação
# NOTA: Certifique-se de adicionar 'gunicorn' ao seu ficheiro requirements.txt
CMD ["gunicorn", "conhecimento_livre.wsgi:application", "--bind", "0.0.0.0:8000"]