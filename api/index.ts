import app from '../backend/src/app';
import { connectDB } from '../backend/src/config/database';
import { Request, Response } from 'express';

export default async (req: Request, res: Response) => {
  await connectDB();
  return app(req, res);
};
