#!/bin/bash
set -e

echo "🚀 Iniciando MueblesWow en Coolify..."

# Configurar variables de entorno
export NODE_ENV=production
export PORT=3001

# Función de logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

log "📋 Configuración inicial..."

# Si DATABASE_URL no está configurado, usar SQLite temporal
if [ -z "$DATABASE_URL" ]; then
    log "⚠️ DATABASE_URL no configurado, usando SQLite temporal"
    export DATABASE_URL="file:./dev.db"
fi

log "📊 DATABASE_URL configurado"

# Ir al directorio backend
cd /app/backend

# Intentar migraciones (sin fallar si no funciona)
log "🗄️ Intentando migraciones..."
if npx prisma migrate deploy 2>/dev/null; then
    log "✅ Migraciones completadas"
else
    log "⚠️ Migraciones fallaron, continuando..."
fi

# Intentar seed (sin fallar si no funciona)
log "🌱 Intentando seed..."
if npx prisma db seed 2>/dev/null; then
    log "✅ Seed completado"
else
    log "⚠️ Seed falló, continuando..."
fi

# Iniciar el backend en background
log "🔧 Iniciando backend en puerto 3001..."
npm start &
BACKEND_PID=$!

# Dar tiempo al backend para iniciar
sleep 5

# Verificar que el backend esté ejecutándose
if kill -0 $BACKEND_PID 2>/dev/null; then
    log "✅ Backend iniciado (PID: $BACKEND_PID)"
else
    log "❌ Backend no se pudo iniciar"
fi

# Configurar nginx para que funcione
log "🌐 Configurando Nginx..."

# Crear configuración simple de nginx
cat > /etc/nginx/nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    upstream backend {
        server 127.0.0.1:3001;
    }
    
    server {
        listen 80;
        server_name _;
        
        # Panel Admin
        location / {
            root /app/frontend/dist;
            index index.html;
            try_files $uri $uri/ /index.html;
        }
        
        # Panel Público
        location /public/ {
            alias /app/public/dist/;
            index index.html;
            try_files $uri $uri/ /public/index.html;
        }
        
        # API Backend
        location /api/ {
            proxy_pass http://backend/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
        
        # Health check
        location /health {
            proxy_pass http://backend/health;
            proxy_set_header Host $host;
        }
    }
}
EOF

# Probar configuración de nginx
if nginx -t; then
    log "✅ Configuración de Nginx válida"
else
    log "❌ Error en configuración de Nginx"
    exit 1
fi

# Iniciar nginx
log "🌐 Iniciando Nginx..."
nginx -g "daemon off;" &
NGINX_PID=$!

# Verificar que nginx esté ejecutándose
sleep 2
if kill -0 $NGINX_PID 2>/dev/null; then
    log "✅ Nginx iniciado (PID: $NGINX_PID)"
else
    log "❌ Nginx no se pudo iniciar"
    exit 1
fi

log "🎉 MueblesWow iniciado correctamente!"
log "📋 Servicios ejecutándose:"
log "   🔧 Backend PID: $BACKEND_PID"
log "   🌐 Nginx PID: $NGINX_PID"
log "   🔌 Puerto: 80"

# Función de limpieza
cleanup() {
    log "🛑 Deteniendo servicios..."
    kill $BACKEND_PID $NGINX_PID 2>/dev/null || true
    exit 0
}

# Capturar señales de terminación
trap cleanup SIGTERM SIGINT

# Mantener el script ejecutándose
while true; do
    # Verificar que los servicios sigan ejecutándose
    if ! kill -0 $NGINX_PID 2>/dev/null; then
        log "❌ Nginx se detuvo inesperadamente"
        exit 1
    fi
    
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        log "⚠️ Backend se detuvo, reintentando..."
        cd /app/backend
        npm start &
        BACKEND_PID=$!
    fi
    
    sleep 30
done