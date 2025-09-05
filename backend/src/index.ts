import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { authRoutes } from './routes/auth';
import { deliveryRoutes } from './routes/deliveries';
import { publicRoutes } from './routes/public';
import { errorHandler } from './middleware/errorHandler';
import { cspMiddleware } from './middleware/csp';

const app = express();
const PORT = process.env.PORT || 3001;

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

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/public', publicRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
