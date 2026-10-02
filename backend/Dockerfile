FROM node:20-alpine AS builder

WORKDIR /app

# Copy root and workspace packages
COPY package.json package-lock.json* ./
COPY shared/package.json ./shared/
COPY backend/package.json ./backend/

RUN npm install

COPY shared/ ./shared/
COPY backend/ ./backend/

RUN npm run build --workspace=backend

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/package.json ./backend/

EXPOSE 3001

CMD ["node", "backend/dist/index.js"]
