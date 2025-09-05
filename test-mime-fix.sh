#!/bin/bash

echo "🧪 Probando MIME types después de la corrección..."

# Función para probar un archivo
test_mime_type() {
    local url=$1
    local expected_type=$2
    local description=$3
    
    echo "Probando: $description"
    echo "URL: $url"
    
    response=$(curl -s -I "$url" | grep -i "content-type" | head -1)
    echo "Content-Type: $response"
    
    if echo "$response" | grep -q "$expected_type"; then
        echo "✅ MIME type correcto"
    else
        echo "❌ MIME type incorrecto. Esperado: $expected_type"
        echo "   Respuesta completa:"
        curl -s -I "$url" | head -10
    fi
    echo "---"
}

# Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios estén listos..."
sleep 15

# Probar archivos JavaScript del frontend
echo "🔍 Probando archivos del frontend..."
test_mime_type "http://localhost/assets/index.js" "application/javascript" "JavaScript del frontend"
test_mime_type "http://localhost/assets/index.mjs" "application/javascript" "JavaScript module del frontend"

# Probar archivos CSS del frontend
test_mime_type "http://localhost/assets/index.css" "text/css" "CSS del frontend"

# Probar archivos SVG del frontend
test_mime_type "http://localhost/vite.svg" "image/svg+xml" "SVG del frontend"

# Probar archivos del panel público
echo "🔍 Probando archivos del panel público..."
test_mime_type "http://localhost/public/assets/index.js" "application/javascript" "JavaScript del panel público"
test_mime_type "http://localhost/public/assets/index.css" "text/css" "CSS del panel público"

# Probar que la página principal cargue
echo "🔍 Probando carga de páginas..."
echo "Probando página principal..."
if curl -s -f "http://localhost/" > /dev/null; then
    echo "✅ Página principal carga correctamente"
else
    echo "❌ Error al cargar página principal"
fi

echo "Probando panel público..."
if curl -s -f "http://localhost/public/" > /dev/null; then
    echo "✅ Panel público carga correctamente"
else
    echo "❌ Error al cargar panel público"
fi

echo "🎉 Pruebas completadas!"
echo ""
echo "Si todos los MIME types son correctos, el error debería estar solucionado."
echo "Si persiste el error, revisa los logs de Nginx:"
echo "docker logs <container_id>"
