import mongoose, { Schema, Document } from 'mongoose';

export interface ILabReport extends Document {
  patient: mongoose.Types.ObjectId; // refs PatientProfile
  reportName: string;
  fileUrl: string;
  extractedText: string;
  summary: string;
  explanation: string;
  suggestions: string;
  warnings: string;
  date: Date;
  createdAt: Date;
}

const LabReportSchema: Schema = new Schema({
  patient: { type: Schema.Types.ObjectId, ref: 'PatientProfile', required: true },
  reportName: { type: String, required: true },
  fileUrl: { type: String, required: true }, // Can store a Local Mock File Path or Base64 URI
  extractedText: { type: String, default: '' },
  summary: { type: String, default: '' },
  explanation: { type: String, default: '' },
  suggestions: { type: String, default: '' },
  warnings: { type: String, default: '' },
  date: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ILabReport>('LabReport', LabReportSchema);
