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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state directly from localStorage so session is instant on browser restart
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [profile, setProfile] = useState<any | null>(() => {
    const savedProfile = localStorage.getItem('profile');
    return savedProfile ? JSON.parse(savedProfile) : null;
  });

  const [emergencyContact, setEmergencyContact] = useState<any | null>(() => {
    const savedContact = localStorage.getItem('emergencyContact');
    return savedContact ? JSON.parse(savedContact) : null;
  });

  const [loading, setLoading] = useState<boolean>(true);

  // Background profile validation on startup
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get('/auth/profile');
        const updatedUser = response.data.user;
        const updatedProfile = response.data.profile;
        const updatedContact = response.data.emergencyContact || null;

        setUser(updatedUser);
        setProfile(updatedProfile);
        setEmergencyContact(updatedContact);

        // Update persistent cache
        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('profile', JSON.stringify(updatedProfile));
        if (updatedContact) {
          localStorage.setItem('emergencyContact', JSON.stringify(updatedContact));
        }
      } catch (err) {
        console.error('Failed to validate session token:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
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
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: any) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', data);
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
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed.');
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
      const updatedUser = response.data.user;
      const updatedProfile = response.data.profile;
      const updatedContact = response.data.emergencyContact || null;

      setUser(updatedUser);
      setProfile(updatedProfile);
      setEmergencyContact(updatedContact);

      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem('profile', JSON.stringify(updatedProfile));
      if (updatedContact) {
        localStorage.setItem('emergencyContact', JSON.stringify(updatedContact));
      }
    } catch (err) {
      console.error('Refresh profile error:', err);
    }
  };

  const changePassword = async (passwords: any) => {
    try {
      await api.post('/auth/change-password', passwords);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to change password.');
    }
  };

  const deleteAccount = async () => {
    try {
      await api.delete('/auth/delete-account');
      logout();
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete account.');
    }
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
