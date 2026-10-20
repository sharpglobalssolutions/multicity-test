# syntax=docker/dockerfile:1

# --- deps: install dependencies only (cached separately from source so an
# app-code change doesn't force a full npm reinstall) -----------------------
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# --- builder: generate the Prisma client and build the Next.js app ---------
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Public build-time values get baked into the client bundle, so they must be
# present before `next build`, not just at container run time.
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

RUN npx prisma generate
RUN npm run build

# --- runner: production image ------------------------------------------
# Not using `output: "standalone"` here: its minimal server trace doesn't
# include the Prisma CLI (needed below to run migrations on startup), and
# the CLI's own dependency tree (wasm engines, @prisma/config, etc.) turned
# out too deep to hand-pick reliably. Copying the full `node_modules` is
# simpler and avoids that whole class of "missing transitive dependency"
# failures, at the cost of a larger image.
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh \
  && chown -R nextjs:nodejs /app

USER nextjs
EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["npm", "start"]
