import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

const searchSchema = z.object({
  documentNumber: z.string().min(1)
});

// Buscar estado por número de documento
router.post('/search', async (req, res) => {
  try {
    const { documentNumber } = searchSchema.parse(req.body);
    
    const delivery = await prisma.delivery.findFirst({
      where: { documentNumber },
      select: {
        id: true,
        documentNumber: true,
        status: true,
        scheduledDate: true,
        scheduledTime: true,
        address: true,
        material: true,
        transporter: true,
        customerObservations: true,
        hasPickup: true,
        pickupItems: true,
        deliveredMaterials: true,
        isPaid: true,
        paymentAmount: true,
        createdAt: true
      }
    });

    if (!delivery) {
      return res.status(404).json({ error: 'No se encontró el documento' });
    }

    res.json(delivery);
  } catch (error) {
    res.status(400).json({ error: 'Número de documento inválido' });
  }
});

export { router as publicRoutes };
