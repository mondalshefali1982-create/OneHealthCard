import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layouts & Protections
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';

// Pages
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import DoctorPortal from './pages/DoctorPortal';
import DoctorFinder from './pages/DoctorFinder';
import AiReportScanner from './pages/AiReportScanner';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />

        {/* Shared Authenticated Routes */}
        <Route element={<ProtectedRoute allowedRoles={['patient', 'doctor']}><DashboardLayout /></ProtectedRoute>}>
          <Route path="/doctor-finder" element={<DoctorFinder />} />
          <Route path="/ai-scanner" element={<AiReportScanner />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Protected Patient Routes */}
        <Route element={<ProtectedRoute allowedRoles={['patient']}><DashboardLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Protected Doctor Routes */}
        <Route element={<ProtectedRoute allowedRoles={['doctor']}><DashboardLayout /></ProtectedRoute>}>
          <Route path="/doctor-portal" element={<DoctorPortal />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
