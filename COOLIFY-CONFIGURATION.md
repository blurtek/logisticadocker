# 🚀 Configuración Correcta para Coolify

## 🚨 Problema Actual
Coolify está detectando tu proyecto como **staticfile** y usando **Nixpacks** en lugar de nuestro **Dockerfile personalizado**. Esto causa el error de MIME types.

## ✅ Solución Definitiva

### Paso 1: Configurar Coolify Correctamente

1. **Ir a tu proyecto en Coolify**
2. **Settings** → **Build Pack**
3. **Seleccionar "Docker"** (NO Auto Detect)
4. **Dockerfile Path**: `coolify/Dockerfile`
5. **Build Context**: `coolify/`
6. **Guardar configuración**

### Paso 2: Variables de Entorno
Asegúrate de tener estas variables en Coolify:
```
POSTGRES_PASSWORD=muebleswow123
NODE_ENV=production
PORT=80
```

### Paso 3: Subir Cambios
```bash
cd coolify
git add .
git commit -m "Fix Coolify deployment configuration"
git push
```

### Paso 4: Redeploy
1. **Hacer redeploy** del contenedor
2. **Esperar** a que se construya con nuestro Dockerfile
3. **Verificar** que no hay errores de MIME types

## 🔍 Verificación

### En los logs de Coolify deberías ver:
```
# Usando nuestro Dockerfile
FROM node:18-alpine
# Instalando dependencias...
# Construyendo frontend...
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

## 🎯 Resultado Esperado

Después de aplicar la solución:
- ✅ **Coolify usa nuestro Dockerfile** (no Nixpacks)
- ✅ **Nginx configurado correctamente** con MIME types
- ✅ **Sin errores** de MIME type checking
- ✅ **Aplicación funcionando** correctamente

¡La configuración correcta en Coolify es la clave para resolver el problema! 🎉
