import { Request, Response } from 'express';
import { analyzeMedicalReportText } from '../services/openRouterService';
import MedicalRecord from '../models/MedicalRecord';

export const analyzeReport = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(200).json({ error: 'Report text is required' });
    }

    const analysis = await analyzeMedicalReportText(text);

    const record = new MedicalRecord({
      patientId: req.user?.userId,
      ...analysis
    });
    
    await record.save();

    res.status(200).json(record);
  } catch (error: any) {
    res.status(200).json({ error: error.message });
  }
};
