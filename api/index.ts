import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from '../backend/src/routes/authRoutes.js';
import patientRoutes from '../backend/src/routes/patientRoutes.js';
import doctorRoutes from '../backend/src/routes/doctorRoutes.js';
import aiRoutes from '../backend/src/routes/aiRoutes.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const connectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  const connString = process.env.MONGODB_URI;
  if (!connString) {
    console.warn('MONGODB_URI environment variable missing from Vercel configuration.');
    return;
  }
  try {
    await mongoose.connect(connString, { serverSelectionTimeoutMS: 5000 });
  } catch (err: any) {
    console.error('MongoDB connection error in Vercel Serverless Function:', err.message);
  }
};

// Mount routes on BOTH /api/* and /* so Vercel serverless rewrites match 100% of incoming paths
app.use('/api/auth', authRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/ai', aiRoutes);

app.use('/auth', authRoutes);
app.use('/patient', patientRoutes);
app.use('/doctor', doctorRoutes);
app.use('/ai', aiRoutes);

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'OneHealthCard API Service is live' });
});
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'OneHealthCard API Service is live' });
});

export default async (req: any, res: any) => {
  await connectDB();
  return app(req, res);
};
