#!/bin/bash

echo "🚀 Iniciando MueblesWow (Versión Simple)..."

# Función para logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Configurar variables de entorno
export NODE_ENV=production

# Verificar si DATABASE_URL está configurado
if [ -n "$DATABASE_URL" ]; then
    log "📊 Usando base de datos de Coolify"
    log "DATABASE_URL configurado: ${DATABASE_URL:0:20}..."
else
    log "⚠️ DATABASE_URL no configurado, usando configuración local"
    export DATABASE_URL="postgresql://muebleswow:muebleswow123@localhost:5432/muebleswow"
fi

# Verificar archivos necesarios
log "📁 Verificando archivos..."
[ -d "/app/frontend/dist" ] && log "✅ Frontend build existe" || log "❌ Frontend build NO existe"
[ -d "/app/public/dist" ] && log "✅ Panel público build existe" || log "❌ Panel público build NO existe"

# Intentar ejecutar migraciones (con manejo de errores)
log "🗄️ Ejecutando migraciones..."
cd /app/backend
if npx prisma migrate deploy; then
    log "✅ Migraciones ejecutadas correctamente"
else
    log "⚠️ Error en migraciones, continuando..."
fi

# Intentar ejecutar seed (con manejo de errores)
log "🌱 Ejecutando seed..."
if npx prisma db seed; then
    log "✅ Seed ejecutado correctamente"
else
    log "⚠️ Error en seed, continuando..."
fi

# Iniciar backend
log "🔧 Iniciando backend..."
npm start &
BACKEND_PID=$!

# Esperar a que el backend esté listo (con timeout)
log "⏳ Esperando backend..."
for i in $(seq 1 30); do
    if curl -f http://localhost:3001/health > /dev/null 2>&1; then
        log "✅ Backend listo en puerto 3001"
        break
    fi
    if [ $i -eq 30 ]; then
        log "❌ Backend no respondió después de 60 segundos"
        log "Continuando con Nginx..."
    fi
    sleep 2
done

# Verificar que Nginx esté instalado
if command -v nginx > /dev/null; then
    log "✅ Nginx está instalado"
else
    log "❌ Nginx NO está instalado"
    exit 1
fi

# Iniciar Nginx
log "🌐 Iniciando Nginx..."
nginx -g "daemon off;" &
NGINX_PID=$!

# Verificar que Nginx esté ejecutándose
sleep 2
if pgrep nginx > /dev/null; then
    log "✅ Nginx ejecutándose correctamente"
else
    log "❌ Nginx NO está ejecutándose"
    exit 1
fi

# Verificar puertos
log "🔌 Verificando puertos..."
netstat -tlnp | grep :80 && log "✅ Puerto 80 abierto" || log "❌ Puerto 80 NO abierto"
netstat -tlnp | grep :3001 && log "✅ Puerto 3001 abierto" || log "❌ Puerto 3001 NO abierto"

log "🎉 MueblesWow iniciado correctamente!"
log "📋 URLs disponibles:"
log "   🔐 Panel Admin:     http://localhost/"
log "   👥 Panel Clientes:  http://localhost/public/"
log "   🔧 Backend API:     http://localhost/api/"

# Función de limpieza
cleanup() {
    log "🛑 Deteniendo servicios..."
    kill $BACKEND_PID $NGINX_PID 2>/dev/null
    exit 0
}

# Capturar señales de terminación
trap cleanup SIGTERM SIGINT

# Mantener el script ejecutándose
wait
