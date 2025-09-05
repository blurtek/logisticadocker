#!/bin/bash

# Script para detectar el usuario correcto de Plesk
echo "🔍 Detectando usuario de Plesk..."

# Buscar usuarios comunes de Plesk
echo "📋 Usuarios del sistema:"
id plesk 2>/dev/null && echo "✅ Usuario 'plesk' encontrado" || echo "❌ Usuario 'plesk' no encontrado"
id psacln 2>/dev/null && echo "✅ Usuario 'psacln' encontrado" || echo "❌ Usuario 'psacln' no encontrado"
id www-data 2>/dev/null && echo "✅ Usuario 'www-data' encontrado" || echo "❌ Usuario 'www-data' no encontrado"
id apache 2>/dev/null && echo "✅ Usuario 'apache' encontrado" || echo "❌ Usuario 'apache' no encontrado"
id nginx 2>/dev/null && echo "✅ Usuario 'nginx' encontrado" || echo "❌ Usuario 'nginx' no encontrado"

echo ""
echo "📁 Propietario del directorio actual:"
ls -la /var/www/vhosts/blurtek.com/ | head -5

echo ""
echo "📁 Propietario del directorio del dominio:"
ls -la /var/www/vhosts/blurtek.com/logistica.muebleswow.com/ | head -5

echo ""
echo "🔍 Buscando usuarios relacionados con Plesk:"
grep -i plesk /etc/passwd 2>/dev/null || echo "No se encontraron usuarios con 'plesk' en el nombre"

echo ""
echo "🔍 Buscando usuarios relacionados con web:"
grep -E "(www|web|http)" /etc/passwd 2>/dev/null || echo "No se encontraron usuarios web"

echo ""
echo "📋 Información del proceso actual:"
echo "Usuario actual: $(whoami)"
echo "UID actual: $(id -u)"
echo "GID actual: $(id -g)"
