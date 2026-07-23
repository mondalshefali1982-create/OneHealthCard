import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Stethoscope, Brain, Settings as SettingsIcon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';

const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const patientLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/doctor-finder', icon: Stethoscope, label: 'Find a Doctor' },
    { to: '/ai-scanner', icon: Brain, label: 'AI Analyzer' },
    { to: '/settings', icon: SettingsIcon, label: 'Settings' },
  ];

  const doctorLinks = [
    { to: '/doctor-portal', icon: Stethoscope, label: 'Doctor Portal' },
    { to: '/ai-scanner', icon: Brain, label: 'AI Analyzer' },
  ];

  const links = user?.role === 'doctor' ? doctorLinks : patientLinks;

  return (
    <motion.aside 
      initial={{ x: -200 }}
      animate={{ x: 0 }}
      className="w-16 md:w-64 glass border-r border-slate-200/50 flex flex-col pt-6"
    >
      <div className="flex-1 px-3 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-primary-50 text-primary-700 shadow-sm' 
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="hidden md:block font-medium">{link.label}</span>
            </NavLink>
          );
        })}
      </div>
    </motion.aside>
  );
};

export default Sidebar;
