#!/bin/bash

# Script de despliegue para MueblesWow
echo "🚀 Iniciando despliegue de MueblesWow..."

# Verificar que Docker esté instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor, instala Docker primero."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado. Por favor, instala Docker Compose primero."
    exit 1
fi

# Crear archivo .env si no existe
if [ ! -f .env ]; then
    echo "📝 Creando archivo .env desde env.example..."
    cp env.example .env
    echo "⚠️  Por favor, edita el archivo .env con tus configuraciones antes de continuar."
    echo "   Especialmente importante: POSTGRES_PASSWORD y JWT_SECRET"
    read -p "¿Has configurado el archivo .env? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Despliegue cancelado. Configura el archivo .env y vuelve a ejecutar el script."
        exit 1
    fi
fi

# Detener contenedores existentes
echo "🛑 Deteniendo contenedores existentes..."
docker-compose down

# Construir y levantar los servicios
echo "🔨 Construyendo y levantando servicios..."
docker-compose up --build -d

# Esperar a que la base de datos esté lista
echo "⏳ Esperando a que la base de datos esté lista..."
sleep 10

# Ejecutar migraciones
echo "🗄️  Ejecutando migraciones de la base de datos..."
docker-compose exec backend npx prisma migrate deploy

# Ejecutar seed
echo "🌱 Ejecutando seed de la base de datos..."
docker-compose exec backend npx prisma db seed

# Verificar que los servicios estén funcionando
echo "🔍 Verificando servicios..."
sleep 5

# Verificar backend
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Backend funcionando correctamente"
else
    echo "❌ Error: Backend no responde"
fi

# Verificar frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend funcionando correctamente"
else
    echo "❌ Error: Frontend no responde"
fi

# Verificar panel público
if curl -f http://localhost:3002 > /dev/null 2>&1; then
    echo "✅ Panel público funcionando correctamente"
else
    echo "❌ Error: Panel público no responde"
fi

echo ""
echo "🎉 ¡Despliegue completado!"
echo ""
echo "📋 URLs de acceso:"
echo "   🔐 Panel Admin:     http://localhost:3000"
echo "   👥 Panel Clientes:  http://localhost:3002"
echo "   🔧 Backend API:     http://localhost:3001"
echo ""
echo "🔑 Credenciales por defecto:"
echo "   Usuario: admin"
echo "   Contraseña: muebleswow"
echo ""
echo "📊 Para ver los logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 Para detener los servicios:"
echo "   docker-compose down"
