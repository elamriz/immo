import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { auth } from '../middleware/auth';
import {
  createTicket,
  getTickets,
  updateTicket,
  deleteTicket,
  addComment,
  assignContractor,
  addAttachment
} from '../controllers/ticketController';

const router = express.Router();

// Configuration de multer avec types
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: (req, file, cb) => {
    // Accepter uniquement les images et PDFs
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});

// Middleware d'authentification pour toutes les routes
router.use(auth);

// Routes
router.post('/', createTicket);
router.get('/', getTickets);
router.put('/:id', updateTicket);
router.delete('/:id', deleteTicket);
router.post('/:id/comments', addComment);
router.post('/:id/assign', assignContractor);

// Route pour les fichiers avec middleware multer
router.post(
  '/:id/attachments', 
  upload.array('files', 5),
  (req: Request, res: Response, next: NextFunction) => {
    addAttachment(req, res).catch(next);
  }
);

export default router; 