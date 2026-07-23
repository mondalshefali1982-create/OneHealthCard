import { Request, Response } from 'express';
import PatientProfile from '../models/PatientProfile';
import EmergencyContact from '../models/EmergencyContact';
import Prescription from '../models/Prescription';

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    let profile = await PatientProfile.findOne({ userId });
    if (!profile) {
      profile = await PatientProfile.create({ userId });
    }
    const emergencyContactDoc = await EmergencyContact.findOne({ userId }).sort({ createdAt: -1 });
    const prescriptions = await Prescription.find({ patientId: userId }).sort({ createdAt: -1 }).limit(10);

    const profileObj = profile.toObject();
    const emergencyContact = emergencyContactDoc ? {
      name: emergencyContactDoc.contactName,
      relationship: emergencyContactDoc.relationship,
      phone: emergencyContactDoc.phone,
      contactName: emergencyContactDoc.contactName,
    } : null;

    res.status(200).json({
      profile: {
        ...profileObj,
        conditions: profileObj.chronicConditions || [],
        medications: profileObj.activeMedications || [],
        emergencyContact,
      },
      emergencyContacts: emergencyContactDoc ? [emergencyContactDoc] : [],
      prescriptions
    });
  } catch (error: any) {
    res.status(200).json({ error: error.message });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    let profile = await PatientProfile.findOne({ userId });
    if (!profile) {
      profile = await PatientProfile.create({ userId });
    }
    const emergencyContactDoc = await EmergencyContact.findOne({ userId }).sort({ createdAt: -1 });

    const profileObj = profile.toObject();
    const emergencyContact = emergencyContactDoc ? {
      name: emergencyContactDoc.contactName,
      relationship: emergencyContactDoc.relationship,
      phone: emergencyContactDoc.phone,
      contactName: emergencyContactDoc.contactName,
    } : null;

    res.status(200).json({
      ...profileObj,
      conditions: profileObj.chronicConditions || [],
      medications: profileObj.activeMedications || [],
      chronicConditions: profileObj.chronicConditions || [],
      activeMedications: profileObj.activeMedications || [],
      emergencyContact,
    });
  } catch (error: any) {
    res.status(200).json({ error: error.message });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { conditions, medications, chronicConditions, activeMedications, ...rest } = req.body;
    const updateData = {
      ...rest,
      chronicConditions: chronicConditions || conditions || [],
      activeMedications: activeMedications || medications || [],
    };

    const profile = await PatientProfile.findOneAndUpdate(
      { userId: req.user?.userId },
      updateData,
      { new: true, upsert: true }
    );
    
    const profileObj = profile.toObject();
    res.status(200).json({
      ...profileObj,
      conditions: profileObj.chronicConditions || [],
      medications: profileObj.activeMedications || [],
    });
  } catch (error: any) {
    res.status(200).json({ error: error.message });
  }
};

export const getEmergencyContact = async (req: Request, res: Response) => {
  try {
    const contacts = await EmergencyContact.find({ userId: req.user?.userId });
    res.status(200).json(contacts);
  } catch (error: any) {
    res.status(200).json({ error: error.message });
  }
};

export const updateEmergencyContact = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { name, contactName, relationship, phone } = req.body;
    const cName = name || contactName || '';

    const contact = await EmergencyContact.findOneAndUpdate(
      { userId },
      { contactName: cName, relationship: relationship || '', phone: phone || '' },
      { new: true, upsert: true }
    );
    return res.status(200).json(contact);
  } catch (error: any) {
    res.status(200).json({ error: error.message });
  }
};

export const getPrescriptions = async (req: Request, res: Response) => {
  try {
    const prescriptions = await Prescription.find({ patientId: req.user?.userId }).sort({ createdAt: -1 });
    res.status(200).json(prescriptions);
  } catch (error: any) {
    res.status(200).json({ error: error.message });
  }
};

