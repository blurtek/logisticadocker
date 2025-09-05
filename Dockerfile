# Dockerfile funcional para Coolify - MueblesWow
FROM node:18-alpine

# Instalar dependencias del sistema
RUN apk add --no-cache \
    nginx \
    bash \
    curl

# Crear directorio de aplicación
WORKDIR /app

# Instalar dependencias del backend
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copiar código del backend
COPY backend/ ./backend/

# Compilar backend
RUN cd backend && npm run build

# Instalar dependencias del frontend
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

# Copiar código del frontend
COPY frontend/ ./frontend/

# Construir frontend
RUN cd frontend && npm run build

# Instalar dependencias del panel público
COPY public/package*.json ./public/
RUN cd public && npm install

# Copiar código del panel público
COPY public/ ./public/

# Construir panel público
RUN cd public && npm run build

# Copiar script de inicio
COPY start.sh ./start.sh
RUN chmod +x ./start.sh

# Crear directorios para nginx
RUN mkdir -p /var/log/nginx /var/cache/nginx

# Exponer puerto 80
EXPOSE 80

# Iniciar aplicación
CMD ["./start.sh"]