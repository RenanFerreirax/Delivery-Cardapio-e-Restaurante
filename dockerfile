FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV DATABASE_URL="mysql://20261_projint5_manha:senac@12938@edumysql.acesso.rj.senac.br:3306/20261_projint5_manha_delivery_cardapio"

RUN npx prisma generate

FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.prisma ./.prisma

ENV NODE_ENV=production
ENV PORT=9521

EXPOSE 9521

HEALTHCHECK \
  --interval=30s \
  --timeout=5s \
  --start-period=15s \
  --retries=3 \
  CMD wget -qO- http://localhost:9521/restaurantes || exit 1

CMD ["node", "src/server.js"]