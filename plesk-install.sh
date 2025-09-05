#!/bin/bash

# Script de instalación específico para Plesk
# Ejecutar como root: sudo ./plesk-install.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Instalación de MueblesWow para Plesk${NC}"
echo "================================================"

# Verificar que estamos como root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}❌ Este script debe ejecutarse como root${NC}"
    echo "Uso: sudo ./plesk-install.sh"
    exit 1
fi

# Obtener directorio actual
CURRENT_DIR=$(pwd)
echo -e "${BLUE}📁 Directorio: $CURRENT_DIR${NC}"

# 1. Arreglar permisos
echo -e "${YELLOW}🔧 Configurando permisos...${NC}"
chown -R plesk:psacln "$CURRENT_DIR"
chmod -R 755 "$CURRENT_DIR"

# Crear directorios node_modules con permisos correctos
mkdir -p "$CURRENT_DIR/node_modules"
chown -R plesk:psacln "$CURRENT_DIR/node_modules"
chmod -R 755 "$CURRENT_DIR/node_modules"

for dir in backend frontend public; do
    if [ -d "$CURRENT_DIR/$dir" ]; then
        echo -e "${BLUE}📁 Configurando $dir...${NC}"
        chown -R plesk:psacln "$CURRENT_DIR/$dir"
        chmod -R 755 "$CURRENT_DIR/$dir"
        
        mkdir -p "$CURRENT_DIR/$dir/node_modules"
        chown -R plesk:psacln "$CURRENT_DIR/$dir/node_modules"
        chmod -R 755 "$CURRENT_DIR/$dir/node_modules"
    fi
done

# 2. Instalar dependencias como usuario plesk
echo -e "${YELLOW}📦 Instalando dependencias...${NC}"

# Instalar dependencias raíz
echo -e "${BLUE}📦 Instalando dependencias raíz...${NC}"
sudo -u plesk npm install --ignore-scripts

# Instalar dependencias backend
echo -e "${BLUE}📦 Instalando dependencias backend...${NC}"
cd backend
sudo -u plesk npm install --ignore-scripts
sudo -u plesk npm run build
cd ..

# Instalar dependencias frontend
echo -e "${BLUE}📦 Instalando dependencias frontend...${NC}"
cd frontend
sudo -u plesk npm install --ignore-scripts
sudo -u plesk npm run build
cd ..

# Instalar dependencias public
echo -e "${BLUE}📦 Instalando dependencias public...${NC}"
cd public
sudo -u plesk npm install --ignore-scripts
sudo -u plesk npm run build
cd ..

# 3. Configurar base de datos
echo -e "${YELLOW}🗄️ Configurando base de datos...${NC}"
cd backend
sudo -u plesk npx prisma generate
sudo -u plesk npx prisma migrate deploy
sudo -u plesk npx prisma db seed
cd ..

# 4. Verificar estructura
echo -e "${YELLOW}🔍 Verificando estructura...${NC}"
sudo -u plesk node verify-structure.js

# 5. Configurar permisos finales
echo -e "${YELLOW}🔧 Configurando permisos finales...${NC}"
chown -R plesk:psacln "$CURRENT_DIR"
chmod -R 755 "$CURRENT_DIR"

echo ""
echo -e "${GREEN}🎉 ¡Instalación completada exitosamente!${NC}"
echo ""
echo -e "${YELLOW}📋 Configuración en Plesk:${NC}"
echo "1. Ir a Panel Plesk → Dominios → logistica.muebleswow.com"
echo "2. Pestaña 'Node.js'"
echo "3. Configurar:"
echo "   - Versión: Node.js 18.x o superior"
echo "   - Archivo de inicio: app.js"
echo "   - Raíz de aplicación: /"
echo "   - Puerto: 3000"
echo "4. Variables de entorno:"
echo "   - NODE_ENV=production"
echo "   - DATABASE_URL=postgresql://muebleswow:muebleswow123@localhost:5432/muebleswow"
echo "   - JWT_SECRET=tu_jwt_secret_muy_seguro"
echo "5. Hacer clic en 'Iniciar aplicación'"
echo ""
echo -e "${BLUE}🔗 La aplicación estará disponible en:${NC}"
echo "https://logistica.muebleswow.com"
echo ""
echo -e "${GREEN}✅ ¡Listo para usar!${NC}"
