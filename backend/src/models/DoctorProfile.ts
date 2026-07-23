import mongoose, { Document, Schema } from 'mongoose';

export interface IDoctorProfile extends Document {
  userId: mongoose.Types.ObjectId;
  specialty: string;
  hospital: string;
  experience: number;
  consultationFee: number;
  city: string;
  lat?: number;
  lng?: number;
  rating?: number;
}

const DoctorProfileSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  specialty: { type: String, required: true },
  hospital: { type: String, required: true },
  experience: { type: Number, required: true },
  consultationFee: { type: Number, required: true },
  city: { type: String, required: true },
  lat: { type: Number },
  lng: { type: Number },
  rating: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.DoctorProfile || mongoose.model<IDoctorProfile>('DoctorProfile', DoctorProfileSchema);
