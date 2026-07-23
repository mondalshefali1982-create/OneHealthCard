import { Response } from 'express';
import LabReport from '../models/LabReport.js';
import PatientProfile from '../models/PatientProfile.js';
import { analyzeMedicalReport } from '../services/openRouterService.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

export const uploadAndAnalyzeReport = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: 'No file uploaded. Please upload a report image.' });
  }

  try {
    const patientProfile = await PatientProfile.findOne({ user: req.user.id });
    if (!patientProfile) {
      return res.status(404).json({ message: 'Patient profile not found. AI report uploader is for patients only.' });
    }

    // Convert file buffer to base64
    const fileBase64 = file.buffer.toString('base64');
    const mimeType = file.mimetype;
    const fileName = file.originalname;

    // Call OpenRouter service
    const analysis = await analyzeMedicalReport(fileBase64, mimeType, fileName);

    // Save to Database
    const labReport = new LabReport({
      patient: patientProfile._id,
      reportName: fileName,
      fileUrl: `data:${mimeType};base64,${fileBase64.substring(0, 100)}...[Truncated]`, // Store a tokenized base64 reference or mock URL
      extractedText: JSON.stringify(analysis.detectedParameters),
      summary: analysis.summary,
      explanation: analysis.explanation,
      suggestions: analysis.suggestions.join('\n'),
      warnings: analysis.warnings.join('\n'),
      date: new Date()
    });

    const savedReport = await labReport.save();

    return res.status(201).json({
      message: 'Lab report uploaded and analyzed by OpenRouter AI.',
      report: savedReport,
      analysis: {
        summary: analysis.summary,
        detectedParameters: analysis.detectedParameters,
        explanation: analysis.explanation,
        suggestions: analysis.suggestions,
        warnings: analysis.warnings
      }
    });
  } catch (error: any) {
    console.error('AI Controller Error:', error.message);
    return res.status(500).json({ message: `AI analysis failed: ${error.message}` });
  }
};

export const getLabReports = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const patientProfile = await PatientProfile.findOne({ user: req.user.id });
    if (!patientProfile) {
      return res.status(404).json({ message: 'Patient profile not found.' });
    }

    const reports = await LabReport.find({ patient: patientProfile._id }).sort({ date: -1 });
    return res.json(reports);
  } catch (error: any) {
    return res.status(500).json({ message: `Failed to fetch lab reports: ${error.message}` });
  }
};
