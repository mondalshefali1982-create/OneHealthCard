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
  } catch (err: any) {
    console.error('Database connection error in middleware:', err.message);
  }
  next();
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'OneHealthCard Backend Service is running' });
});
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'OneHealthCard Backend Service is running' });
});

// Mount routes on BOTH /api/* and /* so Vercel Serverless Function rewrites match 100% of incoming paths
app.use('/api/auth', authRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/ai', aiRoutes);

app.use('/auth', authRoutes);
app.use('/patient', patientRoutes);
app.use('/doctor', doctorRoutes);
app.use('/ai', aiRoutes);

app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ message: `API Endpoint ${req.originalUrl} not found.` });
});

export default app;
