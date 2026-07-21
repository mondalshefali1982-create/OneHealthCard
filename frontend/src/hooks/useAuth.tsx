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
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch profile on initial render if token exists
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get('/auth/profile');
        setUser(response.data.user);
        setProfile(response.data.profile);
      } catch (err) {
        console.error('Failed to load user profile:', err);
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
      setUser(loggedUser);
      
      // Fetch full profile to populate dashboard
      const profileResponse = await api.get('/auth/profile');
      setProfile(profileResponse.data.profile);
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
      setUser(loggedUser);

      // Fetch full profile to populate dashboard
      const profileResponse = await api.get('/auth/profile');
      setProfile(profileResponse.data.profile);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    try {
      const response = await api.get('/auth/profile');
      setUser(response.data.user);
      setProfile(response.data.profile);
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
