# 🚀 Configuración para Coolify - MueblesWow

## 📋 Configuración en Coolify

### 1. Crear Proyecto
1. **Nuevo Proyecto** en Coolify
2. **Tipo**: Docker
3. **Repositorio**: Tu repositorio Git con la carpeta `coolify`
4. **Rama**: `main`

### 2. Configurar Variables de Entorno
```env
POSTGRES_PASSWORD=muebleswow123
JWT_SECRET=muebleswow-secret-key-2024-production
NODE_ENV=production
```

### 3. Configurar Puerto
- **Puerto**: `80`
- **Protocolo**: HTTP

### 4. Configurar Dominio
- **Dominio principal**: `tu-dominio.com`
- **Subdominios**:
  - Panel Admin: `tu-dominio.com/` (por defecto)
  - Panel Clientes: `tu-dominio.com/public/`

## 🌐 URLs de Acceso

Después del despliegue:
- **🔐 Panel Admin**: `https://tu-dominio.com/`
- **👥 Panel Clientes**: `https://tu-dominio.com/public/`
- **🔧 Backend API**: `https://tu-dominio.com/api/`

## 🔑 Credenciales

- **Usuario**: `admin`
- **Contraseña**: `muebleswow`

## ⚙️ Configuración Avanzada

### Variables de Entorno Recomendadas
```env
# Base de datos
POSTGRES_PASSWORD=password-super-seguro-2024

# JWT
JWT_SECRET=jwt-secret-muy-largo-y-seguro-para-produccion

# Configuración
NODE_ENV=production
```

### Recursos Recomendados
- **CPU**: 2 vCPU
- **RAM**: 4GB
- **Almacenamiento**: 20GB

## 🔧 Solución de Problemas

### Error de MIME Types
Si ves el error de MIME types:
1. Verificar que el Dockerfile esté usando `nginx-simple.conf`
2. Reiniciar el contenedor en Coolify
3. Verificar logs del contenedor

### Error de Base de Datos
Si hay problemas con PostgreSQL:
1. Verificar variable `POSTGRES_PASSWORD`
2. Revisar logs del contenedor
3. Verificar que el puerto 5432 esté disponible internamente

### Error de Archivos Estáticos
Si los archivos no cargan:
1. Verificar que las builds se completaron correctamente
2. Revisar configuración de Nginx
3. Verificar permisos de archivos

## 📊 Monitoreo

### Logs en Coolify
1. Ve a tu proyecto
2. Selecciona el contenedor
3. Ve a la pestaña "Logs"

### Health Checks
- **Backend**: `GET /health`
- **Frontend**: `GET /`
- **Panel Público**: `GET /public/`

## 🔄 Actualizaciones

### Actualizar Aplicación
1. Haz cambios en tu código
2. Commit y push a Git
3. Coolify detectará automáticamente los cambios
4. Se reconstruirá y redesplegará automáticamente

### Actualizar Base de Datos
Los cambios en la base de datos se aplicarán automáticamente al reiniciar el contenedor.

## 🛡️ Seguridad

### Configuraciones Recomendadas
1. **Cambiar credenciales por defecto**
2. **Usar contraseñas seguras**
3. **Configurar SSL/TLS** (automático en Coolify)
4. **Configurar firewall** si es necesario

## 📝 Notas Importantes

- **Un solo contenedor**: Todo funciona desde un solo contenedor
- **Puerto único**: Solo necesitas el puerto 80
- **Base de datos interna**: PostgreSQL se ejecuta dentro del contenedor
- **Archivos estáticos**: Se sirven desde Nginx
- **API**: Disponible en `/api/`

## 🆘 Soporte

Si tienes problemas:
1. Revisa los logs en Coolify
2. Verifica las variables de entorno
3. Asegúrate de que el dominio esté configurado correctamente
4. Contacta al soporte de Coolify si es necesario

¡Tu sistema MueblesWow estará listo para producción! 🎉
