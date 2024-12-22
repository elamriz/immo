import express from 'express';
import { auth } from '../middleware/auth';
import { getDashboardStats } from '../controllers/statsController';

const router = express.Router();

// Ajout de logs pour déboguer
router.use((req, res, next) => {
  console.log('Stats route accessed:', req.path);
  next();
});

router.use(auth);

router.get('/dashboard', (req, res, next) => {
  console.log('Dashboard route hit');
  getDashboardStats(req, res).catch(next);
});

export default router; 