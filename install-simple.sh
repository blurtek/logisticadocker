#!/bin/bash

# Script de instalación simple para Plesk
# Evita el problema del postinstall automático

set -e

echo "🚀 Instalación Simple de MueblesWow"
echo "==================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Crear directorio de logs
mkdir -p logs

echo -e "${BLUE}📦 Instalando dependencias principales...${NC}"
npm install --ignore-scripts

echo -e "${YELLOW}📦 Instalando dependencias del backend...${NC}"
cd backend && npm install --ignore-scripts && cd ..

echo -e "${YELLOW}📦 Instalando dependencias del frontend...${NC}"
cd frontend && npm install --ignore-scripts && cd ..

echo -e "${YELLOW}📦 Instalando dependencias del panel público...${NC}"
cd public && npm install --ignore-scripts && cd ..

echo -e "${GREEN}✅ Dependencias instaladas correctamente${NC}"

echo -e "${BLUE}🔨 Construyendo aplicación...${NC}"

echo -e "${YELLOW}🔨 Construyendo frontend...${NC}"
cd frontend && npm run build && cd ..

echo -e "${YELLOW}🔨 Construyendo panel público...${NC}"
cd public && npm run build && cd ..

echo -e "${YELLOW}🔨 Construyendo backend...${NC}"
cd backend && npm run build && cd ..

echo -e "${GREEN}✅ Aplicación construida correctamente${NC}"

echo -e "${BLUE}🗄️ Configurando base de datos...${NC}"

# Generar cliente Prisma
cd backend && npx prisma generate && cd ..

# Ejecutar migraciones
echo -e "${YELLOW}🗄️ Ejecutando migraciones...${NC}"
cd backend && npx prisma migrate deploy && cd ..

# Poblar datos iniciales
echo -e "${YELLOW}🗄️ Poblando datos iniciales...${NC}"
cd backend && npx prisma db seed && cd ..

echo -e "${GREEN}✅ Base de datos configurada correctamente${NC}"

echo ""
echo -e "${GREEN}🎉 ¡Instalación completada exitosamente!${NC}"
echo ""
echo -e "${YELLOW}📋 Pasos siguientes en Plesk:${NC}"
echo "1. Ir a Panel Plesk → Dominios → logistica.muebleswow.com"
echo "2. Pestaña 'Node.js'"
echo "3. Configurar:"
echo "   - Versión: Node.js 18.x o superior"
echo "   - Aplicación: /var/www/vhosts/blurtek.com/logistica.muebleswow.com"
echo "   - Archivo de inicio: backend/dist/index.js"
echo "   - Documento raíz: /var/www/vhosts/blurtek.com/logistica.muebleswow.com"
echo "4. Configurar variables de entorno"
echo "5. Hacer clic en 'Iniciar aplicación'"
echo ""
echo -e "${BLUE}🔗 La aplicación estará disponible en:${NC}"
echo "• Panel Admin: https://logistica.muebleswow.com"
echo "• Panel Clientes: https://logistica.muebleswow.com/client"
echo "• API: https://logistica.muebleswow.com/api/health"
