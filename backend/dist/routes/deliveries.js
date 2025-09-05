"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deliveryRoutes = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
exports.deliveryRoutes = router;
const prisma = new client_1.PrismaClient();
const deliverySchema = zod_1.z.object({
    address: zod_1.z.string().min(1),
    material: zod_1.z.string().min(1),
    documentNumber: zod_1.z.string().min(1),
    transporter: zod_1.z.string().min(1),
    scheduledDate: zod_1.z.string(),
    scheduledTime: zod_1.z.string(),
    customerObservations: zod_1.z.string().optional(),
    customerPhone: zod_1.z.string().min(1),
    hasPickup: zod_1.z.boolean(),
    pickupItems: zod_1.z.string().optional(),
    deliveredMaterials: zod_1.z.string().optional(),
    status: zod_1.z.enum(['PREPARACION', 'TRANSITO', 'REPARTO', 'ERROR_LLAMADA', 'AUSENTE', 'ERROR_PEDIDO', 'COMPLETADO']).optional(),
    isPaid: zod_1.z.boolean().optional(),
    paymentAmount: zod_1.z.number().optional()
});
// Obtener todas las entregas
router.get('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const deliveries = await prisma.delivery.findMany({
            orderBy: { scheduledDate: 'desc' }
        });
        res.json(deliveries);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener entregas' });
    }
});
// Obtener entregas por fecha
router.get('/by-date/:date', auth_1.authenticateToken, async (req, res) => {
    try {
        const { date } = req.params;
        const deliveries = await prisma.delivery.findMany({
            where: { scheduledDate: date },
            orderBy: { scheduledTime: 'asc' }
        });
        res.json(deliveries);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener entregas' });
    }
});
// Crear nueva entrega
router.post('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const data = deliverySchema.parse(req.body);
        const delivery = await prisma.delivery.create({
            data: {
                ...data,
                status: data.status || 'PREPARACION'
            }
        });
        res.status(201).json(delivery);
    }
    catch (error) {
        res.status(400).json({ error: 'Datos inválidos' });
    }
});
// Actualizar entrega
router.put('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const data = deliverySchema.partial().parse(req.body);
        const delivery = await prisma.delivery.update({
            where: { id },
            data
        });
        res.json(delivery);
    }
    catch (error) {
        res.status(400).json({ error: 'Datos inválidos' });
    }
});
// Eliminar entrega
router.delete('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.delivery.delete({
            where: { id }
        });
        res.json({ message: 'Entrega eliminada correctamente' });
    }
    catch (error) {
        res.status(500).json({ error: 'Error al eliminar entrega' });
    }
});
//# sourceMappingURL=deliveries.js.map