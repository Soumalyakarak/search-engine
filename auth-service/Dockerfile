# ---------- Dependencies ----------
    FROM node:20-alpine AS deps

    WORKDIR /app
    
    COPY package.json package-lock.json ./
    
    RUN npm ci
    
    
# ---------- Build ----------
    FROM node:20-alpine AS builder
    
    WORKDIR /app
    
    COPY --from=deps /app/node_modules ./node_modules
    COPY package.json package-lock.json ./
    COPY tsconfig.json ./
    COPY prisma ./prisma
    COPY src ./src
    
    RUN npx prisma generate
    RUN npm run build
    
    
# ---------- Production ----------
    FROM node:20-alpine AS runner
    
    WORKDIR /app
    
    ENV NODE_ENV=production
    ENV PORT=6001
    
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/dist ./dist
    COPY --from=builder /app/prisma ./prisma
    COPY --from=builder /app/src/utils/email-template ./src/utils/email-template
    COPY package.json ./
    
    EXPOSE 6001
    
    CMD ["npm", "start"]