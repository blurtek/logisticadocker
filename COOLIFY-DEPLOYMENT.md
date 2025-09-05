# 🚀 GUÍA DE DEPLOYMENT EN COOLIFY

## 📋 ARCHIVOS INCLUIDOS

Esta carpeta contiene todos los archivos necesarios para desplegar **MueblesWOW Logística** en Coolify:

### ✅ Archivos Críticos para Coolify:
- `Dockerfile` - Imagen Docker multi-stage
- `docker-compose.yml` - Configuración de servicios
- `nginx.conf` - Configuración del servidor web
- `.dockerignore` - Archivos excluidos del build
- `package.json` - Dependencias del proyecto

### ✅ Archivos de Configuración:
- `vite.config.ts` - Configuración de Vite
- `tsconfig.json` - Configuración TypeScript
- `tailwind.config.js` - Configuración Tailwind CSS
- `postcss.config.js` - Configuración PostCSS
- `index.html` - Punto de entrada HTML

### ✅ Código Fuente:
- `src/` - Código fuente React/TypeScript
- `README.md` - Documentación del proyecto

## 🐳 PASOS PARA DEPLOYMENT

### 1️⃣ SUBIR A GIT
```bash
# Inicializar repositorio
git init

# Agregar todos los archivos
git add .

# Commit inicial
git commit -m "MueblesWOW Logística - Listo para Coolify"

# Conectar con repositorio remoto
git remote add origin https://github.com/tu-usuario/muebleswow-logistica.git

# Subir al repositorio
git push -u origin main
```

### 2️⃣ CONFIGURAR EN COOLIFY

#### Crear Nuevo Proyecto:
1. **Source**: Git Repository
2. **Repository URL**: `https://github.com/tu-usuario/muebleswow-logistica.git`
3. **Branch**: `main`
4. **Build Pack**: `Dockerfile` (auto-detectado)

#### Configuración del Proyecto:
- **Project Name**: `muebleswow-logistica`
- **Domain**: Tu dominio personalizado
- **Port**: Dejar vacío (Nginx usa puerto 80)

#### Variables de Entorno:
```
NODE_ENV=production
```

### 3️⃣ DEPLOYMENT
1. Haz clic en **"Deploy"**
2. Espera a que termine el build (2-5 minutos)
3. Verifica que la aplicación esté funcionando

## 🔍 VERIFICACIÓN

### URLs para probar:
- **Aplicación**: `https://tu-dominio.com`
- **Health Check**: `https://tu-dominio.com/health`

### Logs importantes:
- **Build Logs**: Progreso de construcción
- **Deploy Logs**: Progreso de despliegue
- **Container Logs**: Logs de la aplicación

## 🛠️ TROUBLESHOOTING

### Si el build falla:
1. Verifica que el `Dockerfile` esté en la raíz
2. Revisa los logs de build en Coolify
3. Asegúrate de que todas las dependencias estén en `package.json`

### Si la aplicación no carga:
1. Verifica los logs del contenedor
2. Comprueba que Nginx esté corriendo
3. Revisa la configuración de dominio

### Comandos útiles en Coolify:
```bash
# Ver logs del contenedor
docker logs nombre-contenedor

# Entrar al contenedor
docker exec -it nombre-contenedor sh

# Verificar procesos
ps aux | grep nginx
```

## 📱 CARACTERÍSTICAS DE LA APLICACIÓN

- ✅ **Frontend-only**: Sin backend requerido
- ✅ **PWA Ready**: Preparado para Progressive Web App
- ✅ **Mobile-first**: Diseño responsive
- ✅ **Dockerizado**: Optimizado para contenedores
- ✅ **Health Check**: Monitoreo incluido
- ✅ **Nginx**: Servidor web optimizado
- ✅ **Compresión**: Gzip habilitado
- ✅ **Cache**: Archivos estáticos cacheados
- ✅ **Seguridad**: Headers de seguridad configurados

## 🎯 PRÓXIMOS PASOS

Una vez desplegado, puedes:
1. Configurar dominio personalizado
2. Habilitar SSL/HTTPS
3. Configurar monitoreo
4. Implementar CI/CD automático
5. Agregar más funcionalidades

---

**Estado**: 🟢 Listo para deployment en Coolify
**Versión**: 1.0.0
**Última actualización**: $(date)
