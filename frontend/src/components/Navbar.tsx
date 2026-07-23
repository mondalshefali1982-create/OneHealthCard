import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full z-40 glass border-b border-slate-200/50 h-16 px-4 md:px-8 flex items-center justify-between"
    >
      <Link to={user?.role === 'doctor' ? '/doctor-portal' : '/dashboard'} className="flex items-center gap-2 group">
        <div className="p-2 bg-gradient-to-br from-sky-400 to-primary-600 rounded-xl text-white shadow-lg group-hover:shadow-primary-500/30 transition-all">
          <Activity className="w-5 h-5" />
        </div>
        <span className="font-bold text-xl tracking-tight text-slate-800">OneHealth<span className="text-primary-600">Card</span></span>
      </Link>

      <div className="relative">
        <button 
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-200 to-primary-200 text-primary-700 flex items-center justify-center font-bold">
            {user?.name?.charAt(0) || <UserIcon className="w-4 h-4" />}
          </div>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-semibold text-slate-700 leading-tight">{user?.name}</span>
            <span className="text-xs text-slate-500 capitalize leading-tight">{user?.role}</span>
          </div>
        </button>

        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-48 glass-card border border-slate-200/50 overflow-hidden shadow-xl"
            >
              <div className="p-3 border-b border-slate-100">
                <p className="text-sm font-medium text-slate-800 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
              <div className="p-1">
                {user?.role === 'patient' && (
                  <Link to="/settings" onClick={() => setShowDropdown(false)} className="flex items-center gap-2 w-full p-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary-600 rounded-md transition-colors">
                    <UserIcon className="w-4 h-4" /> Profile Settings
                  </Link>
                )}
                <button onClick={handleLogout} className="flex items-center gap-2 w-full p-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors">
                  <LogOut className="w-4 h-4" /> Log out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
