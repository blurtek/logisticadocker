#!/bin/bash

# Script para arreglar permisos en Plesk
# Ejecutar como root: sudo ./fix-permissions.sh

echo "🔧 Arreglando permisos para Plesk..."

# Obtener el directorio actual
CURRENT_DIR=$(pwd)
echo "📁 Directorio: $CURRENT_DIR"

# Cambiar propietario a plesk
echo "👤 Cambiando propietario a plesk..."
chown -R plesk:psacln "$CURRENT_DIR"

# Dar permisos de escritura
echo "📝 Dando permisos de escritura..."
chmod -R 755 "$CURRENT_DIR"

# Crear node_modules con permisos correctos
echo "📦 Creando node_modules con permisos correctos..."
mkdir -p "$CURRENT_DIR/node_modules"
chown -R plesk:psacln "$CURRENT_DIR/node_modules"
chmod -R 755 "$CURRENT_DIR/node_modules"

# Hacer lo mismo para subdirectorios
for dir in backend frontend public; do
    if [ -d "$CURRENT_DIR/$dir" ]; then
        echo "📁 Configurando permisos para $dir..."
        chown -R plesk:psacln "$CURRENT_DIR/$dir"
        chmod -R 755 "$CURRENT_DIR/$dir"
        
        mkdir -p "$CURRENT_DIR/$dir/node_modules"
        chown -R plesk:psacln "$CURRENT_DIR/$dir/node_modules"
        chmod -R 755 "$CURRENT_DIR/$dir/node_modules"
    fi
done

echo "✅ Permisos configurados correctamente"
echo ""
echo "🚀 Ahora puedes ejecutar:"
echo "sudo -u plesk npm install"
