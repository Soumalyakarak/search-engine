# ---------- Dependencies ----------
    FROM node:20-alpine AS deps

    WORKDIR /app/search-service
    
    COPY search-service/package.json search-service/package-lock.json ./
    
    RUN npm ci
    
    
    # ---------- Production ----------
    FROM node:20-alpine AS runner
    
    WORKDIR /app/search-service
    
    ENV NODE_ENV=production
    ENV PORT=4000
    
    COPY --from=deps /app/search-service/node_modules ./node_modules
    
    COPY search-service/package.json ./
    COPY search-service/server.js ./
    COPY search-service/controllers ./controllers
    COPY search-service/middleware ./middleware
    COPY search-service/routes ./routes
    COPY search-service/services ./services
    COPY search-service/utils ./utils
    
    # Search data generated outside the service
    COPY data ./../data
    
    EXPOSE 4000
    
    CMD ["node", "server.js"]