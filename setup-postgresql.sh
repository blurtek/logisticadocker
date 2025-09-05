#!/bin/bash

echo "🐘 Configurando PostgreSQL para MueblesWow..."

# Verificar si PostgreSQL está instalado
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL no está instalado."
    echo "📦 Instalando PostgreSQL..."
    
    # Detectar el sistema operativo
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Ubuntu/Debian
        sudo apt update
        sudo apt install -y postgresql postgresql-contrib
        sudo systemctl start postgresql
        sudo systemctl enable postgresql
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        brew install postgresql
        brew services start postgresql
    else
        echo "❌ Sistema operativo no soportado. Instala PostgreSQL manualmente."
        exit 1
    fi
fi

echo "✅ PostgreSQL instalado y ejecutándose"

# Crear base de datos y usuario
echo "🗄️ Configurando base de datos..."

# Crear usuario y base de datos
sudo -u postgres psql -c "CREATE USER muebleswow WITH PASSWORD 'muebleswow123';" 2>/dev/null || echo "Usuario ya existe"
sudo -u postgres psql -c "CREATE DATABASE muebleswow OWNER muebleswow;" 2>/dev/null || echo "Base de datos ya existe"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE muebleswow TO muebleswow;" 2>/dev/null

echo "✅ Base de datos 'muebleswow' creada"

# Crear archivo .env con la configuración de PostgreSQL
cat > backend/.env << EOF
# Base de datos PostgreSQL
DATABASE_URL="postgresql://muebleswow:muebleswow123@localhost:5432/muebleswow"

# JWT Secret (cambiar en producción)
JWT_SECRET="muebleswow-secret-key"

# Puerto del servidor
PORT=3001
EOF

echo "✅ Archivo .env configurado con PostgreSQL"

# Instalar dependencias de PostgreSQL
echo "📦 Instalando dependencias de PostgreSQL..."
cd backend
npm install pg @types/pg

# Generar cliente de Prisma
echo "🔧 Generando cliente de Prisma..."
npx prisma generate

# Ejecutar migraciones
echo "🗄️ Ejecutando migraciones..."
npx prisma migrate reset --force
npx prisma migrate dev --name init_postgresql

# Ejecutar seed
echo "🌱 Poblando base de datos..."
npm run db:seed

cd ..

echo "🎉 ¡PostgreSQL configurado correctamente!"
echo ""
echo "📊 Información de la base de datos:"
echo "   Host: localhost"
echo "   Puerto: 5432"
echo "   Base de datos: muebleswow"
echo "   Usuario: muebleswow"
echo "   Contraseña: muebleswow123"
echo ""
echo "🚀 Para iniciar el proyecto:"
echo "   npm run dev"
echo ""
echo "💡 Para acceder a la base de datos:"
echo "   psql -h localhost -U muebleswow -d muebleswow"
