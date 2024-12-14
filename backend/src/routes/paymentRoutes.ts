import express from 'express';
import { auth } from '../middleware/auth';
import * as paymentController from '../controllers/paymentController';

const router = express.Router();

router.use(auth);

router.post('/', paymentController.createPayment);
router.get('/', paymentController.getPayments);
router.patch('/:id', paymentController.updatePayment);
router.delete('/:id', paymentController.deletePayment);

export default router; 