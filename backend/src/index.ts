import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';

dotenv.config();

const app = express();

// Middleware pour logger toutes les requêtes
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Configuration CORS
app.use(cors());
app.use(express.json());

// Connexion à MongoDB avec plus de logs
mongoose.set('debug', true); // Active les logs Mongoose
mongoose
  .connect(process.env.MONGODB_URI || '')
  .then(() => {
    console.log('✅ Connecté à MongoDB');
  })
  .catch((err) => {
    console.error('❌ Erreur de connexion MongoDB:', err);
    process.exit(1);
  });

// Routes
app.use('/api', routes);

// Middleware de gestion d'erreur global
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Erreur globale:', err);
  res.status(500).json({ 
    message: 'Erreur serveur', 
    error: err.message 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur le port ${PORT}`);
}); 