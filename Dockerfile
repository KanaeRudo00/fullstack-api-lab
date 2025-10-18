# ---------- Builder stage ----------
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---------- Runner stage ----------
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HUSKY=0  

COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev --ignore-scripts 

COPY --from=builder /app/dist ./dist

EXPOSE 9000
CMD ["node", "dist/index.js"]
