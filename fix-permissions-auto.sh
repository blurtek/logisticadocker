#!/bin/bash

# Script para arreglar permisos automáticamente detectando el usuario correcto
# Ejecutar como root: sudo ./fix-permissions-auto.sh

echo "🔧 Arreglando permisos para Plesk (detección automática)..."

# Obtener el directorio actual
CURRENT_DIR=$(pwd)
echo "📁 Directorio: $CURRENT_DIR"

# Detectar el usuario correcto
echo "🔍 Detectando usuario correcto..."

# Buscar el propietario del directorio del dominio
DOMAIN_OWNER=$(ls -ld /var/www/vhosts/blurtek.com/ | awk '{print $3}')
DOMAIN_GROUP=$(ls -ld /var/www/vhosts/blurtek.com/ | awk '{print $4}')

echo "👤 Usuario detectado: $DOMAIN_OWNER"
echo "👥 Grupo detectado: $DOMAIN_GROUP"

# Verificar que el usuario existe
if ! id "$DOMAIN_OWNER" &>/dev/null; then
    echo "❌ Error: Usuario $DOMAIN_OWNER no encontrado"
    echo "🔍 Usuarios disponibles:"
    ls -la /var/www/vhosts/blurtek.com/ | head -5
    exit 1
fi

# Cambiar propietario
echo "👤 Cambiando propietario a $DOMAIN_OWNER:$DOMAIN_GROUP..."
chown -R "$DOMAIN_OWNER:$DOMAIN_GROUP" "$CURRENT_DIR"

# Dar permisos de escritura
echo "📝 Dando permisos de escritura..."
chmod -R 755 "$CURRENT_DIR"

# Crear node_modules con permisos correctos
echo "📦 Creando node_modules con permisos correctos..."
mkdir -p "$CURRENT_DIR/node_modules"
chown -R "$DOMAIN_OWNER:$DOMAIN_GROUP" "$CURRENT_DIR/node_modules"
chmod -R 755 "$CURRENT_DIR/node_modules"

# Hacer lo mismo para subdirectorios
for dir in backend frontend public; do
    if [ -d "$CURRENT_DIR/$dir" ]; then
        echo "📁 Configurando permisos para $dir..."
        chown -R "$DOMAIN_OWNER:$DOMAIN_GROUP" "$CURRENT_DIR/$dir"
        chmod -R 755 "$CURRENT_DIR/$dir"
        
        mkdir -p "$CURRENT_DIR/$dir/node_modules"
        chown -R "$DOMAIN_OWNER:$DOMAIN_GROUP" "$CURRENT_DIR/$dir/node_modules"
        chmod -R 755 "$CURRENT_DIR/$dir/node_modules"
    fi
done

echo "✅ Permisos configurados correctamente"
echo ""
echo "🚀 Ahora puedes ejecutar:"
echo "sudo -u $DOMAIN_OWNER npm install"
echo ""
echo "📋 Información del usuario:"
id "$DOMAIN_OWNER"
