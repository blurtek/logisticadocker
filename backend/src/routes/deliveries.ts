import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

const deliverySchema = z.object({
  address: z.string().min(1),
  material: z.string().min(1),
  documentNumber: z.string().min(1),
  transporter: z.string().min(1),
  scheduledDate: z.string(),
  scheduledTime: z.string(),
  customerObservations: z.string().optional().nullable(),
  customerPhone: z.string().min(1),
  hasPickup: z.boolean(),
  pickupItems: z.string().optional().nullable(),
  deliveredMaterials: z.string().optional().nullable(),
  status: z.string().optional(),
  isPaid: z.boolean().optional(),
  paymentAmount: z.number().optional().nullable()
});

// Obtener todas las entregas
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const deliveries = await prisma.delivery.findMany({
      orderBy: { scheduledDate: 'desc' }
    });
    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener entregas' });
  }
});

// Obtener entregas por fecha
router.get('/by-date/:date', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { date } = req.params;
    const deliveries = await prisma.delivery.findMany({
      where: { scheduledDate: date },
      orderBy: { scheduledTime: 'asc' }
    });
    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener entregas' });
  }
});

// Obtener estadísticas de entregas
router.get('/stats', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Entregas retrasadas (fecha pasada y no completadas)
    const delayedDeliveries = await prisma.delivery.findMany({
      where: {
        scheduledDate: { lt: today },
        status: { not: 'COMPLETADO' }
      },
      orderBy: { scheduledDate: 'asc' }
    });

    // Entregas por cobrar
    const unpaidDeliveries = await prisma.delivery.findMany({
      where: {
        isPaid: false,
        paymentAmount: { gt: 0 }
      }
    });

    const totalUnpaidAmount = unpaidDeliveries.reduce((sum, delivery) => 
      sum + (delivery.paymentAmount || 0), 0
    );

    res.json({
      delayed: {
        count: delayedDeliveries.length,
        deliveries: delayedDeliveries
      },
      unpaid: {
        count: unpaidDeliveries.length,
        totalAmount: totalUnpaidAmount,
        deliveries: unpaidDeliveries
      }
    });
  } catch (error) {
    console.error('Error getting delivery stats:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

// Crear nueva entrega
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const data = deliverySchema.parse(req.body);
    
    const delivery = await prisma.delivery.create({
      data: {
        ...data,
        status: data.status || 'PREPARACION'
      }
    });
    
    res.status(201).json(delivery);
  } catch (error) {
    res.status(400).json({ error: 'Datos inválidos' });
  }
});

// Actualizar entrega
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const data = deliverySchema.partial().parse(req.body);
    
    const delivery = await prisma.delivery.update({
      where: { id },
      data
    });
    
    res.json(delivery);
  } catch (error) {
    console.error('Error updating delivery:', error);
    res.status(400).json({ 
      error: 'Datos inválidos', 
      details: error instanceof Error ? error.message : 'Error desconocido' 
    });
  }
});

// Marcar entrega como completada y cobrada
router.patch('/:id/complete', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    
    const delivery = await prisma.delivery.update({
      where: { id },
      data: {
        status: 'COMPLETADO',
        isPaid: true,
        paymentAmount: 0 // Se marca como cobrado
      }
    });
    
    res.json(delivery);
  } catch (error) {
    console.error('Error completing delivery:', error);
    res.status(500).json({ error: 'Error al completar entrega' });
  }
});

// Eliminar entrega
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    
    await prisma.delivery.delete({
      where: { id }
    });
    
    res.json({ message: 'Entrega eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar entrega' });
  }
});

export { router as deliveryRoutes };
