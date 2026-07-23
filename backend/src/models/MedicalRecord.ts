import mongoose, { Document, Schema } from 'mongoose';

export interface IMedicalRecord extends Document {
  patientId: mongoose.Types.ObjectId;
  reportType: string;
  summary: string;
  vitals?: string;
  abnormalIndicators: string[];
  recommendations: string[];
  uploadedAt: Date;
}

const MedicalRecordSchema: Schema = new Schema({
  patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reportType: { type: String, required: true },
  summary: { type: String, required: true },
  vitals: { type: String },
  abnormalIndicators: [{ type: String }],
  recommendations: [{ type: String }],
  uploadedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.models.MedicalRecord || mongoose.model<IMedicalRecord>('MedicalRecord', MedicalRecordSchema);
