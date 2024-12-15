import express from 'express';
import authRoutes from './authRoutes';
import propertyRoutes from './propertyRoutes';
import tenantRoutes from './tenantRoutes';
import paymentRoutes from './paymentRoutes';
import ticketRoutes from './ticketRoutes';
import contractorRoutes from './contractorRoutes';

const router = express.Router();

// Routes publiques (pas besoin d'authentification)
router.use('/auth', authRoutes);

// Routes protégées (nécessitent une authentification)
router.use('/properties', propertyRoutes);
router.use('/tenants', tenantRoutes);
router.use('/payments', paymentRoutes);
router.use('/tickets', ticketRoutes);
router.use('/contractors', contractorRoutes);

export default router; 