import express from 'express';
import { auth } from '../middleware/auth';
import {
  createContractor,
  getContractors,
  updateContractor,
  deleteContractor,
  addRating
} from '../controllers/contractorController';

const router = express.Router();

router.use(auth);

router.post('/', createContractor);
router.get('/', getContractors);
router.patch('/:id', updateContractor);
router.delete('/:id', deleteContractor);
router.post('/:id/ratings', addRating);

export default router; 