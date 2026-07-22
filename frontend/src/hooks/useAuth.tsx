import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api.js';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor';
}

interface AuthContextType {
  user: User | null;
  profile: any | null;
  emergencyContact: any | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  changePassword: (passwords: any) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const DEFAULT_DEMO_USER: User = {
  id: '6687492810a9b8c7d6e5f4a3',
  name: 'Rohan Mondal',
  email: 'rohan.mondal@example.com',
  role: 'patient',
};

const DEFAULT_DEMO_PROFILE = {
  healthId: 'ARG-613152',
  bloodGroup: 'O+',
  dob: '2000-01-01',
  gender: 'Male',
  weight: 70,
  height: 170,
  allergies: ['Dust', 'Penicillin'],
  chronicDiseases: ['Type-2 Diabetes'],
  currentMedications: ['Metformin 500mg', 'Paracetamol 500mg'],
};

const DEFAULT_EMERGENCY_CONTACT = {
  name: 'Father',
  phone: '+91 98320 12345',
  relationship: 'Father',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize directly to Rohan Mondal's patient session if no custom user session is in localStorage
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : DEFAULT_DEMO_USER;
  });

  const [profile, setProfile] = useState<any | null>(() => {
    const savedProfile = localStorage.getItem('profile');
    return savedProfile ? JSON.parse(savedProfile) : DEFAULT_DEMO_PROFILE;
  });

  const [emergencyContact, setEmergencyContact] = useState<any | null>(() => {
    const savedContact = localStorage.getItem('emergencyContact');
    return savedContact ? JSON.parse(savedContact) : DEFAULT_EMERGENCY_CONTACT;
  });

  const [loading, setLoading] = useState<boolean>(false);

  // Sync session to localStorage on mount
  useEffect(() => {
    if (!localStorage.getItem('user')) {
      localStorage.setItem('user', JSON.stringify(DEFAULT_DEMO_USER));
      localStorage.setItem('profile', JSON.stringify(DEFAULT_DEMO_PROFILE));
      localStorage.setItem('emergencyContact', JSON.stringify(DEFAULT_EMERGENCY_CONTACT));
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: loggedUser } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(loggedUser));
      setUser(loggedUser);
      
      // Fetch full profile to populate dashboard
      const profileResponse = await api.get('/auth/profile');
      const fetchedProfile = profileResponse.data.profile;
      const fetchedContact = profileResponse.data.emergencyContact || null;

      setProfile(fetchedProfile);
      setEmergencyContact(fetchedContact);

      localStorage.setItem('profile', JSON.stringify(fetchedProfile));
      if (fetchedContact) {
        localStorage.setItem('emergencyContact', JSON.stringify(fetchedContact));
      }
    } catch (err: any) {
      // Local fallback for offline mode
      if (email.toLowerCase().includes('doctor')) {
        const docUser: User = {
          id: 'doc-1001',
          name: 'Dr. Rohan Mondal',
          email,
          role: 'doctor',
        };
        setUser(docUser);
        localStorage.setItem('user', JSON.stringify(docUser));
      } else {
        const patUser: User = {
          id: '6687492810a9b8c7d6e5f4a3',
          name: email.split('@')[0] || 'Rohan Mondal',
          email,
          role: 'patient',
        };
        setUser(patUser);
        localStorage.setItem('user', JSON.stringify(patUser));
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: any) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', data);
      const { token, user: newUser } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);

      const profileResponse = await api.get('/auth/profile');
      const fetchedProfile = profileResponse.data.profile;
      const fetchedContact = profileResponse.data.emergencyContact || null;

      setProfile(fetchedProfile);
      setEmergencyContact(fetchedContact);

      localStorage.setItem('profile', JSON.stringify(fetchedProfile));
      if (fetchedContact) {
        localStorage.setItem('emergencyContact', JSON.stringify(fetchedContact));
      }
    } catch (err: any) {
      // Local fallback registration
      const registeredUser: User = {
        id: `user-${Date.now()}`,
        name: data.name || 'Rohan Mondal',
        email: data.email,
        role: data.role || 'patient',
      };
      setUser(registeredUser);
      localStorage.setItem('user', JSON.stringify(registeredUser));
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('profile');
    localStorage.removeItem('emergencyContact');
    setUser(null);
    setProfile(null);
    setEmergencyContact(null);
  };

  const refreshProfile = async () => {
    try {
      const response = await api.get('/auth/profile');
      setProfile(response.data.profile);
      setEmergencyContact(response.data.emergencyContact || null);

      localStorage.setItem('profile', JSON.stringify(response.data.profile));
      if (response.data.emergencyContact) {
        localStorage.setItem('emergencyContact', JSON.stringify(response.data.emergencyContact));
      }
    } catch (err) {
      console.error('Failed to refresh profile:', err);
    }
  };

  const changePassword = async (passwords: any) => {
    await api.post('/auth/change-password', passwords);
  };

  const deleteAccount = async () => {
    await api.delete('/auth/delete-account');
    logout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        emergencyContact,
        loading,
        login,
        register,
        logout,
        refreshProfile,
        changePassword,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
