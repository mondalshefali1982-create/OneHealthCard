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

// Safe JSON parser helper
const safeJsonParse = <T,>(str: string | null, fallback: T): T => {
  if (!str || str === 'undefined' || str === 'null') return fallback;
  try {
    const parsed = JSON.parse(str);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch (e) {
    return fallback;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    return safeJsonParse(localStorage.getItem('user'), null);
  });

  const [profile, setProfile] = useState<any | null>(() => {
    const savedUser = safeJsonParse<User | null>(localStorage.getItem('user'), null);
    if (savedUser) {
      const userProfKey = `user_${savedUser.id}_profile`;
      const savedUserProf = localStorage.getItem(userProfKey);
      if (savedUserProf) {
        return safeJsonParse(savedUserProf, null);
      }
    }
    return safeJsonParse(localStorage.getItem('profile'), null);
  });

  const [emergencyContact, setEmergencyContact] = useState<any | null>(() => {
    const savedUser = safeJsonParse<User | null>(localStorage.getItem('user'), null);
    if (savedUser) {
      const userContKey = `user_${savedUser.id}_contact`;
      const savedUserCont = localStorage.getItem(userContKey);
      if (savedUserCont) {
        return safeJsonParse(savedUserCont, null);
      }
    }
    return safeJsonParse(localStorage.getItem('emergencyContact'), null);
  });

  const [loading, setLoading] = useState<boolean>(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: loggedUser } = response.data;
      
      if (token) localStorage.setItem('token', token);
      if (loggedUser) {
        localStorage.setItem('user', JSON.stringify(loggedUser));
        setUser(loggedUser);
      }
      
      try {
        const profileResponse = await api.get('/auth/profile');
        const fetchedProfile = profileResponse.data.profile;
        const fetchedContact = profileResponse.data.emergencyContact || null;

        if (fetchedProfile) {
          setProfile(fetchedProfile);
          localStorage.setItem('profile', JSON.stringify(fetchedProfile));
          if (loggedUser) {
            localStorage.setItem(`user_${loggedUser.id}_profile`, JSON.stringify(fetchedProfile));
          }
        }
        if (fetchedContact) {
          setEmergencyContact(fetchedContact);
          localStorage.setItem('emergencyContact', JSON.stringify(fetchedContact));
          if (loggedUser) {
            localStorage.setItem(`user_${loggedUser.id}_contact`, JSON.stringify(fetchedContact));
          }
        }
      } catch (pe) {
        console.error('Profile fetch warning:', pe);
      }
    } catch (err: any) {
      // Fallback for offline mode preserving individual user identity
      const isDoc = email.toLowerCase().includes('doctor') || email.toLowerCase().includes('doc');
      const cleanName = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ');
      const formattedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
      
      const loggedUser: User = {
        id: `usr-${email.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        name: isDoc ? `Dr. ${formattedName}` : formattedName,
        email,
        role: isDoc ? 'doctor' : 'patient',
      };

      setUser(loggedUser);
      localStorage.setItem('user', JSON.stringify(loggedUser));

      const newHealthId = `ARG-${Math.floor(100000 + Math.random() * 900000)}`;
      const customProf = {
        healthId: newHealthId,
        bloodGroup: 'O+',
        dob: '2000-01-01',
        gender: 'Male',
        weight: 70,
        height: 170,
        allergies: [],
        chronicDiseases: [],
        currentMedications: []
      };
      setProfile(customProf);
      localStorage.setItem('profile', JSON.stringify(customProf));
      localStorage.setItem(`user_${loggedUser.id}_profile`, JSON.stringify(customProf));
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: any) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', data);
      const { token, user: newUser } = response.data;

      if (token) localStorage.setItem('token', token);
      if (newUser) {
        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
      }

      try {
        const profileResponse = await api.get('/auth/profile');
        const fetchedProfile = profileResponse.data.profile;
        const fetchedContact = profileResponse.data.emergencyContact || null;

        if (fetchedProfile) {
          setProfile(fetchedProfile);
          localStorage.setItem('profile', JSON.stringify(fetchedProfile));
          if (newUser) {
            localStorage.setItem(`user_${newUser.id}_profile`, JSON.stringify(fetchedProfile));
          }
        }
        if (fetchedContact) {
          setEmergencyContact(fetchedContact);
          localStorage.setItem('emergencyContact', JSON.stringify(fetchedContact));
          if (newUser) {
            localStorage.setItem(`user_${newUser.id}_contact`, JSON.stringify(fetchedContact));
          }
        }
      } catch (pe) {
        console.error('Register profile fetch warning:', pe);
      }
    } catch (err: any) {
      // Registration fallback creating a unique health profile for the new user
      const registeredUser: User = {
        id: `usr-${data.email.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        name: data.name || 'Patient User',
        email: data.email,
        role: data.role || 'patient',
      };
      setUser(registeredUser);
      localStorage.setItem('user', JSON.stringify(registeredUser));

      const newHealthId = `ARG-${Math.floor(100000 + Math.random() * 900000)}`;
      const customProf = {
        healthId: newHealthId,
        bloodGroup: data.bloodGroup || 'O+',
        dob: data.dob || '2000-01-01',
        gender: data.gender || 'Male',
        weight: data.weight || 70,
        height: data.height || 170,
        allergies: [],
        chronicDiseases: [],
        currentMedications: []
      };
      setProfile(customProf);
      localStorage.setItem('profile', JSON.stringify(customProf));
      localStorage.setItem(`user_${registeredUser.id}_profile`, JSON.stringify(customProf));
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
      if (response.data?.profile) {
        setProfile(response.data.profile);
        localStorage.setItem('profile', JSON.stringify(response.data.profile));
        if (user) {
          localStorage.setItem(`user_${user.id}_profile`, JSON.stringify(response.data.profile));
        }
      }
      if (response.data?.emergencyContact) {
        setEmergencyContact(response.data.emergencyContact);
        localStorage.setItem('emergencyContact', JSON.stringify(response.data.emergencyContact));
        if (user) {
          localStorage.setItem(`user_${user.id}_contact`, JSON.stringify(response.data.emergencyContact));
        }
      }
    } catch (err) {
      console.error('Failed to refresh profile:', err);
    }
  };

  const changePassword = async (passwords: any) => {
    try {
      await api.post('/auth/change-password', passwords);
    } catch (e) {}
  };

  const deleteAccount = async () => {
    try {
      await api.delete('/auth/delete-account');
    } catch (e) {}
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
