#!/bin/bash

# Script de construcción rápida para Plesk
# Ejecutar como root: sudo ./quick-build.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Construcción rápida para Plesk${NC}"
echo "================================================"

# Obtener directorio actual
CURRENT_DIR=$(pwd)
echo -e "${BLUE}📁 Directorio: $CURRENT_DIR${NC}"

# Detectar usuario correcto
echo -e "${YELLOW}🔍 Detectando usuario correcto...${NC}"
DOMAIN_OWNER=$(ls -ld /var/www/vhosts/blurtek.com/ | awk '{print $3}')
DOMAIN_GROUP=$(ls -ld /var/www/vhosts/blurtek.com/ | awk '{print $4}')

echo -e "${BLUE}👤 Usuario detectado: $DOMAIN_OWNER${NC}"
echo -e "${BLUE}👥 Grupo detectado: $DOMAIN_GROUP${NC}"

# 1. Construir backend
echo -e "${YELLOW}🔨 Construyendo backend...${NC}"
cd backend
sudo -u "$DOMAIN_OWNER" npm run build
cd ..

# 2. Construir frontend
echo -e "${YELLOW}🔨 Construyendo frontend...${NC}"
cd frontend
sudo -u "$DOMAIN_OWNER" npm run build
cd ..

# 3. Construir panel público
echo -e "${YELLOW}🔨 Construyendo panel público...${NC}"
cd public
sudo -u "$DOMAIN_OWNER" npm run build
cd ..

# 4. Configurar permisos
echo -e "${YELLOW}🔧 Configurando permisos...${NC}"
chown -R "$DOMAIN_OWNER:$DOMAIN_GROUP" "$CURRENT_DIR"
chmod -R 755 "$CURRENT_DIR"

# 5. Verificar estructura
echo -e "${YELLOW}🔍 Verificando estructura...${NC}"
sudo -u "$DOMAIN_OWNER" node verify-structure.js

echo ""
echo -e "${GREEN}🎉 ¡Construcción completada!${NC}"
echo ""
echo -e "${YELLOW}📋 Verificar en Plesk:${NC}"
echo "1. Archivo de inicio: app.js"
echo "2. Puerto: 3000"
echo "3. Variables de entorno configuradas"
echo "4. Hacer clic en 'Iniciar aplicación'"
echo ""
echo -e "${BLUE}🔗 URLs:${NC}"
echo "• Panel Admin: https://logistica.muebleswow.com"
echo "• Panel Clientes: https://logistica.muebleswow.com/client"
echo "• API Health: https://logistica.muebleswow.com/health"
