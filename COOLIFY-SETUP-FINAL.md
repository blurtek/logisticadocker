# 🚀 Configuración Final para Coolify - Panel MueblesWow

## 🚨 Problema Identificado
Coolify está detectando tu proyecto como **staticfile** y usando **Nixpacks** en lugar de nuestro **Dockerfile personalizado**. Esto causa el error de MIME types porque no está usando nuestra configuración de Nginx.

## ✅ Solución Implementada

### 1. Archivos Creados para Forzar Dockerfile
- ✅ **`nixpacks.toml`** - Configuración para usar Dockerfile
- ✅ **`.dockerignore`** - Ignorar archivos que confunden a Nixpacks
- ✅ **`.nixpacksignore`** - Evitar detección automática
- ✅ **`docker-compose.yaml`** - Configuración explícita
- ✅ **`Dockerfile`** - Dockerfile optimizado para Coolify

### 2. Configuración de Coolify
En Coolify, necesitas configurar:

#### **Build Pack**: Docker
- **NO** usar "Auto Detect"
- **SÍ** usar "Docker"

#### **Dockerfile Path**: `coolify/Dockerfile`
- Especificar la ruta exacta al Dockerfile

#### **Build Context**: `coolify/`
- El contexto de build debe ser la carpeta `coolify`

## 🚀 Pasos para Aplicar la Solución

### Paso 1: Subir Cambios a Git
```bash
cd coolify
git add .
git commit -m "Fix Coolify deployment - force Dockerfile usage"
git push
```

### Paso 2: Configurar Coolify
1. **Ir a tu proyecto en Coolify**
2. **Settings** → **Build Pack**
3. **Seleccionar "Docker"** (NO Auto Detect)
4. **Dockerfile Path**: `coolify/Dockerfile`
5. **Build Context**: `coolify/`
6. **Guardar configuración**

### Paso 3: Variables de Entorno
Asegúrate de tener estas variables en Coolify:
```
POSTGRES_PASSWORD=muebleswow123
NODE_ENV=production
PORT=80
```

### Paso 4: Redeploy
1. **Hacer redeploy** del contenedor
2. **Esperar** a que se construya con nuestro Dockerfile
3. **Verificar** que no hay errores de MIME types

## 🔍 Verificación

### Logs de Build
En los logs de Coolify deberías ver:
```
# Usando nuestro Dockerfile
FROM node:18-alpine
# Instalando dependencias...
# Construyendo frontend...
# Construyendo backend...
# Configurando Nginx...
```

### NO deberías ver:
```
# Detección automática de staticfile
Found application type: staticfile
# Configuración de Nixpacks
```

## 🆘 Si Sigue Fallando

### Opción 1: Forzar Dockerfile en Coolify
1. **Settings** → **Build Pack**
2. **Seleccionar "Docker"**
3. **Dockerfile Path**: `coolify/Dockerfile`
4. **Build Context**: `coolify/`

### Opción 2: Usar Docker Compose
1. **Settings** → **Build Pack**
2. **Seleccionar "Docker Compose"**
3. **Docker Compose File**: `coolify/docker-compose.yaml`

### Opción 3: Verificar Archivos
```bash
# Verificar que los archivos están en el repositorio
git ls-files coolify/
```

## 📋 Archivos Clave

### `coolify/Dockerfile`
- Dockerfile optimizado para Coolify
- Incluye Nginx con configuración correcta
- Build de frontend, backend y panel público

### `coolify/nixpacks.toml`
- Fuerza uso de Dockerfile
- Evita detección automática

### `coolify/.nixpacksignore`
- Ignora archivos que confunden a Nixpacks
- Solo incluye archivos necesarios

### `coolify/docker-compose.yaml`
- Configuración de Docker Compose
- Variables de entorno
- Health checks

## 🎯 Resultado Esperado

Después de aplicar la solución:
- ✅ **Coolify usa nuestro Dockerfile** (no Nixpacks)
- ✅ **Nginx configurado correctamente** con MIME types
- ✅ **Sin errores** de MIME type checking
- ✅ **Aplicación funcionando** correctamente
- ✅ **Panel admin** en `/`
- ✅ **Panel público** en `/public/`
- ✅ **API** en `/api/`

## 🔧 Comandos de Verificación

### Verificar Build
```bash
# En los logs de Coolify, buscar:
grep -i "dockerfile" logs
grep -i "nginx" logs
```

### Verificar MIME Types
```bash
# Probar archivos JavaScript
curl -I https://tu-dominio.com/assets/index.js
# Debe mostrar: Content-Type: application/javascript; charset=utf-8
```

¡Esta solución debería resolver definitivamente el problema de detección automática en Coolify! 🎉
