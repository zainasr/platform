# ---------- runtime ----------
    FROM node:20-alpine

    WORKDIR /app
    
    RUN addgroup -S app && adduser -S app -G app
    
    COPY package*.json ./
    RUN npm ci --omit=dev
    
    COPY src ./src
    
    USER 65532:65532

    EXPOSE 3000
    
    CMD ["node", "src/server.js"]
    
