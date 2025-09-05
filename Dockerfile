# Dockerfile simplificado para Coolify
FROM node:18-alpine

# Instalar dependencias del sistema
RUN apk add --no-cache nginx postgresql-client curl

# Crear usuario postgres
RUN adduser -D -s /bin/sh postgres

# Crear directorios necesarios
RUN mkdir -p /var/lib/postgresql/data /var/log/nginx /etc/nginx/ssl /app/logs
RUN chown -R postgres:postgres /var/lib/postgresql/data

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración
COPY init-db.sql ./
COPY env.example ./

# Copiar configuración de Nginx
COPY nginx-simple.conf /etc/nginx/nginx.conf
COPY nginx/mime.types /etc/nginx/mime.types

# Copiar código del backend
COPY backend/ ./backend/
WORKDIR /app/backend

# Instalar dependencias del backend
RUN npm ci --only=production

# Generar cliente de Prisma
RUN npx prisma generate

# Compilar backend
RUN npm run build

# Copiar código del frontend
WORKDIR /app
COPY frontend/ ./frontend/
WORKDIR /app/frontend

# Instalar dependencias del frontend
RUN npm ci --only=production

# Construir frontend
RUN npm run build

# Copiar código del panel público
WORKDIR /app
COPY public/ ./public/
WORKDIR /app/public

# Instalar dependencias del panel público
RUN npm ci --only=production

# Construir panel público
RUN npm run build

# Volver al directorio raíz
WORKDIR /app

# Copiar script de inicio
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Exponer puerto
EXPOSE 80

# Comando de inicio
CMD ["/app/start.sh"]
