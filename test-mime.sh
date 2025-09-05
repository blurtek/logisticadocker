#!/bin/bash

# Script para probar los MIME types
echo "🧪 Probando MIME types..."

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
    fi
    echo "---"
}

# Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios estén listos..."
sleep 10

# Probar archivos JavaScript
test_mime_type "http://localhost:3000/assets/index.js" "application/javascript" "JavaScript del frontend"
test_mime_type "http://localhost:3002/assets/index.js" "application/javascript" "JavaScript del panel público"

# Probar archivos CSS
test_mime_type "http://localhost:3000/assets/index.css" "text/css" "CSS del frontend"
test_mime_type "http://localhost:3002/assets/index.css" "text/css" "CSS del panel público"

# Probar archivos SVG
test_mime_type "http://localhost:3000/vite.svg" "image/svg+xml" "SVG del frontend"
test_mime_type "http://localhost:3002/vite.svg" "image/svg+xml" "SVG del panel público"

echo "🎉 Pruebas completadas!"
