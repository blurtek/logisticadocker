import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { authRoutes } from './routes/auth';
import { deliveryRoutes } from './routes/deliveries';
import { publicRoutes } from './routes/public';
import { errorHandler } from './middleware/errorHandler';
import { cspMiddleware } from './middleware/csp';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de seguridad
app.use(helmet({
  contentSecurityPolicy: false // Deshabilitamos helmet CSP para usar el nuestro
}));
app.use(cspMiddleware); // Nuestro middleware CSP personalizado
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3002', 'https://logistica.muebleswow.com'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests por ventana
});
app.use(limiter);

app.use(express.json());

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// Servir archivos estáticos del panel público
app.use('/client', express.static(path.join(__dirname, '../../public/dist')));

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/public', publicRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Ruta para el panel de administración (SPA)
app.get('*', (req, res) => {
  // Si es una ruta de API, no servir el index.html
  if (req.path.startsWith('/api/') || req.path.startsWith('/client/')) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
