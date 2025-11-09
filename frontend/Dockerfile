# frontend/Dockerfile

# --- Estágio 1: Build ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copia os ficheiros de dependência
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o resto do código-fonte
COPY . .

# Constrói a aplicação para produção
# NOTA: Verifique o script "build" no seu package.json
RUN npm run build

# --- Estágio 2: Produção ---
FROM node:20-alpine AS runner

WORKDIR /app

# Define o ambiente para produção
ENV NODE_ENV production

# Copia os artefactos de build do estágio anterior
# Esta abordagem usa o output "standalone" do Next.js, que é o ideal.
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Expõe a porta (standard do Next.js)
EXPOSE 3000

# Comando para iniciar o servidor Next.js
CMD ["node", "server.js"]