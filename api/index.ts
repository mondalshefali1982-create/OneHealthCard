import app from '../backend/src/app.js';
import mongoose from 'mongoose';

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.warn('MONGODB_URI environment variable is missing from Vercel configuration.');
    return;
  }
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
  } catch (err: any) {
    console.error('Database connection error in Serverless Function:', err.message);
  }
};

export default async (req: any, res: any) => {
  await connectDB();
  return app(req, res);
};
