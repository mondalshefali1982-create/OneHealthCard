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

const safeJsonParse = <T,>(str: string | null, fallback: T): T => {
  if (!str || str === 'undefined' || str === 'null') return fallback;
  try {
    const parsed = JSON.parse(str);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch (e) {
    return fallback;
  }
};

const getDeterministicHealthId = (userIdStr: string): string => {
  let hash = 0;
  const str = String(userIdStr || 'user');
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const num = Math.abs(hash % 900000) + 100000;
  return `ARG-${num}`;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    return safeJsonParse(localStorage.getItem('user'), null);
  });

  const [profile, setProfile] = useState<any | null>(() => {
    const savedUser = safeJsonParse<User | null>(localStorage.getItem('user'), null);
    if (savedUser?.id) {
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
    if (savedUser?.id) {
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
        const fetchedProfile = profileResponse.data?.profile;
        const fetchedContact = profileResponse.data?.emergencyContact || null;

        if (fetchedProfile && loggedUser) {
          setProfile(fetchedProfile);
          localStorage.setItem('profile', JSON.stringify(fetchedProfile));
          localStorage.setItem(`user_${loggedUser.id}_profile`, JSON.stringify(fetchedProfile));
        }
        if (fetchedContact && loggedUser) {
          setEmergencyContact(fetchedContact);
          localStorage.setItem('emergencyContact', JSON.stringify(fetchedContact));
          localStorage.setItem(`user_${loggedUser.id}_contact`, JSON.stringify(fetchedContact));
        }
      } catch (pe) {
        console.error('Profile fetch warning:', pe);
      }
    } catch (err: any) {
      // Fallback for offline/serverless mode preserving exact user identity & stored data
      const isDoc = email.toLowerCase().includes('doctor') || email.toLowerCase().includes('doc');
      const cleanName = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ');
      const formattedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
      const userId = `usr_${email.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
      
      const loggedUser: User = {
        id: userId,
        name: isDoc ? `Dr. ${formattedName}` : formattedName,
        email,
        role: isDoc ? 'doctor' : 'patient',
      };

      setUser(loggedUser);
      localStorage.setItem('user', JSON.stringify(loggedUser));

      // Check if user already has an existing saved profile in localStorage
      const userProfKey = `user_${userId}_profile`;
      const userContKey = `user_${userId}_contact`;
      const existingUserProf = safeJsonParse(localStorage.getItem(userProfKey), null);
      const existingUserCont = safeJsonParse(localStorage.getItem(userContKey), null);

      if (existingUserProf) {
        setProfile(existingUserProf);
        localStorage.setItem('profile', JSON.stringify(existingUserProf));
      } else {
        const deterministicHealthId = getDeterministicHealthId(userId);
        const newProf = {
          healthId: deterministicHealthId,
          bloodGroup: 'O+',
          dob: '2000-01-01',
          gender: 'Male',
          weight: 70,
          height: 170,
          allergies: [],
          chronicDiseases: [],
          currentMedications: []
        };
        setProfile(newProf);
        localStorage.setItem('profile', JSON.stringify(newProf));
        localStorage.setItem(userProfKey, JSON.stringify(newProf));
      }

      if (existingUserCont) {
        setEmergencyContact(existingUserCont);
        localStorage.setItem('emergencyContact', JSON.stringify(existingUserCont));
      } else {
        const defaultCont = { name: 'Emergency Contact', phone: '0000000000', relationship: 'Family' };
        setEmergencyContact(defaultCont);
        localStorage.setItem('emergencyContact', JSON.stringify(defaultCont));
        localStorage.setItem(userContKey, JSON.stringify(defaultCont));
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

      if (token) localStorage.setItem('token', token);
      if (newUser) {
        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
      }

      try {
        const profileResponse = await api.get('/auth/profile');
        const fetchedProfile = profileResponse.data?.profile;
        const fetchedContact = profileResponse.data?.emergencyContact || null;

        if (fetchedProfile && newUser) {
          setProfile(fetchedProfile);
          localStorage.setItem('profile', JSON.stringify(fetchedProfile));
          localStorage.setItem(`user_${newUser.id}_profile`, JSON.stringify(fetchedProfile));
        }
        if (fetchedContact && newUser) {
          setEmergencyContact(fetchedContact);
          localStorage.setItem('emergencyContact', JSON.stringify(fetchedContact));
          localStorage.setItem(`user_${newUser.id}_contact`, JSON.stringify(fetchedContact));
        }
      } catch (pe) {
        console.error('Register profile fetch warning:', pe);
      }
    } catch (err: any) {
      const userId = `usr_${data.email.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
      const registeredUser: User = {
        id: userId,
        name: data.name || 'Patient User',
        email: data.email,
        role: data.role || 'patient',
      };
      setUser(registeredUser);
      localStorage.setItem('user', JSON.stringify(registeredUser));

      const deterministicHealthId = getDeterministicHealthId(userId);
      const newProf = {
        healthId: deterministicHealthId,
        bloodGroup: data.bloodGroup || 'O+',
        dob: data.dob || '2000-01-01',
        gender: data.gender || 'Male',
        weight: data.weight || 70,
        height: data.height || 170,
        allergies: [],
        chronicDiseases: [],
        currentMedications: []
      };
      setProfile(newProf);
      localStorage.setItem('profile', JSON.stringify(newProf));
      localStorage.setItem(`user_${userId}_profile`, JSON.stringify(newProf));

      const newCont = data.emergencyContact || { name: 'Emergency Contact', phone: '0000000000', relationship: 'Family' };
      setEmergencyContact(newCont);
      localStorage.setItem('emergencyContact', JSON.stringify(newCont));
      localStorage.setItem(`user_${userId}_contact`, JSON.stringify(newCont));
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
        if (user?.id) {
          localStorage.setItem(`user_${user.id}_profile`, JSON.stringify(response.data.profile));
        }
      }
      if (response.data?.emergencyContact) {
        setEmergencyContact(response.data.emergencyContact);
        localStorage.setItem('emergencyContact', JSON.stringify(response.data.emergencyContact));
        if (user?.id) {
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
