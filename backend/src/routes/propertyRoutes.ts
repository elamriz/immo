import express from 'express';
import { auth } from '../middleware/auth';
import {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  addTenant,
  updateTenant,
  getProperty
} from '../controllers/propertyController';

const router = express.Router();

// Middleware d'authentification pour toutes les routes
router.use(auth);

// Routes de base pour les propriétés
router.post('/', createProperty);
router.get('/', getProperties);
router.get('/:id', getProperty);
router.put('/:id', updateProperty);
router.delete('/:id', deleteProperty);

// Routes pour la gestion des locataires
router.post('/:propertyId/tenants', addTenant);
router.put('/:propertyId/tenants/:tenantId', updateTenant);

export default router; 