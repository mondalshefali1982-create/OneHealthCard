import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User';
import PatientProfile from '../models/PatientProfile';
import DoctorProfile from '../models/DoctorProfile';

const JWT_SECRET = process.env.JWT_SECRET || 'onehealthcard_jwt_secret_key_2026';

const generateHealthId = (userId: string) => {
  const hash = crypto.createHash('sha256').update(userId).digest('hex');
  const shortHash = hash.substring(0, 6).toUpperCase();
  return `ARG-${shortHash}`;
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, specialty, hospital, experience, consultationFee, city } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(200).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await user.save();

    const healthId = role === 'patient' ? generateHealthId(user._id.toString()) : undefined;
    if (healthId) {
      user.healthId = healthId;
      await user.save();
    }

    if (role === 'patient') {
      await new PatientProfile({ userId: user._id }).save();
    } else if (role === 'doctor') {
      await new DoctorProfile({
        userId: user._id,
        specialty: specialty || 'General Physician',
        hospital: hospital || 'City Hospital',
        experience: experience || 0,
        consultationFee: consultationFee || 0,
        city: city || 'Unknown'
      }).save();
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '30d' });
    res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, healthId: user.healthId } });
  } catch (error: any) {
    res.status(200).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !user.password) {
      return res.status(200).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(200).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '30d' });
    res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, healthId: user.healthId } });
  } catch (error: any) {
    res.status(200).json({ error: error.message });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.userId).select('-password');
    if (!user) {
      return res.status(200).json({ error: 'User not found' });
    }
    res.status(200).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role, healthId: user.healthId } });
  } catch (error: any) {
    res.status(200).json({ error: error.message });
  }
};
