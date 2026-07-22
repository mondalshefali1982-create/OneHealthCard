import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth.js';
import { Landing } from './pages/Landing.js';
import { Auth } from './pages/Auth.js';
import { Dashboard } from './pages/Dashboard.js';
import { DoctorPortal } from './pages/DoctorPortal.js';
import { DoctorFinder } from './pages/DoctorFinder.js';
import { AiReportScanner } from './pages/AiReportScanner.js';
import { Settings } from './pages/Settings.js';
import { NotFound } from './pages/NotFound.js';

// Route Guard for logged in users based on role
interface GuardProps {
  children: React.ReactElement;
  allowedRole?: 'patient' | 'doctor';
}

const RouteGuard: React.FC<GuardProps> = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center flex-col gap-3">
        <span className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-xs tracking-wider">Verifying medical card keys...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'patient' ? '/dashboard' : '/doctor-portal'} replace />;
  }

  return children;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Views */}
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />

          {/* Patient Views */}
          <Route
            path="/dashboard"
            element={
              <RouteGuard allowedRole="patient">
                <Dashboard />
              </RouteGuard>
            }
          />
          <Route
            path="/doctor-finder"
            element={
              <RouteGuard allowedRole="patient">
                <DoctorFinder />
              </RouteGuard>
            }
          />
          <Route
            path="/report-scanner"
            element={
              <RouteGuard allowedRole="patient">
                <AiReportScanner />
              </RouteGuard>
            }
          />

          {/* Doctor Views */}
          <Route
            path="/doctor-portal"
            element={
              <RouteGuard allowedRole="doctor">
                <DoctorPortal />
              </RouteGuard>
            }
          />

          {/* Share Settings */}
          <Route
            path="/settings"
            element={
              <RouteGuard>
                <Settings />
              </RouteGuard>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
