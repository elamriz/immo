import express from 'express';
import { auth } from '../middleware/auth';
import { 
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty
} from '../controllers/propertyController';

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(auth);

router.post('/', createProperty);
router.get('/', getProperties);
router.get('/:id', getPropertyById);
router.patch('/:id', updateProperty);
router.delete('/:id', deleteProperty);

export default router; 