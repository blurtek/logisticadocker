# Configuración para Coolify - MueblesWow

## Pasos para configurar en Coolify

### 1. Configuración del Proyecto
- **Tipo de Deploy**: Docker
- **Dockerfile**: Usar `Dockerfile.coolify`
- **Puerto**: 80
- **Variables de entorno**: Configurar en Coolify

### 2. Variables de Entorno Requeridas
```
NODE_ENV=production
DATABASE_URL=postgresql://usuario:password@host:puerto/database
JWT_SECRET=tu-jwt-secret-aqui
ENCRYPTION_KEY=tu-encryption-key-aqui
```

### 3. Base de Datos
- Crear una base de datos PostgreSQL en Coolify
- Configurar la variable `DATABASE_URL` con la conexión
- El script de inicio ejecutará automáticamente las migraciones

### 4. URLs de Acceso
- **Panel Admin**: `https://tu-dominio.com/`
- **Panel Clientes**: `https://tu-dominio.com/public/`
- **API Backend**: `https://tu-dominio.com/api/`

### 5. Verificación
1. El contenedor debe estar en estado "Running"
2. Verificar logs para confirmar que todos los servicios están iniciados
3. Probar acceso a las URLs

### 6. Troubleshooting
- Si no se puede acceder, verificar:
  - Estado del contenedor
  - Logs del contenedor
  - Configuración de red en Coolify
  - Variables de entorno
  - Conectividad a la base de datos