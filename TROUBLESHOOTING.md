# 🔧 Troubleshooting - MueblesWow en Coolify

## Problema: Contenedor ejecutándose pero no accesible

### Diagnóstico Paso a Paso

#### 1. **Verificar Estado del Contenedor**
```bash
# En Coolify, ir a la sección "Logs" del contenedor
# Buscar mensajes como:
# ✅ Backend listo en puerto 3001
# ✅ Nginx ejecutándose correctamente
# ✅ Puerto 80 abierto
```

#### 2. **Verificar Configuración de Red en Coolify**
- Ir a **Configuration** → **Network**
- Verificar que el puerto esté configurado como **80**
- Verificar que el protocolo sea **HTTP**

#### 3. **Verificar Variables de Entorno**
En **Configuration** → **Environment Variables**:
```
NODE_ENV=production
DATABASE_URL=postgresql://usuario:password@host:puerto/database
```

#### 4. **Verificar Base de Datos**
- Crear una base de datos PostgreSQL en Coolify
- Configurar la variable `DATABASE_URL`
- Verificar conectividad

### Soluciones por Orden de Prioridad

#### **Solución 1: Usar Dockerfile de Prueba**
1. Cambiar el Dockerfile a `Dockerfile.test`
2. Hacer redeploy
3. Si funciona, el problema está en la aplicación

#### **Solución 2: Usar Dockerfile Simplificado**
1. Cambiar el Dockerfile a `Dockerfile.simple`
2. Hacer redeploy
3. Revisar logs para identificar el problema específico

#### **Solución 3: Verificar Configuración de Coolify**
1. **Puerto**: Debe estar configurado en **80**
2. **Protocolo**: Debe ser **HTTP**
3. **Dominio**: Verificar que esté configurado correctamente

#### **Solución 4: Verificar Logs del Contenedor**
Buscar en los logs:
- ❌ Errores de base de datos
- ❌ Errores de migraciones
- ❌ Errores de Nginx
- ❌ Errores de puertos

### Comandos de Diagnóstico

#### **Dentro del Contenedor**
```bash
# Verificar procesos
ps aux

# Verificar puertos
netstat -tlnp

# Verificar Nginx
nginx -t

# Verificar logs
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

#### **Desde Coolify**
1. Ir a **Terminal** del contenedor
2. Ejecutar comandos de diagnóstico
3. Revisar logs en tiempo real

### Problemas Comunes y Soluciones

#### **Problema: Puerto 80 no accesible**
- **Causa**: Configuración incorrecta en Coolify
- **Solución**: Verificar configuración de red

#### **Problema: Base de datos no conecta**
- **Causa**: DATABASE_URL incorrecto
- **Solución**: Configurar variable de entorno correcta

#### **Problema: Nginx no inicia**
- **Causa**: Configuración incorrecta
- **Solución**: Usar Dockerfile simplificado

#### **Problema: Backend no responde**
- **Causa**: Errores en migraciones o seed
- **Solución**: Revisar logs y corregir base de datos

### Archivos de Configuración

- `Dockerfile.test`: Versión de prueba simple
- `Dockerfile.simple`: Versión simplificada con mejor logging
- `start-simple.sh`: Script de inicio con diagnóstico
- `diagnose.sh`: Script de diagnóstico completo

### Próximos Pasos

1. **Probar Dockerfile.test** para verificar conectividad básica
2. **Si funciona**, usar Dockerfile.simple para diagnóstico
3. **Revisar logs** para identificar el problema específico
4. **Configurar base de datos** correctamente
5. **Verificar configuración de red** en Coolify
