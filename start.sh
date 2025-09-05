#!/bin/sh

echo "🚀 Iniciando MueblesWow en Coolify..."

# Configurar variables de entorno
export NODE_ENV=production
export DATABASE_URL="postgresql://muebleswow:${POSTGRES_PASSWORD:-muebleswow123}@localhost:5432/muebleswow"

# Iniciar PostgreSQL
echo "📊 Iniciando PostgreSQL..."
su-exec postgres postgres -D /var/lib/postgresql/data &
PG_PID=$!

# Esperar a que PostgreSQL esté listo
echo "⏳ Esperando PostgreSQL..."
sleep 10

# Verificar que PostgreSQL esté funcionando
until pg_isready -h localhost -p 5432 -U muebleswow; do
    echo "Esperando PostgreSQL..."
    sleep 2
done

echo "✅ PostgreSQL listo"

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
sleep 5

# Verificar que el backend esté funcionando
until curl -f http://localhost:3001/health > /dev/null 2>&1; do
    echo "Esperando backend..."
    sleep 2
done

echo "✅ Backend listo"

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
    kill $BACKEND_PID $NGINX_PID $PG_PID 2>/dev/null
    exit 0
}

# Capturar señales de terminación
trap cleanup SIGTERM SIGINT

# Mantener el script ejecutándose
wait
