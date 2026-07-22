import app from '../backend/src/app.js';
import mongoose from 'mongoose';

const connectDB = async () => {
  // If connection is already open, skip re-connecting (crucial for serverless)
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable is missing.');
  }
  await mongoose.connect(mongoUri);
};

export default async (req: any, res: any) => {
  try {
    await connectDB();
  } catch (err: any) {
    console.error('Database connection error in Serverless Function:', err.message);
  }
  return app(req, res);
};
