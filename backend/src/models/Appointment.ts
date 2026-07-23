import mongoose, { Schema, Document } from 'mongoose';

export interface IAppointment extends Document {
  patient: mongoose.Types.ObjectId; // refs PatientProfile
  doctor: mongoose.Types.ObjectId; // refs DoctorProfile
  doctorName: string;
  hospital: string;
  date: Date;
  time: string;
  reason: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: Date;
}

const AppointmentSchema: Schema = new Schema({
  patient: { type: Schema.Types.ObjectId, ref: 'PatientProfile', required: true },
  doctor: { type: Schema.Types.ObjectId, ref: 'DoctorProfile', required: true },
  doctorName: { type: String, required: true },
  hospital: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IAppointment>('Appointment', AppointmentSchema);
