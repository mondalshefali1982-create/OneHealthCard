import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const connString = process.env.MONGODB_URI;
  if (!connString) {
    throw new Error('MONGODB_URI environment variable is missing from server configuration.');
  }

  // Disable buffering so queries fail immediately with exact error if DB is disconnected
  mongoose.set('bufferCommands', false);

  try {
    const conn = await mongoose.connect(connString, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    throw new Error(`Database Connection Error: ${error.message}`);
  }
};
