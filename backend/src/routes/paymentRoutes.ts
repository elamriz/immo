import express from 'express';
import { auth } from '../middleware/auth';
import { createPayment, getPayments } from '../controllers/paymentController';

const router = express.Router();

router.use(auth);

router.post('/', createPayment);
router.get('/', getPayments);

export default router; 