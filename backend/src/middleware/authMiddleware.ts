import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: 'patient' | 'doctor';
  };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET || 'onehealthcard_secret_key_2026';
    const decoded = jwt.verify(token, secret) as { id: string; role: 'patient' | 'doctor' };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token is invalid or has expired.' });
  }
};

export const requireRole = (role: 'patient' | 'doctor') => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: `Access denied. Requires ${role} role.` });
    }
    next();
  };
};
