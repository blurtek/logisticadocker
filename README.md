# 🚚 MueblesWOW Logística

Sistema de gestión de entregas y recogidas para MueblesWOW - Dockerizado para Coolify

## 🐳 Dockerización

Este proyecto está completamente dockerizado y listo para deployment en Coolify.

### Archivos Docker incluidos:

- `Dockerfile` - Imagen multi-stage optimizada para producción
- `docker-compose.yml` - Configuración para desarrollo y producción
- `nginx.conf` - Configuración de Nginx para servir la aplicación
- `.dockerignore` - Archivos excluidos del build

### 🚀 Deployment en Coolify

1. **Sube el código a tu repositorio Git**
2. **En Coolify:**
   - Crea un nuevo proyecto
   - Conecta tu repositorio
   - Coolify detectará automáticamente el Dockerfile
   - Configura las variables de entorno si es necesario
   - Deploy!

### 🛠️ Desarrollo Local

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview de producción
npm run preview
```

### 🐳 Docker Local

```bash
# Build de la imagen
docker build -t muebleswow-logistica .

# Ejecutar contenedor
docker run -p 3000:80 muebleswow-logistica

# Con docker-compose
docker-compose up --build
```

### 📋 Características

- ✅ **Frontend-only**: Sin backend, todo en el cliente
- ✅ **PWA Ready**: Preparado para Progressive Web App
- ✅ **Mobile-first**: Diseño responsive
- ✅ **Dockerizado**: Listo para Coolify
- ✅ **Optimizado**: Build multi-stage con Nginx
- ✅ **Health Check**: Endpoint `/health` incluido

### 🔧 Tecnologías

- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS
- React Router
- Zustand (state management)
- IndexedDB (persistencia local)

### 📱 Funcionalidades (En desarrollo)

- 📅 Calendario de entregas
- 👥 Gestión de transportistas
- 📦 Seguimiento de pedidos
- 📊 Dashboard administrativo
- 🔍 Búsqueda de clientes
- 📱 Vista móvil optimizada

---

**Estado**: 🟡 En desarrollo - Dockerizado y listo para Coolify