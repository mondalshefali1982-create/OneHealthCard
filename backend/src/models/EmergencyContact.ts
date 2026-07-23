import mongoose, { Document, Schema } from 'mongoose';

export interface IEmergencyContact extends Document {
  userId: mongoose.Types.ObjectId;
  contactName: string;
  relationship: string;
  phone: string;
}

const EmergencyContactSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  contactName: { type: String, required: true },
  relationship: { type: String, required: true },
  phone: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.EmergencyContact || mongoose.model<IEmergencyContact>('EmergencyContact', EmergencyContactSchema);
