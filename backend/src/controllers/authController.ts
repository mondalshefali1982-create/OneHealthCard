import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import PatientProfile from '../models/PatientProfile.js';
import DoctorProfile from '../models/DoctorProfile.js';
import EmergencyContact from '../models/EmergencyContact.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

// Helper to generate unique Health ID
const generateUniqueHealthId = async (): Promise<string> => {
  let healthId = '';
  let isUnique = false;
  
  while (!isUnique) {
    const randomNum = Math.floor(100000 + Math.random() * 900000); // 6-digit number
    healthId = `ARG-${randomNum}`;
    const existing = await PatientProfile.findOne({ healthId });
    if (!existing) {
      isUnique = true;
    }
  }
  return healthId;
};

export const register = async (req: AuthRequest, res: Response) => {
  const { name, email, password, role, ...profileDetails } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Please provide name, email, password, and role.' });
  }

  if (role !== 'patient' && role !== 'doctor') {
    return res.status(400).json({ message: 'Invalid role. Must be either patient or doctor.' });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create User
    const user = new User({
      name,
      email,
      passwordHash,
      role
    });

    const savedUser = await user.save();

    // Create corresponding profile
    if (role === 'patient') {
      const healthId = await generateUniqueHealthId();
      
      const patientProfile = new PatientProfile({
        user: savedUser._id,
        healthId,
        bloodGroup: profileDetails.bloodGroup || 'Not Specified',
        dob: profileDetails.dob ? new Date(profileDetails.dob) : new Date('2000-01-01'),
        gender: profileDetails.gender || 'Not Specified',
        weight: profileDetails.weight || 0,
        height: profileDetails.height || 0,
        allergies: profileDetails.allergies || [],
        chronicDiseases: profileDetails.chronicDiseases || [],
        currentMedications: profileDetails.currentMedications || []
      });

      const savedPatient = await patientProfile.save();

      // Create emergency contact if provided
      if (profileDetails.emergencyContact) {
        const emergencyContact = new EmergencyContact({
          patient: savedPatient._id,
          name: profileDetails.emergencyContact.name || 'Emergency',
          relationship: profileDetails.emergencyContact.relationship || 'Contact',
          phone: profileDetails.emergencyContact.phone || '000-000-0000'
        });
        await emergencyContact.save();
      }
    } else {
      // Doctor profile creation
      const doctorProfile = new DoctorProfile({
        user: savedUser._id,
        specialization: profileDetails.specialization || 'General Practitioner',
        hospital: profileDetails.hospital || 'General Hospital',
        experience: profileDetails.experience || 0,
        location: profileDetails.location || 'Not Specified',
        phoneNumber: profileDetails.phoneNumber || '000-000-0000',
        googleMapsLocation: profileDetails.googleMapsLocation || ''
      });
      await doctorProfile.save();
    }

    // Generate JWT token
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: 'JWT secret is missing from server configurations.' });
    }

    const token = jwt.sign({ id: savedUser._id, role: savedUser.role }, secret, {
      expiresIn: '30d'
    });

    return res.status(201).json({
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role
      }
    });
  } catch (error: any) {
    return res.status(500).json({ message: `Registration failed: ${error.message}` });
  }
};

export const login = async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter email and password.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: 'JWT secret is missing from server configurations.' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, secret, {
      expiresIn: '30d'
    });

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error: any) {
    return res.status(500).json({ message: `Login failed: ${error.message}` });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized.' });
  }

  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.role === 'patient') {
      const patientProfile = await PatientProfile.findOne({ user: user._id });
      const emergencyContact = patientProfile
        ? await EmergencyContact.findOne({ patient: patientProfile._id })
        : null;

      return res.json({
        user,
        profile: patientProfile,
        emergencyContact
      });
    } else {
      const doctorProfile = await DoctorProfile.findOne({ user: user._id });
      return res.json({
        user,
        profile: doctorProfile
      });
    }
  } catch (error: any) {
    return res.status(500).json({ message: `Failed to fetch profile: ${error.message}` });
  }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized.' });
  }

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Please provide current and new passwords.' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();

    return res.json({ message: 'Password changed successfully.' });
  } catch (error: any) {
    return res.status(500).json({ message: `Password change failed: ${error.message}` });
  }
};

export const deleteAccount = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized.' });
  }

  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.role === 'patient') {
      const patientProfile = await PatientProfile.findOne({ user: userId });
      if (patientProfile) {
        await EmergencyContact.deleteMany({ patient: patientProfile._id });
        await PatientProfile.deleteOne({ _id: patientProfile._id });
      }
    } else {
      await DoctorProfile.deleteOne({ user: userId });
    }

    await User.deleteOne({ _id: userId });

    return res.json({ message: 'Account deleted successfully.' });
  } catch (error: any) {
    return res.status(500).json({ message: `Account deletion failed: ${error.message}` });
  }
};
