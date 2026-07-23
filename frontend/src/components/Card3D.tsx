import React, { useState, MouseEvent } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { ShieldAlert, Activity, Phone, User, HeartPulse } from 'lucide-react';

interface Card3DProps {
  patient: {
    name: string;
    healthId: string;
    bloodGroup?: string;
    dob?: string;
    gender?: string;
    allergies?: string[];
    conditions?: string[];
    medications?: string[];
    emergencyContact?: {
      name: string;
      relationship: string;
      phone: string;
    };
  };
}

const Card3D: React.FC<Card3DProps> = ({ patient }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [transform, setTransform] = useState('');

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isFlipped) {
      setTransform('');
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTransform(`perspective(1000px) rotateX(${-y / 20}deg) rotateY(${x / 20}deg) scale3d(1.02, 1.02, 1.02)`);
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="relative w-full max-w-md h-64 mx-auto cursor-pointer group perspective"
      onClick={() => setIsFlipped(!isFlipped)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: '1000px' }}
    >
      <div 
        className="w-full h-full relative preserve-3d transition-all duration-700 ease-out"
        style={{ 
          transform: isFlipped ? 'rotateY(180deg)' : transform || 'rotateY(0deg)',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Front Face */}
        <div className="absolute inset-0 backface-hidden w-full h-full rounded-2xl shadow-2xl bg-gradient-to-br from-sky-400 to-blue-600 text-white overflow-hidden border border-white/20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20 mix-blend-overlay"></div>
          
          <div className="p-6 h-full flex flex-col relative z-10">
            <div className="flex justify-between items-start mb-auto">
              <div>
                <p className="text-xs font-semibold tracking-wider text-sky-100 mb-1">DIGITAL HEALTH PASSPORT</p>
                <h2 className="text-2xl font-bold uppercase tracking-tight">{patient.name || 'Unknown Patient'}</h2>
                <p className="font-mono text-sm bg-black/20 inline-block px-2 py-0.5 rounded backdrop-blur-sm mt-1 border border-white/10">
                  {patient.healthId}
                </p>
              </div>
              <div className="bg-white p-1.5 rounded-lg shadow-lg">
                <QRCodeSVG value={patient.healthId} size={64} level="H" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-sm mt-6 mb-2">
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 border border-white/10">
                <p className="text-xs text-sky-200">Blood</p>
                <p className="font-bold">{patient.bloodGroup || 'N/A'}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 border border-white/10">
                <p className="text-xs text-sky-200">DOB</p>
                <p className="font-bold">{patient.dob || 'N/A'}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 border border-white/10">
                <p className="text-xs text-sky-200">Gender</p>
                <p className="font-bold">{patient.gender || 'N/A'}</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center text-xs text-sky-100 mt-2 border-t border-white/20 pt-2">
              <span className="flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> ISO-27001 Medical Standard</span>
              <span>Tap to flip</span>
            </div>
          </div>
        </div>

        {/* Back Face */}
        <div 
          className="absolute inset-0 backface-hidden w-full h-full rounded-2xl shadow-xl bg-white text-slate-800 overflow-hidden border-2 border-primary-500"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <div className="bg-primary-50 px-4 py-2 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-bold text-primary-700 tracking-wider">EMERGENCY & MEDICAL SPECS</h3>
            <HeartPulse className="w-4 h-4 text-primary-500" />
          </div>
          
          <div className="p-4 h-[calc(100%-2.5rem)] flex flex-col gap-3 text-sm overflow-y-auto custom-scrollbar">
            {/* Allergies */}
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1">ALLERGIES</p>
              <div className="flex flex-wrap gap-1">
                {patient.allergies?.length ? patient.allergies.map((a, i) => (
                  <span key={i} className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium border border-red-200">{a}</span>
                )) : <span className="text-xs text-slate-400">None recorded</span>}
              </div>
            </div>

            {/* Conditions */}
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1">CHRONIC CONDITIONS</p>
              <div className="flex flex-wrap gap-1">
                {patient.conditions?.length ? patient.conditions.map((c, i) => (
                  <span key={i} className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-medium border border-orange-200">{c}</span>
                )) : <span className="text-xs text-slate-400">None recorded</span>}
              </div>
            </div>

            {/* Active Meds */}
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1">ACTIVE MEDICATIONS</p>
              <div className="flex flex-wrap gap-1">
                {patient.medications?.length ? patient.medications.map((m, i) => (
                  <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium border border-blue-200">{m}</span>
                )) : <span className="text-xs text-slate-400">None recorded</span>}
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="mt-auto pt-3 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-500 mb-1">EMERGENCY CONTACT</p>
              {patient.emergencyContact?.name ? (
                <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3 text-slate-400" />
                    <span className="text-xs font-medium">{patient.emergencyContact.name} ({patient.emergencyContact.relationship})</span>
                  </div>
                  <div className="flex items-center gap-1 text-primary-600 font-medium">
                    <Phone className="w-3 h-3" />
                    <span className="text-xs">{patient.emergencyContact.phone}</span>
                  </div>
                </div>
              ) : <span className="text-xs text-slate-400">Not provided</span>}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Card3D;
