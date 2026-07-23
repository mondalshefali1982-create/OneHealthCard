import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import Card3D from '../components/Card3D';
import EditModal from '../components/EditModal';
import { SkeletonCard, SkeletonText } from '../components/SkeletonLoader';
import { Droplet, Scale, Ruler, Edit3, Calendar, FileText, Pill, RefreshCcw, Stethoscope } from 'lucide-react';
import { useToast } from '../components/Toast';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [patientData, setPatientData] = useState<any>(null);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [profileRes, presRes] = await Promise.all([
        api.get('/patient/profile'),
        api.get('/patient/prescriptions')
      ]);
      setPatientData({ ...user, ...profileRes.data });
      setPrescriptions(presRes.data);
    } catch (error) {
      showToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonText className="h-10 w-1/3" />
        <SkeletonCard className="h-64 w-full max-w-md mx-auto" />
        <div className="grid grid-cols-3 gap-4">
          <SkeletonCard className="h-24" />
          <SkeletonCard className="h-24" />
          <SkeletonCard className="h-24" />
        </div>
        <SkeletonCard className="h-48" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Welcome, {user?.name}</h1>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Health Profile Active
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleRefresh}
            className={`p-2 glass-card text-slate-600 hover:text-primary-600 transition-colors ${refreshing ? 'animate-spin' : ''}`}
            title="Refresh"
          >
            <RefreshCcw className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="px-4 py-2 bg-white border border-slate-200 shadow-sm rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <Edit3 className="w-4 h-4" /> Edit Profile
          </button>
        </div>
      </div>

      {/* 3D Card Section */}
      <div className="py-8 border-y border-slate-200/50 bg-slate-50/50 -mx-4 md:-mx-8 px-4 md:px-8">
        <Card3D patient={patientData} />
      </div>

      {/* Core Vitals */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4">Core Vitals</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4 flex items-center gap-4">
            <div className="p-3 bg-red-100 text-red-600 rounded-xl"><Droplet className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Blood Group</p>
              <p className="text-xl font-bold text-slate-800">{patientData?.bloodGroup || '--'}</p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Scale className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Weight</p>
              <p className="text-xl font-bold text-slate-800">{patientData?.weight ? `${patientData.weight} kg` : '--'}</p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl"><Ruler className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Height</p>
              <p className="text-xl font-bold text-slate-800">{patientData?.height ? `${patientData.height} cm` : '--'}</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Medical Timeline */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary-500" /> Past Prescriptions
        </h2>
        
        {prescriptions.length === 0 ? (
          <div className="glass-card p-12 text-center border-dashed border-2">
            <Stethoscope className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-700">No prescriptions yet</h3>
            <p className="text-slate-500 mt-1 max-w-sm mx-auto">When a doctor writes a prescription for your Health ID, it will automatically appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {prescriptions.map((rx, idx) => (
              <motion.div 
                key={rx.id || idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card p-5 border-l-4 border-l-primary-500 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
                  <div>
                    <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-bold rounded-full mb-2 uppercase tracking-wider">
                      {rx.diagnosis}
                    </span>
                    <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                      <Stethoscope className="w-4 h-4" /> Dr. {rx.doctorName}
                      <span className="text-slate-300">•</span>
                      <Calendar className="w-4 h-4" /> {new Date(rx.date || Date.now()).toLocaleDateString()}
                    </div>
                  </div>
                  {rx.notes && (
                    <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-600 max-w-xs italic border border-slate-100">
                      "{rx.notes}"
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider flex items-center gap-1">
                    <Pill className="w-3 h-3" /> Prescribed Medications
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {rx.medications?.map((med: any, mIdx: number) => (
                      <div key={mIdx} className="flex items-start justify-between bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">{med.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{med.frequency} • {med.duration}</p>
                        </div>
                        <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded">{med.dosage}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {isEditModalOpen && (
          <EditModal 
            patient={patientData} 
            onClose={() => setIsEditModalOpen(false)} 
            onSuccess={() => {
              setIsEditModalOpen(false);
              fetchDashboardData();
            }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
