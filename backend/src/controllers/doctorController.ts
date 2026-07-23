import { Request, Response } from 'express';
import User from '../models/User';
import PatientProfile from '../models/PatientProfile';
import EmergencyContact from '../models/EmergencyContact';
import DoctorProfile from '../models/DoctorProfile';
import Prescription from '../models/Prescription';
import bcrypt from 'bcryptjs';

export const searchPatient = async (req: Request, res: Response) => {
  try {
    const { healthId } = req.query;
    if (!healthId) {
      return res.status(200).json({ error: 'Health ID is required' });
    }
    const patient = await User.findOne({ healthId, role: 'patient' }).select('-password');
    if (!patient) {
      return res.status(200).json({ error: 'Patient not found' });
    }
    let profile = await PatientProfile.findOne({ userId: patient._id });
    const emergencyContactDoc = await EmergencyContact.findOne({ userId: patient._id }).sort({ createdAt: -1 });

    const profileObj = profile ? profile.toObject() : {};
    const emergencyContact = emergencyContactDoc ? {
      name: emergencyContactDoc.contactName,
      relationship: emergencyContactDoc.relationship,
      phone: emergencyContactDoc.phone,
    } : null;

    res.status(200).json({
      patient,
      profile: {
        ...profileObj,
        conditions: profileObj.chronicConditions || [],
        medications: profileObj.activeMedications || [],
        emergencyContact
      }
    });
  } catch (error: any) {
    res.status(200).json({ error: error.message });
  }
};

export const getPatientDetails = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params;
    const patient = await User.findById(patientId).select('-password');
    let profile = await PatientProfile.findOne({ userId: patientId });
    const emergencyContactDoc = await EmergencyContact.findOne({ userId: patientId }).sort({ createdAt: -1 });
    const prescriptions = await Prescription.find({ patientId }).sort({ createdAt: -1 });

    const profileObj = profile ? profile.toObject() : {};
    const emergencyContact = emergencyContactDoc ? {
      name: emergencyContactDoc.contactName,
      relationship: emergencyContactDoc.relationship,
      phone: emergencyContactDoc.phone,
    } : null;

    res.status(200).json({
      patient,
      profile: {
        ...profileObj,
        conditions: profileObj.chronicConditions || [],
        medications: profileObj.activeMedications || [],
        emergencyContact
      },
      prescriptions
    });
  } catch (error: any) {
    res.status(200).json({ error: error.message });
  }
};

export const createPrescription = async (req: Request, res: Response) => {
  try {
    const doctorId = req.user?.userId;
    const { patientId, diagnosis, medications, hospitalNotes } = req.body;

    const doctor = await User.findById(doctorId);
    const doctorProfile = await DoctorProfile.findOne({ userId: doctorId });

    if (!doctor || !doctorProfile) {
      return res.status(200).json({ error: 'Doctor not found' });
    }

    const prescription = new Prescription({
      patientId,
      doctorId,
      doctorName: doctor.name,
      doctorHospital: doctorProfile.hospital,
      diagnosis,
      medications,
      hospitalNotes
    });

    await prescription.save();

    const newMedications = medications.map((m: any) => m.name);
    await PatientProfile.findOneAndUpdate(
      { userId: patientId },
      { $addToSet: { activeMedications: { $each: newMedications } } }
    );

    res.status(200).json(prescription);
  } catch (error: any) {
    res.status(200).json({ error: error.message });
  }
};

export const getDoctorProfile = async (req: Request, res: Response) => {
  try {
    const profile = await DoctorProfile.findOne({ userId: req.user?.userId });
    res.status(200).json(profile);
  } catch (error: any) {
    res.status(200).json({ error: error.message });
  }
};

export const updateDoctorProfile = async (req: Request, res: Response) => {
  try {
    const profile = await DoctorProfile.findOneAndUpdate(
      { userId: req.user?.userId },
      req.body,
      { new: true, upsert: true }
    );
    res.status(200).json(profile);
  } catch (error: any) {
    res.status(200).json({ error: error.message });
  }
};

export const listDoctors = async (req: Request, res: Response) => {
  try {
    const { city, specialty } = req.query;
    const query: any = {};
    if (city) query.city = new RegExp(city as string, 'i');
    if (specialty) query.specialty = new RegExp(specialty as string, 'i');

    const doctorsCount = await DoctorProfile.countDocuments(query);
    if (doctorsCount === 0 && !city && !specialty) {
      // Seed logic
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      const cities = ['New York', 'London', 'Dubai', 'Tokyo', 'Kolkata', 'Mumbai', 'Delhi', 'Krishnagar'];
      for (const c of cities) {
        const u = new User({ name: `Dr. ${c} Specialist`, email: `dr.${c.toLowerCase()}@example.com`, password: hashedPassword, role: 'doctor' });
        await u.save();
        await new DoctorProfile({ userId: u._id, specialty: 'Cardiology', hospital: `${c} General`, experience: 10, consultationFee: 50, city: c, rating: 4.5 }).save();
      }
    }

    const doctors = await DoctorProfile.find(query).populate('userId', 'name email');
    res.status(200).json(doctors);
  } catch (error: any) {
    res.status(200).json({ error: error.message });
  }
};
