#!/bin/sh

echo "🚀 Iniciando MueblesWow en Coolify..."

# Configurar variables de entorno
export NODE_ENV=production

# Usar la base de datos de Coolify si está disponible
if [ -n "$DATABASE_URL" ]; then
    echo "📊 Usando base de datos de Coolify: $DATABASE_URL"
else
    # Fallback a configuración local
    export DATABASE_URL="postgresql://muebleswow:${POSTGRES_PASSWORD:-muebleswow123}@localhost:5432/muebleswow"
    echo "📊 Usando base de datos local: $DATABASE_URL"
fi

# Ejecutar migraciones
echo "🗄️ Ejecutando migraciones..."
cd /app/backend
npx prisma migrate deploy

# Ejecutar seed
echo "🌱 Ejecutando seed..."
npx prisma db seed

# Iniciar backend
echo "🔧 Iniciando backend..."
npm start &
BACKEND_PID=$!

# Esperar a que el backend esté listo
echo "⏳ Esperando backend..."
sleep 10

# Verificar que el backend esté funcionando
for i in $(seq 1 30); do
    if curl -f http://localhost:3001/health > /dev/null 2>&1; then
        echo "✅ Backend listo"
        break
    fi
    echo "Esperando backend... ($i/30)"
    sleep 2
done

# Iniciar Nginx
echo "🌐 Iniciando Nginx..."
nginx -g "daemon off;" &
NGINX_PID=$!

echo "🎉 MueblesWow iniciado correctamente!"
echo "📋 URLs disponibles:"
echo "   🔐 Panel Admin:     http://localhost/"
echo "   👥 Panel Clientes:  http://localhost/public/"
echo "   🔧 Backend API:     http://localhost/api/"

# Función de limpieza
cleanup() {
    echo "🛑 Deteniendo servicios..."
    kill $BACKEND_PID $NGINX_PID 2>/dev/null
    exit 0
}

# Capturar señales de terminación
trap cleanup SIGTERM SIGINT

# Mantener el script ejecutándose
wait