import mongoose, { Schema, Document } from 'mongoose';

export interface IDoctorProfile extends Document {
  user: mongoose.Types.ObjectId;
  specialization: string;
  hospital: string;
  experience: number; // in years
  location: string;
  phoneNumber: string;
  googleMapsLocation: string;
  createdAt: Date;
}

const DoctorProfileSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  specialization: { type: String, required: true },
  hospital: { type: String, required: true },
  experience: { type: Number, required: true },
  location: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  googleMapsLocation: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IDoctorProfile>('DoctorProfile', DoctorProfileSchema);
