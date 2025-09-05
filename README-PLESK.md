# 🚀 MueblesWow - Despliegue en Plesk

## 📋 Instrucciones de Despliegue

### **1. Subir Archivos al Servidor**
```bash
# Clonar repositorio en el servidor
git clone https://github.com/tu-usuario/plesklogistica.git
cd plesklogistica
```

### **2. Configurar en Plesk**

#### **A. Crear Subdominio**
1. **Panel Plesk** → **Dominios** → **Agregar subdominio**
2. **Nombre**: `muebleswow`
3. **Documento raíz**: `/var/www/vhosts/tudominio.com/muebleswow`
4. **Hacer clic en "OK"**

#### **B. Configurar Node.js**
1. **Panel Plesk** → **Dominios** → **muebleswow.tudominio.com**
2. **Pestaña "Node.js"**
3. **Configurar**:
   - **Versión**: Node.js 18.x o superior
   - **Aplicación**: `/var/www/vhosts/tudominio.com/muebleswow`
   - **Archivo de inicio**: `backend/src/index.js`
   - **Documento raíz**: `/var/www/vhosts/tudominio.com/muebleswow`
   - **Puerto**: 3000

#### **C. Configurar Variables de Entorno**
1. **Panel Plesk** → **Dominios** → **muebleswow.tudominio.com**
2. **Pestaña "Node.js"** → **"Variables de entorno"**
3. **Agregar las siguientes variables**:

```
DATABASE_URL=postgresql://muebleswow:tu_password_seguro@localhost:5432/muebleswow
JWT_SECRET=tu_jwt_secret_super_seguro_cambiar_en_produccion
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://muebleswow.tudominio.com
PUBLIC_URL=https://muebleswow.tudominio.com/client
CORS_ORIGIN=https://muebleswow.tudominio.com
```

#### **D. Configurar Base de Datos PostgreSQL**
1. **Panel Plesk** → **Bases de datos** → **Agregar base de datos**
2. **Nombre**: `muebleswow`
3. **Usuario**: `muebleswow`
4. **Contraseña**: `tu_password_seguro`
5. **Hacer clic en "OK"**

### **3. Ejecutar Despliegue**

#### **A. Desde Terminal SSH**
```bash
# Ir al directorio del proyecto
cd /var/www/vhosts/tudominio.com/muebleswow

# Hacer ejecutable el script
chmod +x plesk-deploy.sh

# Ejecutar despliegue
./plesk-deploy.sh deploy
```

#### **B. Desde Panel Plesk**
1. **Panel Plesk** → **Dominios** → **muebleswow.tudominio.com**
2. **Pestaña "Node.js"**
3. **Hacer clic en "Iniciar aplicación"**

### **4. Configurar SSL**
1. **Panel Plesk** → **Dominios** → **muebleswow.tudominio.com**
2. **Pestaña "SSL/TLS"**
3. **Activar "Let's Encrypt"**
4. **Hacer clic en "Obtener"**

### **5. Verificar Funcionamiento**

#### **URLs de Acceso:**
- **Panel Admin**: https://muebleswow.tudominio.com
- **Panel Clientes**: https://muebleswow.tudominio.com/client
- **API Health**: https://muebleswow.tudominio.com/api/health

#### **Credenciales por Defecto:**
- **Usuario**: `admin`
- **Contraseña**: `muebleswow`

## 🔧 Gestión de la Aplicación

### **Reiniciar Aplicación**
- **Panel Plesk** → **Dominios** → **muebleswow.tudominio.com** → **Node.js** → **"Reiniciar aplicación"**

### **Ver Logs**
- **Panel Plesk** → **Dominios** → **muebleswow.tudominio.com** → **Node.js** → **"Ver logs"**

### **Actualizar Variables de Entorno**
- **Panel Plesk** → **Dominios** → **muebleswow.tudominio.com** → **Node.js** → **"Variables de entorno"**

## 🚨 Solución de Problemas

### **Aplicación no inicia**
1. Verificar logs en Plesk
2. Verificar variables de entorno
3. Verificar que PostgreSQL esté ejecutándose
4. Verificar permisos de archivos

### **Error de base de datos**
1. Verificar DATABASE_URL
2. Verificar que la base de datos existe
3. Ejecutar migraciones manualmente:
   ```bash
   cd /var/www/vhosts/tudominio.com/muebleswow
   ./plesk-deploy.sh deploy
   ```

### **Error de permisos**
1. Verificar permisos de archivos
2. Verificar que el usuario tenga acceso al directorio

## 📞 Soporte

Si tienes problemas:
1. Revisar logs en Plesk
2. Verificar configuración de Node.js
3. Verificar variables de entorno
4. Verificar conectividad de base de datos

## ✅ Funcionalidades Incluidas

- **🔐 Panel Admin**: Gestión completa de entregas
- **👥 Panel Clientes**: Consulta de pedidos
- **📊 KPIs**: Alertas de retrasos y pagos
- **🗄️ Base de datos**: PostgreSQL con persistencia
- **🔒 SSL**: Certificado automático
- **📱 Responsive**: Mobile-first design
- **🔄 Backup**: Automático configurado

¡Tu sistema de logística está listo para gestionar las entregas de muebles! 🚚📦
