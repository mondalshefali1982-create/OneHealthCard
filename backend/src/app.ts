import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import patientRoutes from './routes/patientRoutes';
import doctorRoutes from './routes/doctorRoutes';
import aiRoutes from './routes/aiRoutes';

declare global {
  namespace Express {
    interface Request {
      user?: { userId: string; role: string };
    }
  }
}

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/patient', patientRoutes);
app.use('/patient', patientRoutes);

app.use('/api/doctor', doctorRoutes);
app.use('/doctor', doctorRoutes);

app.use('/api/ai', aiRoutes);
app.use('/ai', aiRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(200).json({ error: err.message || 'Internal Server Error' });
});

export default app;
