# Dockerfile - Para Ambiente de Produção

# Estágio 1: Base
# Define a imagem base para os outros estágios
FROM node:20-alpine AS base
WORKDIR /app

# Estágio 2: Builder
# Instala dependências e gera a build de produção
FROM base AS builder
RUN apk add --no-cache libc6-compat
COPY package.json yarn.lock* package-lock.json* ./
RUN yarn install --frozen-lockfile
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN yarn build

# Estágio 3: Runner
# Executa a aplicação a partir da build otimizada "standalone"
FROM base AS runner
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Copia a pasta standalone, que contém tudo o que é necessário para rodar
COPY --from=builder /app/.next/standalone .

# Copia os assets públicos e os assets estáticos da build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

# O comando para iniciar a aplicação standalone é diferente
CMD ["node", "server.js"]