import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const connString = process.env.MONGODB_URI;
  if (!connString) {
    console.error('Error: MONGODB_URI is not defined in the environment variables.');
    return;
  }

  try {
    const conn = await mongoose.connect(connString);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${(error as Error).message}`);
  }
};
