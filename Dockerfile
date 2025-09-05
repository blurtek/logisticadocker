# Dockerfile para Coolify - Panel MueblesWow
FROM node:18-alpine

# Instalar dependencias del sistema
RUN apk add --no-cache \
    nginx \
    postgresql-client \
    curl \
    bash

# Crear directorios necesarios
RUN mkdir -p /app /var/log/nginx /var/cache/nginx /etc/nginx

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración
COPY nginx-simple.conf /etc/nginx/nginx.conf
COPY nginx/mime.types /etc/nginx/mime.types
COPY start.sh /app/start.sh
COPY init-db.sql /app/init-db.sql
COPY env.example /app/.env

# Hacer ejecutable el script de inicio
RUN chmod +x /app/start.sh

# Instalar dependencias del backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --only=production

# Copiar código del backend
COPY backend/ ./

# Instalar dependencias del frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci

# Copiar código del frontend y hacer build
COPY frontend/ ./
RUN npm run build

# Instalar dependencias del panel público
WORKDIR /app/public
COPY public/package*.json ./
RUN npm ci

# Copiar código del panel público y hacer build
COPY public/ ./
RUN npm run build

# Volver al directorio raíz
WORKDIR /app

# Exponer puerto 80
EXPOSE 80

# Comando de inicio
CMD ["./start.sh"]