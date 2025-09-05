# 🚀 Configuración para Coolify - MueblesWow

## ⚙️ CONFIGURACIÓN EN COOLIFY

### 1. **Tipo de Deploy**
- Seleccionar: **Docker**
- Dockerfile: `Dockerfile`
- Puerto: **80**

### 2. **Variables de Entorno** (Obligatorio)
Ir a **Configuration → Environment Variables** y añadir:

```
NODE_ENV=production
DATABASE_URL=file:./dev.db
JWT_SECRET=muebleswow-jwt-secret-2024
ENCRYPTION_KEY=muebleswow-encryption-key-2024
```

### 3. **Configuración de Red**
- Puerto interno: **80**
- Protocolo: **HTTP**
- Dominio: El que asigne Coolify automáticamente

### 4. **Deploy**
1. Subir todos los archivos a tu repositorio Git
2. Hacer commit y push
3. En Coolify hacer "Redeploy"
4. Esperar a que termine (unos 5-10 minutos)
5. Acceder al dominio asignado

## 🎯 URLs de Acceso
- **Panel Admin**: `https://tu-dominio.com/`
- **Panel Público**: `https://tu-dominio.com/public/`
- **API**: `https://tu-dominio.com/api/`

## ✅ Listo - Solo con estos archivos debe funcionar
