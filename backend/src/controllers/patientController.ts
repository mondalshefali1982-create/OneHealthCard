import { Response } from 'express';
import PatientProfile from '../models/PatientProfile.js';
import User from '../models/User.js';
import EmergencyContact from '../models/EmergencyContact.js';
import MedicalRecord from '../models/MedicalRecord.js';
import Prescription from '../models/Prescription.js';
import LabReport from '../models/LabReport.js';
import Appointment from '../models/Appointment.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

export const getPatientDashboard = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const patientProfile = await PatientProfile.findOne({ user: req.user.id });
    if (!patientProfile) {
      return res.status(404).json({ message: 'Patient profile not found.' });
    }

    const emergencyContact = await EmergencyContact.findOne({ patient: patientProfile._id });
    const medicalRecords = await MedicalRecord.find({ patient: patientProfile._id }).sort({ date: -1 }).limit(10);
    const prescriptions = await Prescription.find({ patient: patientProfile._id }).sort({ date: -1 }).limit(10);
    const labReports = await LabReport.find({ patient: patientProfile._id }).sort({ date: -1 }).limit(5);
    const appointments = await Appointment.find({ patient: patientProfile._id }).sort({ date: 1 }).limit(5);

    return res.json({
      profile: patientProfile,
      emergencyContact,
      medicalRecords,
      prescriptions,
      labReports,
      appointments
    });
  } catch (error: any) {
    return res.status(500).json({ message: `Failed to load dashboard data: ${error.message}` });
  }
};

export const updatePatientProfile = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const {
    name,
    bloodGroup,
    dob,
    gender,
    weight,
    height,
    allergies,
    chronicDiseases,
    currentMedications,
    emergencyContact
  } = req.body;

  try {
    // Update User Name
    if (name) {
      await User.findByIdAndUpdate(req.user.id, { name });
    }

    const profile = await PatientProfile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: 'Patient profile not found.' });
    }

    // Update Profile Fields
    if (bloodGroup) profile.bloodGroup = bloodGroup;
    if (dob) profile.dob = new Date(dob);
    if (gender) profile.gender = gender;
    if (weight !== undefined) profile.weight = weight;
    if (height !== undefined) profile.height = height;
    if (allergies) profile.allergies = allergies;
    if (chronicDiseases) profile.chronicDiseases = chronicDiseases;
    if (currentMedications) profile.currentMedications = currentMedications;

    const updatedProfile = await profile.save();

    // Update Emergency Contact
    let updatedContact = null;
    if (emergencyContact) {
      updatedContact = await EmergencyContact.findOneAndUpdate(
        { patient: profile._id },
        {
          name: emergencyContact.name,
          relationship: emergencyContact.relationship,
          phone: emergencyContact.phone
        },
        { new: true, upsert: true }
      );
    }

    return res.json({
      message: 'Profile updated successfully.',
      profile: updatedProfile,
      emergencyContact: updatedContact
    });
  } catch (error: any) {
    return res.status(500).json({ message: `Profile update failed: ${error.message}` });
  }
};

export const getMedicalTimeline = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const profile = await PatientProfile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: 'Patient profile not found.' });
    }

    const records = await MedicalRecord.find({ patient: profile._id });
    const prescriptions = await Prescription.find({ patient: profile._id });
    const labReports = await LabReport.find({ patient: profile._id });

    // Format all events into a unified timeline
    const timelineEvents: any[] = [];

    records.forEach(r => {
      timelineEvents.push({
        id: r._id,
        type: 'visit',
        title: `Doctor Visit - ${r.doctorName}`,
        subtitle: r.hospital,
        description: `Diagnosed with: ${r.disease}. Notes: ${r.notes}`,
        date: r.date,
        tags: [r.medicine]
      });
    });

    prescriptions.forEach(p => {
      timelineEvents.push({
        id: p._id,
        type: 'prescription',
        title: `Prescription Prescribed`,
        subtitle: `By Dr. ${p.doctorName}`,
        description: `Diagnosis: ${p.diagnosis}. Medications: ${p.medications.join(', ')}. Notes: ${p.notes}`,
        date: p.date,
        tags: p.medications
      });
    });

    labReports.forEach(l => {
      timelineEvents.push({
        id: l._id,
        type: 'lab',
        title: `Medical Lab Report: ${l.reportName}`,
        subtitle: `Uploaded Document`,
        description: l.summary || 'Lab report uploaded and analyzed by AI.',
        date: l.date,
        tags: ['Lab Report', 'AI Analyzed']
      });
    });

    // Sort descending by date
    timelineEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return res.json(timelineEvents);
  } catch (error: any) {
    return res.status(500).json({ message: `Timeline compile failed: ${error.message}` });
  }
};
