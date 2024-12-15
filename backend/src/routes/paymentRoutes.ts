import express from 'express';
import { auth } from '../middleware/auth';
import * as paymentController from '../controllers/paymentController';

const router = express.Router();

router.use(auth);

router.get('/property/:propertyId', paymentController.getPaymentsByProperty);
router.get('/stats', paymentController.getPaymentStats);
router.get('/stats/:propertyId', paymentController.getPaymentStats);
router.post('/:id/mark-paid', paymentController.markAsPaid);
router.post('/:id/send-reminder', paymentController.sendReminder);
router.get('/:id/receipt', paymentController.generateReceipt);

router.post('/', paymentController.createPayment);
router.get('/', paymentController.getPayments);
router.patch('/:id', paymentController.updatePayment);
router.delete('/:id', paymentController.deletePayment);

export default router; 