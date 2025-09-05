# MueblesWow - Despliegue con Docker

Este directorio contiene toda la configuración necesaria para desplegar MueblesWow usando Docker y Docker Compose.

## 🚀 Despliegue Rápido

### Opción 1: Script Automático
```bash
./deploy.sh
```

### Opción 2: Manual
```bash
# 1. Configurar variables de entorno
cp env.example .env
# Editar .env con tus configuraciones

# 2. Construir y levantar servicios
docker-compose up --build -d

# 3. Ejecutar migraciones
docker-compose exec backend npx prisma migrate deploy

# 4. Ejecutar seed
docker-compose exec backend npx prisma db seed
```

## 📋 Servicios Incluidos

- **PostgreSQL**: Base de datos principal
- **Backend**: API REST con Node.js y Express
- **Frontend**: Panel de administración (React + Vite)
- **Public**: Panel público para clientes (React + Vite)
- **Nginx**: Proxy reverso y servidor web

## 🌐 URLs de Acceso

- **Panel Admin**: http://localhost:3000
- **Panel Clientes**: http://localhost:3002
- **Backend API**: http://localhost:3001
- **Nginx Proxy**: http://localhost:80

## 🔑 Credenciales por Defecto

- **Usuario**: `admin`
- **Contraseña**: `muebleswow`

## ⚙️ Configuración

### Variables de Entorno

Edita el archivo `.env` con tus configuraciones:

```env
# Base de datos
POSTGRES_PASSWORD=tu-password-seguro

# JWT Secret
JWT_SECRET=tu-jwt-secret-muy-seguro

# URLs de la API
VITE_API_URL=http://tu-dominio.com:3001
```

### Dominios Personalizados

Para usar dominios personalizados, edita `nginx/nginx.conf`:

```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    # ... resto de la configuración
}
```

## 🛠️ Comandos Útiles

### Ver logs
```bash
# Todos los servicios
docker-compose logs -f

# Servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Reiniciar servicios
```bash
# Reiniciar todos
docker-compose restart

# Reiniciar servicio específico
docker-compose restart backend
```

### Acceder a contenedores
```bash
# Backend
docker-compose exec backend sh

# Base de datos
docker-compose exec postgres psql -U muebleswow -d muebleswow
```

### Backup de base de datos
```bash
docker-compose exec postgres pg_dump -U muebleswow muebleswow > backup.sql
```

### Restaurar base de datos
```bash
docker-compose exec -T postgres psql -U muebleswow -d muebleswow < backup.sql
```

## 🔧 Mantenimiento

### Actualizar aplicación
```bash
# Detener servicios
docker-compose down

# Actualizar código
git pull

# Reconstruir y levantar
docker-compose up --build -d

# Ejecutar migraciones si es necesario
docker-compose exec backend npx prisma migrate deploy
```

### Limpiar sistema
```bash
# Eliminar contenedores y volúmenes
docker-compose down -v

# Limpiar imágenes no utilizadas
docker system prune -a
```

## 🚨 Solución de Problemas

### Error de MIME types (JavaScript modules)
Si ves el error: `Failed to load module script: Expected a JavaScript module script but the server responded with a MIME type of "application/octet-stream"`

**Solución:**
```bash
# Reiniciar los servicios
docker-compose restart frontend public nginx

# Verificar MIME types
./test-mime.sh
```

### Puerto ya en uso
```bash
# Ver qué proceso usa el puerto
sudo netstat -tulpn | grep :3000

# Cambiar puertos en docker-compose.yml
```

### Error de permisos
```bash
# Dar permisos al script
chmod +x deploy.sh

# Ejecutar con sudo si es necesario
sudo docker-compose up --build -d
```

### Base de datos no conecta
```bash
# Verificar que PostgreSQL esté corriendo
docker-compose ps postgres

# Ver logs de la base de datos
docker-compose logs postgres
```

### Archivos estáticos no cargan
```bash
# Verificar configuración de Nginx
docker-compose logs nginx

# Reconstruir contenedores
docker-compose up --build -d
```

## 📊 Monitoreo

### Estado de servicios
```bash
docker-compose ps
```

### Uso de recursos
```bash
docker stats
```

### Health checks
```bash
# Backend
curl http://localhost:3001/health

# Frontend
curl http://localhost:3000

# Panel público
curl http://localhost:3002
```

## 🔒 Seguridad

### Cambiar credenciales por defecto
1. Accede al panel admin
2. Ve a Configuración
3. Cambia usuario y contraseña

### Configurar SSL
1. Coloca certificados en `nginx/ssl/`
2. Descomenta configuración SSL en `nginx/nginx.conf`
3. Reinicia nginx: `docker-compose restart nginx`

## 📝 Notas Importantes

- Los datos de la base de datos se persisten en el volumen `postgres_data`
- Los logs se guardan en `nginx/logs/`
- Para producción, cambia todas las contraseñas por defecto
- Configura un dominio real y certificados SSL
- Considera usar un proxy reverso externo (Cloudflare, etc.)

## 🆘 Soporte

Si tienes problemas:
1. Revisa los logs: `docker-compose logs -f`
2. Verifica la configuración en `.env`
3. Asegúrate de que los puertos estén libres
4. Revisa que Docker tenga suficientes recursos