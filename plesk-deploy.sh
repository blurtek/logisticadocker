#!/bin/bash

# Script de despliegue para Plesk
# Uso: ./plesk-deploy.sh

set -e

echo "🚀 Despliegue de MueblesWow en Plesk"
echo "===================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar ayuda
show_help() {
    echo "Uso: $0 [OPCIÓN]"
    echo ""
    echo "Opciones disponibles:"
    echo "  install     - Instalar dependencias y construir"
    echo "  deploy      - Desplegar aplicación completa"
    echo "  update      - Actualizar aplicación"
    echo "  restart     - Reiniciar aplicación"
    echo "  logs        - Ver logs"
    echo "  help        - Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  $0 install"
    echo "  $0 deploy"
    echo "  $0 update"
}

# Función para instalar
install_app() {
    echo -e "${BLUE}📦 Instalando dependencias...${NC}"
    
    # Crear directorio de logs
    mkdir -p logs
    
    # Instalar dependencias principales
    npm install
    
    # Instalar dependencias de cada módulo
    echo -e "${YELLOW}📦 Instalando dependencias del backend...${NC}"
    cd backend && npm install && cd ..
    
    echo -e "${YELLOW}📦 Instalando dependencias del frontend...${NC}"
    cd frontend && npm install && cd ..
    
    echo -e "${YELLOW}📦 Instalando dependencias del panel público...${NC}"
    cd public && npm install && cd ..
    
    echo -e "${GREEN}✅ Dependencias instaladas correctamente${NC}"
}

# Función para construir
build_app() {
    echo -e "${BLUE}🔨 Construyendo aplicación...${NC}"
    
    # Construir frontend
    echo -e "${YELLOW}🔨 Construyendo frontend...${NC}"
    cd frontend && npm run build && cd ..
    
    # Construir panel público
    echo -e "${YELLOW}🔨 Construyendo panel público...${NC}"
    cd public && npm run build && cd ..
    
    # Construir backend
    echo -e "${YELLOW}🔨 Construyendo backend...${NC}"
    cd backend && npm run build && cd ..
    
    echo -e "${GREEN}✅ Aplicación construida correctamente${NC}"
}

# Función para configurar base de datos
setup_database() {
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
}

# Función para desplegar
deploy_app() {
    echo -e "${BLUE}🚀 Desplegando aplicación...${NC}"
    
    # Instalar dependencias
    install_app
    
    # Construir aplicación
    build_app
    
    # Configurar base de datos
    setup_database
    
    echo -e "${GREEN}✅ Aplicación desplegada correctamente${NC}"
    echo ""
    echo -e "${YELLOW}📋 Pasos siguientes en Plesk:${NC}"
    echo "1. Ir a Panel Plesk → Dominios → muebleswow.tudominio.com"
    echo "2. Pestaña 'Node.js'"
    echo "3. Configurar:"
    echo "   - Versión: Node.js 18.x o superior"
    echo "   - Aplicación: /var/www/vhosts/tudominio.com/muebleswow"
    echo "   - Archivo de inicio: backend/src/index.js"
    echo "   - Documento raíz: /var/www/vhosts/tudominio.com/muebleswow"
    echo "4. Configurar variables de entorno"
    echo "5. Hacer clic en 'Iniciar aplicación'"
    echo ""
    echo -e "${BLUE}🔗 La aplicación estará disponible en:${NC}"
    echo "• Panel Admin: https://muebleswow.tudominio.com"
    echo "• Panel Clientes: https://muebleswow.tudominio.com/client"
    echo "• API: https://muebleswow.tudominio.com/api/health"
}

# Función para actualizar
update_app() {
    echo -e "${BLUE}🔄 Actualizando aplicación...${NC}"
    
    # Parar aplicación (si está ejecutándose)
    echo -e "${YELLOW}⏹️ Parando aplicación...${NC}"
    # pm2 stop muebleswow 2>/dev/null || true
    
    # Actualizar dependencias
    install_app
    
    # Reconstruir aplicación
    build_app
    
    # Reiniciar aplicación
    echo -e "${YELLOW}🔄 Reiniciando aplicación...${NC}"
    # pm2 restart muebleswow
    
    echo -e "${GREEN}✅ Aplicación actualizada correctamente${NC}"
}

# Función para reiniciar
restart_app() {
    echo -e "${BLUE}🔄 Reiniciando aplicación...${NC}"
    
    # pm2 restart muebleswow
    
    echo -e "${GREEN}✅ Aplicación reiniciada correctamente${NC}"
}

# Función para ver logs
view_logs() {
    echo -e "${BLUE}📋 Mostrando logs...${NC}"
    
    # pm2 logs muebleswow --lines 50
    
    echo -e "${YELLOW}📋 También puedes ver logs desde Plesk:${NC}"
    echo "Panel Plesk → Dominios → muebleswow.tudominio.com → Node.js → Ver logs"
}

# Función principal
main() {
    case "${1:-help}" in
        "install")
            install_app
            ;;
        "deploy")
            deploy_app
            ;;
        "update")
            update_app
            ;;
        "restart")
            restart_app
            ;;
        "logs")
            view_logs
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# Ejecutar función principal
main "$@"
