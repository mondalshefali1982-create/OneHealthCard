import mongoose, { Schema, Document } from 'mongoose';

export interface IPatientProfile extends Document {
  user: mongoose.Types.ObjectId;
  healthId: string;
  bloodGroup: string;
  dob: Date;
  gender: string;
  allergies: string[];
  chronicDiseases: string[];
  currentMedications: string[];
  weight: number; // in kg
  height: number; // in cm
  createdAt: Date;
}

const PatientProfileSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  healthId: { type: String, required: true, unique: true, index: true },
  bloodGroup: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, required: true },
  allergies: { type: [String], default: [] },
  chronicDiseases: { type: [String], default: [] },
  currentMedications: { type: [String], default: [] },
  weight: { type: Number, required: true },
  height: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IPatientProfile>('PatientProfile', PatientProfileSchema);
