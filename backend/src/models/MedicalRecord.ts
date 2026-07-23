import mongoose, { Schema, Document } from 'mongoose';

export interface IMedicalRecord extends Document {
  patient: mongoose.Types.ObjectId; // refs PatientProfile
  disease: string;
  diagnosis: string;
  medicine: string;
  doctorName: string;
  hospital: string;
  notes: string;
  date: Date;
  createdAt: Date;
}

const MedicalRecordSchema: Schema = new Schema({
  patient: { type: Schema.Types.ObjectId, ref: 'PatientProfile', required: true },
  disease: { type: String, required: true },
  diagnosis: { type: String, required: true },
  medicine: { type: String, required: true },
  doctorName: { type: String, required: true },
  hospital: { type: String, required: true },
  notes: { type: String, default: '' },
  date: { type: Date, required: true, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IMedicalRecord>('MedicalRecord', MedicalRecordSchema);
