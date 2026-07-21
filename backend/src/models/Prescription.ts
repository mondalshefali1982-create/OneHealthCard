import mongoose, { Schema, Document } from 'mongoose';

export interface IPrescription extends Document {
  patient: mongoose.Types.ObjectId; // refs PatientProfile
  doctor: mongoose.Types.ObjectId; // refs User (doctor role)
  doctorName: string;
  diagnosis: string;
  medications: string[];
  notes: string;
  date: Date;
  createdAt: Date;
}

const PrescriptionSchema: Schema = new Schema({
  patient: { type: Schema.Types.ObjectId, ref: 'PatientProfile', required: true },
  doctor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  doctorName: { type: String, required: true },
  diagnosis: { type: String, required: true },
  medications: { type: [String], required: true },
  notes: { type: String, default: '' },
  date: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IPrescription>('Prescription', PrescriptionSchema);
