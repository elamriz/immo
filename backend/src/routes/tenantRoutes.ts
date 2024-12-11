import express from 'express';
import { auth } from '../middleware/auth';
import {
  createTenant,
  getTenants,
  updateTenant,
  deleteTenant,
} from '../controllers/tenantController';

const router = express.Router();

router.use(auth);

router.post('/', createTenant);
router.get('/', getTenants);
router.patch('/:id', updateTenant);
router.delete('/:id', deleteTenant);

export default router; 