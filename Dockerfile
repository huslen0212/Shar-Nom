FROM node:20-bullseye-slim AS builder
WORKDIR /app

# copy repo sources needed for build
COPY package.json package-lock.json nx.json ./
COPY tsconfig.base.json ./
COPY eslint.config.mjs ./

COPY apps/ ./apps/
COPY libs/ ./libs/
COPY prisma/ ./prisma

RUN npm install --legacy-peer-deps

RUN npx prisma generate || true

RUN npx nx build @shar-nom/web --prod

FROM node:20-bullseye-slim AS runner
WORKDIR /app

COPY --from=builder /app/apps/web ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npx", "next", "start", "--hostname", "0.0.0.0", "--port", "3000"]
