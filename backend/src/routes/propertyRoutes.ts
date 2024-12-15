import express from 'express';
import { auth } from '../middleware/auth';
import * as propertyController from '../controllers/propertyController';

const router = express.Router();

router.use(auth);

// Routes CRUD
router.post('/', propertyController.createProperty);
router.get('/', propertyController.getProperties);
router.get('/:id', propertyController.getProperty);
router.patch('/:id', propertyController.updateProperty);
router.delete('/:id', propertyController.deleteProperty);

// Routes pour les locataires
router.post('/:propertyId/tenants', propertyController.addTenant);
router.put('/:propertyId/tenants/:tenantId', propertyController.updateTenant);

export default router; 