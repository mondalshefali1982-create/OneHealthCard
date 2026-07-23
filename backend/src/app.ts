import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectDB();
    next();
  } catch (err: any) {
    console.error('Database connection error in middleware:', err.message);
    return res.status(500).json({ message: err.message || 'Database connection failure.' });
  }
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'OneHealthCard Backend Service is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/ai', aiRoutes);

app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ message: `API Endpoint ${req.originalUrl} not found.` });
});

export default app;
