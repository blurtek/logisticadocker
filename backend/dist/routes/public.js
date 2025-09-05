"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicRoutes = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
exports.publicRoutes = router;
const prisma = new client_1.PrismaClient();
const searchSchema = zod_1.z.object({
    documentNumber: zod_1.z.string().min(1)
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
    }
    catch (error) {
        res.status(400).json({ error: 'Número de documento inválido' });
    }
});
//# sourceMappingURL=public.js.map