import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Home } from 'lucide-react';
import { motion } from 'framer-motion';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col justify-center items-center p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-900/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-900/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md rounded-2xl glass-card border border-white/10 p-8 shadow-2xl z-10 text-center flex flex-col items-center gap-6"
      >
        <div className="p-4 bg-rose-500/10 border border-rose-500/25 rounded-full text-rose-400">
          <ShieldAlert className="h-10 w-10 animate-pulse" />
        </div>

        <div>
          <h1 className="text-4xl font-extrabold text-white mb-2">404 Error</h1>
          <h2 className="text-base font-bold text-slate-300 mb-2">Page Not Found</h2>
          <p className="text-slate-400 text-xs leading-relaxed max-w-sm m-0">
            The medical card terminal path you are looking for does not exist or has been shifted securely.
          </p>
        </div>

        <button
          onClick={() => navigate('/')}
          className="py-2.5 px-6 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 active:scale-95 shadow-lg shadow-primary-500/25"
        >
          <Home className="h-4 w-4" /> Go Back Home
        </button>
      </motion.div>
    </div>
  );
};
export default NotFound;
