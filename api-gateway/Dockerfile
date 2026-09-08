# ---------- Dependencies ----------
    FROM node:20-alpine AS deps

    WORKDIR /app
    
    COPY package.json package-lock.json ./
    
    RUN npm ci
    
    
    # ---------- Production ----------
    FROM node:20-alpine AS runner
    
    WORKDIR /app
    
    ENV NODE_ENV=production
    
    COPY --from=deps /app/node_modules ./node_modules
    COPY package.json ./
    COPY server.js ./
    
    EXPOSE 5000
    
    CMD ["npm", "start"]