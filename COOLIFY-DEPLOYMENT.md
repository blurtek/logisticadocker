# 🚀 Despliegue en Coolify - MueblesWow

Esta carpeta contiene toda la configuración necesaria para desplegar MueblesWow en Coolify.

## 📋 Pasos para Desplegar en Coolify

### 1. Preparar el Repositorio
```bash
# Crear un nuevo repositorio Git solo con la carpeta coolify
cd coolify
git init
git add .
git commit -m "Initial commit: MueblesWow Docker deployment"
git remote add origin https://github.com/tu-usuario/muebleswow-coolify.git
git push -u origin main
```

### 2. Configurar en Coolify

1. **Crear nuevo proyecto** en Coolify
2. **Conectar repositorio** Git
3. **Seleccionar rama** `main`
4. **Configurar variables de entorno**:
   ```env
   POSTGRES_PASSWORD=tu-password-seguro
   JWT_SECRET=tu-jwt-secret-muy-seguro
   VITE_API_URL=https://tu-dominio.com
   NODE_ENV=production
   ```

### 3. Configuración de Dominio

#### Opción A: Subdominios
- **Panel Admin**: `admin.tu-dominio.com`
- **Panel Clientes**: `public.tu-dominio.com`
- **API**: `api.tu-dominio.com`

#### Opción B: Rutas
- **Panel Admin**: `tu-dominio.com/`
- **Panel Clientes**: `tu-dominio.com/public/`
- **API**: `tu-dominio.com/api/`

### 4. Configuración SSL

Coolify maneja automáticamente los certificados SSL, pero puedes configurar:

```nginx
# En nginx/nginx.conf
server {
    listen 443 ssl http2;
    server_name tu-dominio.com;
    
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    # ... resto de configuración
}
```

## 🔧 Configuración Avanzada

### Variables de Entorno Recomendadas

```env
# Base de datos
POSTGRES_PASSWORD=password-super-seguro-2024
POSTGRES_DB=muebleswow
POSTGRES_USER=muebleswow

# JWT
JWT_SECRET=jwt-secret-muy-largo-y-seguro-para-produccion

# URLs
VITE_API_URL=https://api.tu-dominio.com
NODE_ENV=production

# Opcional: Configuración de email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-password-app
```

### Configuración de Recursos

En Coolify, configura:
- **CPU**: Mínimo 1 vCPU
- **RAM**: Mínimo 2GB
- **Almacenamiento**: Mínimo 10GB

### Configuración de Red

- **Puerto 80**: HTTP
- **Puerto 443**: HTTPS
- **Puerto 3001**: Backend API (opcional, para acceso directo)

## 📊 Monitoreo y Logs

### Ver Logs en Coolify
1. Ve a tu proyecto en Coolify
2. Selecciona el servicio
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
```bash
# Acceder al contenedor del backend
docker exec -it muebleswow-backend sh

# Ejecutar migraciones
npx prisma migrate deploy

# Ejecutar seed (si es necesario)
npx prisma db seed
```

## 🛡️ Seguridad

### Configuraciones Recomendadas

1. **Cambiar credenciales por defecto**:
   - Usuario admin: `admin`
   - Contraseña: `muebleswow` → Cambiar por una segura

2. **Configurar firewall**:
   - Solo puertos 80 y 443 abiertos
   - Restringir acceso a puerto 3001

3. **Backup automático**:
   ```bash
   # Script de backup diario
   docker exec muebleswow-postgres pg_dump -U muebleswow muebleswow > backup-$(date +%Y%m%d).sql
   ```

## 🚨 Solución de Problemas

### Error de Conexión a Base de Datos
```bash
# Verificar que PostgreSQL esté corriendo
docker-compose ps postgres

# Ver logs
docker-compose logs postgres
```

### Error de Permisos
```bash
# Verificar permisos de archivos
ls -la

# Cambiar permisos si es necesario
chmod +x deploy.sh
```

### Error de Memoria
- Aumentar RAM en Coolify
- Optimizar consultas de base de datos
- Limpiar logs antiguos

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Coolify
2. Verifica las variables de entorno
3. Asegúrate de que el dominio esté configurado correctamente
4. Contacta al soporte de Coolify si es necesario

## 🎯 URLs Finales

Después del despliegue:
- **Panel Admin**: `https://admin.tu-dominio.com` o `https://tu-dominio.com`
- **Panel Clientes**: `https://public.tu-dominio.com` o `https://tu-dominio.com/public`
- **API**: `https://api.tu-dominio.com` o `https://tu-dominio.com/api`

¡Tu sistema MueblesWow estará listo para producción! 🎉