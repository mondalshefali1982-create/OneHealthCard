import mongoose, { Schema, Document } from 'mongoose';

export interface IEmergencyContact extends Document {
  patient: mongoose.Types.ObjectId; // refs PatientProfile
  name: string;
  relationship: string;
  phone: string;
  createdAt: Date;
}

const EmergencyContactSchema: Schema = new Schema({
  patient: { type: Schema.Types.ObjectId, ref: 'PatientProfile', required: true },
  name: { type: String, required: true },
  relationship: { type: String, required: true },
  phone: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IEmergencyContact>('EmergencyContact', EmergencyContactSchema);
