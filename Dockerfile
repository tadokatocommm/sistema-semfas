# Dockerfile - Para Ambiente de Produção

# Estágio 1: Base

FROM node:20-alpine AS base
WORKDIR /app

# Estágio 2: Builder

FROM base AS builder
RUN apk add --no-cache libc6-compat
COPY package.json yarn.lock* package-lock.json* ./
RUN yarn install --frozen-lockfile
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN yarn build

# Estágio 3: Runner
FROM base AS runner
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/.next/standalone .

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]