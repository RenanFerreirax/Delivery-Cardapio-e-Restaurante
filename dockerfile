FROM node:22-slim AS builder
WORKDIR /app

# Instala OpenSSL necessário para Prisma
RUN apt-get update && apt-get install -y openssl

# Copia manifests primeiro (cache)
COPY package*.json ./

# Instala dependências
RUN npm ci

# Copia código
COPY . .

# Gera Prisma Client
RUN npx prisma generate

# ─── Imagem final ────────────────────────────────────────────────────────────
FROM node:22-slim
WORKDIR /app

# OpenSSL runtime
RUN apt-get update && apt-get install -y openssl \
    && rm -rf /var/lib/apt/lists/*

# Copia arquivos do build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

ENV NODE_ENV=production
ENV PORT=9521

# Porta
EXPOSE 9521

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:9521/restaurantes || exit 1

CMD ["node", "src/server.js"]
