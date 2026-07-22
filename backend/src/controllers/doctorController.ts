import { Request, Response } from 'express';
import User from '../models/User.js';
import PatientProfile from '../models/PatientProfile.js';
import DoctorProfile from '../models/DoctorProfile.js';
import EmergencyContact from '../models/EmergencyContact.js';
import MedicalRecord from '../models/MedicalRecord.js';
import Prescription from '../models/Prescription.js';
import LabReport from '../models/LabReport.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

export const searchPatient = async (req: AuthRequest, res: Response) => {
  const { healthId } = req.params;

  if (!healthId) {
    return res.status(400).json({ message: 'Health ID is required.' });
  }

  try {
    const isObjectId = healthId.match(/^[0-9a-fA-F]{24}$/);
    const searchConditions: any[] = [{ healthId: healthId }];
    if (isObjectId) {
      searchConditions.push({ user: healthId });
      searchConditions.push({ _id: healthId });
    }

    const patientProfile = await PatientProfile.findOne({
      $or: searchConditions
    }).populate('user', 'name email');

    if (!patientProfile) {
      return res.status(404).json({ message: 'Patient profile not found for scanned Health ID.' });
    }

    const emergencyContact = await EmergencyContact.findOne({ patient: patientProfile._id });
    const medicalRecords = await MedicalRecord.find({ patient: patientProfile._id }).sort({ date: -1 });
    const prescriptions = await Prescription.find({ patient: patientProfile._id }).sort({ date: -1 });
    const labReports = await LabReport.find({ patient: patientProfile._id }).sort({ date: -1 });

    return res.json({
      profile: patientProfile,
      emergencyContact,
      medicalRecords,
      prescriptions,
      labReports
    });
  } catch (error: any) {
    return res.status(500).json({ message: `Search failed: ${error.message}` });
  }
};

export const addPrescription = async (req: AuthRequest, res: Response) => {
  const { healthId } = req.params;
  const { diagnosis, medications, notes } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!diagnosis || !medications || !Array.isArray(medications)) {
    return res.status(400).json({ message: 'Please provide diagnosis and medications list.' });
  }

  try {
    const isObjectId = healthId.match(/^[0-9a-fA-F]{24}$/);
    const searchConditions: any[] = [{ healthId: healthId }];
    if (isObjectId) {
      searchConditions.push({ user: healthId });
      searchConditions.push({ _id: healthId });
    }

    const patientProfile = await PatientProfile.findOne({
      $or: searchConditions
    });

    if (!patientProfile) {
      return res.status(404).json({ message: 'Patient profile not found.' });
    }

    const doctorUser = await User.findById(req.user.id);
    const doctorProfile = await DoctorProfile.findOne({ user: req.user.id });
    
    const docName = doctorUser ? doctorUser.name : 'Dr. Doctor';
    const hospName = doctorProfile ? doctorProfile.hospital : 'Specialty Clinic';

    // OVERWRITE old patient active medications with new Doctor prescription
    patientProfile.currentMedications = medications;
    if (diagnosis) {
      patientProfile.chronicDiseases = [diagnosis];
    }
    await patientProfile.save();

    // Create new Prescription record with full doctor details
    const prescription = new Prescription({
      patient: patientProfile._id,
      doctor: doctorUser ? doctorUser._id : req.user.id,
      doctorName: `${docName} (${hospName})`,
      diagnosis,
      medications,
      notes: notes || '',
      date: new Date()
    });

    const savedPrescription = await prescription.save();

    // Also record in MedicalRecord collection
    const medicalRecord = new MedicalRecord({
      patient: patientProfile._id,
      disease: diagnosis,
      diagnosis,
      medicine: medications.join(', '),
      doctorName: docName,
      hospital: hospName,
      notes: notes || `New active prescription issued by ${docName}`,
      date: new Date()
    });
    await medicalRecord.save();

    return res.status(201).json({
      message: 'Prescription updated successfully. Patient active card updated.',
      prescription: savedPrescription,
      profile: patientProfile
    });
  } catch (error: any) {
    return res.status(500).json({ message: `Failed to add prescription: ${error.message}` });
  }
};

export const addMedicalRecord = async (req: AuthRequest, res: Response) => {
  const { healthId } = req.params;
  const { disease, diagnosis, medicine, hospital, notes, date } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!disease || !diagnosis || !medicine || !hospital) {
    return res.status(400).json({ message: 'Missing required medical record fields.' });
  }

  try {
    const isObjectId = healthId.match(/^[0-9a-fA-F]{24}$/);
    const searchConditions: any[] = [{ healthId: healthId }];
    if (isObjectId) {
      searchConditions.push({ user: healthId });
      searchConditions.push({ _id: healthId });
    }

    const patientProfile = await PatientProfile.findOne({
      $or: searchConditions
    });

    if (!patientProfile) {
      return res.status(404).json({ message: 'Patient profile not found.' });
    }

    const doctorUser = await User.findById(req.user.id);
    const doctorName = doctorUser ? doctorUser.name : 'Unknown Doctor';

    const medicalRecord = new MedicalRecord({
      patient: patientProfile._id,
      disease,
      diagnosis,
      medicine,
      doctorName,
      hospital,
      notes: notes || '',
      date: date ? new Date(date) : new Date()
    });

    const savedRecord = await medicalRecord.save();
    return res.status(201).json({
      message: 'Medical record added successfully.',
      record: savedRecord
    });
  } catch (error: any) {
    return res.status(500).json({ message: `Failed to add record: ${error.message}` });
  }
};

export const searchDoctors = async (req: Request, res: Response) => {
  const { specialization, location, query } = req.query;

  try {
    let filter: any = {};

    if (specialization) {
      filter.specialization = { $regex: new RegExp(specialization as string, 'i') };
    }

    if (location) {
      filter.location = { $regex: new RegExp(location as string, 'i') };
    }

    if (query) {
      const doctors = await DoctorProfile.find().populate('user');
      const filtered = doctors.filter((doc: any) => {
        const nameMatch = doc.user?.name?.match(new RegExp(query as string, 'i'));
        const specMatch = doc.specialization?.match(new RegExp(query as string, 'i'));
        const hospMatch = doc.hospital?.match(new RegExp(query as string, 'i'));
        return nameMatch || specMatch || hospMatch;
      });
      return res.json(filtered);
    }

    const doctors = await DoctorProfile.find(filter).populate('user', 'name email');
    return res.json(doctors);
  } catch (error: any) {
    return res.status(500).json({ message: `Failed to search doctors: ${error.message}` });
  }
};
