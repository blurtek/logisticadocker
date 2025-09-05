#!/bin/bash

echo "🔍 Diagnóstico de MueblesWow en Coolify"
echo "========================================"

# Verificar servicios
echo "📊 Verificando servicios..."

# Verificar Nginx
if pgrep nginx > /dev/null; then
    echo "✅ Nginx está ejecutándose"
else
    echo "❌ Nginx NO está ejecutándose"
fi

# Verificar Backend
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Backend está ejecutándose"
else
    echo "❌ Backend NO está ejecutándose"
fi

# Verificar puertos
echo "🔌 Verificando puertos..."
netstat -tlnp | grep :80 || echo "❌ Puerto 80 no está abierto"
netstat -tlnp | grep :3001 || echo "❌ Puerto 3001 no está abierto"

# Verificar archivos
echo "📁 Verificando archivos..."
[ -d "/app/frontend/dist" ] && echo "✅ Frontend build existe" || echo "❌ Frontend build NO existe"
[ -d "/app/public/dist" ] && echo "✅ Panel público build existe" || echo "❌ Panel público build NO existe"

# Verificar base de datos
echo "🗄️ Verificando base de datos..."
if [ -n "$DATABASE_URL" ]; then
    echo "✅ DATABASE_URL configurado: $DATABASE_URL"
    if pg_isready -d "$DATABASE_URL" > /dev/null 2>&1; then
        echo "✅ Base de datos accesible"
    else
        echo "❌ Base de datos NO accesible"
    fi
else
    echo "❌ DATABASE_URL no configurado"
fi

# Verificar logs
echo "📋 Últimas líneas de logs:"
echo "--- Nginx Error Log ---"
tail -5 /var/log/nginx/error.log 2>/dev/null || echo "No hay logs de error de nginx"
echo "--- Nginx Access Log ---"
tail -5 /var/log/nginx/access.log 2>/dev/null || echo "No hay logs de acceso de nginx"

echo "========================================"
echo "🏁 Diagnóstico completado"
