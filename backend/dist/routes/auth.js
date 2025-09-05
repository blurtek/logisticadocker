"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
exports.authRoutes = router;
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'muebleswow-secret-key';
const loginSchema = zod_1.z.object({
    username: zod_1.z.string().min(1),
    password: zod_1.z.string().min(1)
});
const changePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(1),
    newPassword: zod_1.z.string().min(6)
});
// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = loginSchema.parse(req.body);
        const user = await prisma.user.findUnique({
            where: { username }
        });
        if (!user || !await bcryptjs_1.default.compare(password, user.password)) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, user: { id: user.id, username: user.username } });
    }
    catch (error) {
        res.status(400).json({ error: 'Datos inválidos' });
    }
});
// Cambiar contraseña
router.post('/change-password', auth_1.authenticateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
        const user = await prisma.user.findUnique({
            where: { id: req.user?.id }
        });
        if (!user || !await bcryptjs_1.default.compare(currentPassword, user.password)) {
            return res.status(401).json({ error: 'Contraseña actual incorrecta' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 12);
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        });
        res.json({ message: 'Contraseña actualizada correctamente' });
    }
    catch (error) {
        res.status(400).json({ error: 'Datos inválidos' });
    }
});
//# sourceMappingURL=auth.js.map