import express from 'express';
import { auth } from '../middleware/auth';
import { createTenant, getTenants } from '../controllers/tenantController';

const router = express.Router();

router.use(auth);

router.post('/', createTenant);
router.get('/', getTenants);

export default router; 