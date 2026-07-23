import mongoose, { Document, Schema } from 'mongoose';

export interface IPatientProfile extends Document {
  userId: mongoose.Types.ObjectId;
  bloodGroup?: string;
  weight?: number;
  height?: number;
  dob?: Date;
  gender?: string;
  allergies: string[];
  chronicConditions: string[];
  activeMedications: string[];
}

const PatientProfileSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bloodGroup: { type: String },
  weight: { type: Number },
  height: { type: Number },
  dob: { type: Date },
  gender: { type: String },
  allergies: [{ type: String }],
  chronicConditions: [{ type: String }],
  activeMedications: [{ type: String }],
}, { timestamps: true });

export default mongoose.models.PatientProfile || mongoose.model<IPatientProfile>('PatientProfile', PatientProfileSchema);
