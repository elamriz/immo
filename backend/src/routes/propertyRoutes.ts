import express from 'express';
import { auth } from '../middleware/auth';
import * as propertyController from '../controllers/propertyController';
import * as tenantController from '../controllers/tenantController';

const router = express.Router();

router.use(auth);

// Routes CRUD de base
router.post('/', propertyController.createProperty);
router.get('/', propertyController.getProperties);
router.get('/:id', propertyController.getProperty);
router.patch('/:id', propertyController.updateProperty);
router.delete('/:id', propertyController.deleteProperty);

// Routes pour les locataires
router.get('/:propertyId/tenants', tenantController.getTenants);
router.post('/:propertyId/tenants', tenantController.createTenant);
router.put('/:propertyId/tenants/:tenantId', tenantController.updateTenant);
router.delete('/:propertyId/tenants/:tenantId', tenantController.deleteTenant);

export default router; 