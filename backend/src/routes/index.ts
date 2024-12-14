import express from 'express';
import authRoutes from './authRoutes';
import propertyRoutes from './propertyRoutes';
import tenantRoutes from './tenantRoutes';
import paymentRoutes from './paymentRoutes';

const router = express.Router();

// Routes publiques (pas besoin d'authentification)
router.use('/auth', authRoutes);

// Routes protégées (nécessitent une authentification)
router.use('/properties', propertyRoutes);
router.use('/tenants', tenantRoutes);
router.use('/payments', paymentRoutes);

export default router; 