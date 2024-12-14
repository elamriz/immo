import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

// Étendre l'interface Request pour inclure l'utilisateur
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Interface pour le token décodé
interface DecodedToken {
  userId: string;
  iat: number;
  exp: number;
}

export const auth = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    console.log('=== Vérification de l\'authentification ===');
    const authHeader = req.headers.authorization;
    console.log('Header d\'autorisation:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ Pas de token Bearer');
      return res.status(401).json({ message: 'Non autorisé' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token extrait:', token.substring(0, 20) + '...');

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as DecodedToken;
      console.log('Token décodé:', {
        userId: decoded.userId,
        expiresIn: new Date(decoded.exp * 1000).toISOString()
      });

      const user = await User.findById(decoded.userId);
      console.log('Utilisateur trouvé:', user ? '✅' : '❌');

      if (!user) {
        return res.status(401).json({ message: 'Utilisateur non trouvé' });
      }

      // Ajouter l'utilisateur à la requête
      req.user = user;
      next();
    } catch (jwtError) {
      if (jwtError instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ message: 'Token invalide' });
      }
      if (jwtError instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ message: 'Token expiré' });
      }
      throw jwtError;
    }
  } catch (error) {
    console.error('❌ Erreur d\'authentification:', error);
    res.status(401).json({ message: 'Non autorisé' });
  }
}; 