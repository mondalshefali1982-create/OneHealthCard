import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Trash2, Save, User, FileText, Loader2, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../components/Toast';

const DoctorPortal: React.FC = () => {
  const [healthId, setHealthId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [patient, setPatient] = useState<any>(null);
  const [searchError, setSearchError] = useState(false);

  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [medications, setMedications] = useState([{ name: '', dosage: '', frequency: '', duration: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showToast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!healthId.trim()) return;

    setIsSearching(true);
    setSearchError(false);
    
    try {
      const res = await api.get(`/doctor/patient/${healthId}`);
      setPatient(res.data);
      // Reset form on new search
      setDiagnosis('');
      setNotes('');
      setMedications([{ name: '', dosage: '', frequency: '', duration: '' }]);
    } catch (error) {
      setPatient(null);
      setSearchError(true);
    } finally {
      setIsSearching(false);
    }
  };

  const addMedication = () => {
    setMedications([...medications, { name: '', dosage: '', frequency: '', duration: '' }]);
  };

  const removeMedication = (index: number) => {
    const newMeds = [...medications];
    newMeds.splice(index, 1);
    setMedications(newMeds);
  };

  const updateMedication = (index: number, field: string, value: string) => {
    const newMeds = [...medications];
    newMeds[index] = { ...newMeds[index], [field]: value };
    setMedications(newMeds);
  };

  const handleSubmit = async () => {
    if (!diagnosis || medications.some(m => !m.name)) {
      showToast('Diagnosis and Medication names are required', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/doctor/prescribe', {
        healthId: patient.healthId,
        diagnosis,
        notes,
        medications
      });
      showToast(`Prescription synced to patient ${patient.healthId}`, 'success');
      // Reset form but keep patient in view
      setDiagnosis('');
      setNotes('');
      setMedications([{ name: '', dosage: '', frequency: '', duration: '' }]);
    } catch (error) {
      showToast('Failed to save prescription', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="glass-card p-6 border-l-4 border-l-primary-500">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Doctor Portal</h1>
        <p className="text-slate-500">Enter a patient's Health ID to inspect their records and write prescriptions.</p>
        
        <form onSubmit={handleSearch} className="mt-6 flex gap-3 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={healthId}
              onChange={(e) => setHealthId(e.target.value.toUpperCase())}
              placeholder="e.g. ARG-XXXXXX"
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none uppercase font-mono tracking-wider transition-all"
            />
          </div>
          <button 
            type="submit" 
            disabled={isSearching}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors shadow-md flex items-center gap-2"
          >
            {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
          </button>
        </form>
      </div>

      <AnimatePresence mode="wait">
        {searchError && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-card p-8 text-center bg-red-50/50 border-red-100">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-red-800">No Patient Found</h3>
            <p className="text-red-600 mt-1">Please verify the Health ID and try again.</p>
          </motion.div>
        )}

        {patient && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid md:grid-cols-12 gap-6">
            
            {/* Patient Inspection Panel */}
            <div className="md:col-span-5 space-y-4">
              <div className="glass-card p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-100 to-transparent rounded-bl-full -z-10"></div>
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg">
                    {patient.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">{patient.name}</h2>
                    <p className="font-mono text-sm text-primary-600 bg-primary-50 inline-block px-2 py-0.5 rounded mt-1 border border-primary-100">{patient.healthId}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-500 mb-1">Blood Group</p>
                    <p className="font-bold text-slate-800">{patient.bloodGroup || 'N/A'}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-500 mb-1">Age / Gender</p>
                    <p className="font-bold text-slate-800">{patient.dob || '--'} • {patient.gender || '--'}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Allergies</h4>
                    <div className="flex flex-wrap gap-1">
                      {patient.allergies?.length ? patient.allergies.map((a: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded-md border border-red-100">{a}</span>
                      )) : <span className="text-sm text-slate-400">None</span>}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Conditions</h4>
                    <div className="flex flex-wrap gap-1">
                      {patient.conditions?.length ? patient.conditions.map((c: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded-md border border-orange-100">{c}</span>
                      )) : <span className="text-sm text-slate-400">None</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Prescription Form */}
            <div className="md:col-span-7">
              <div className="glass-card p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                  <FileText className="w-5 h-5 text-primary-500" /> Write Prescription
                </h3>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Diagnosis / Condition</label>
                    <input 
                      type="text" 
                      value={diagnosis}
                      onChange={e => setDiagnosis(e.target.value)}
                      placeholder="e.g. Acute Bronchitis"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-slate-700">Medications</label>
                      <button onClick={addMedication} className="text-xs font-medium text-primary-600 hover:bg-primary-50 px-2 py-1 rounded transition flex items-center gap-1">
                        <Plus className="w-3 h-3" /> Add Med
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <AnimatePresence>
                        {medications.map((med, idx) => (
                          <motion.div 
                            key={idx}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex gap-2 items-start"
                          >
                            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                              <input placeholder="Name (e.g. Amoxicillin)" value={med.name} onChange={e => updateMedication(idx, 'name', e.target.value)} className="col-span-2 md:col-span-1 p-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-primary-400" />
                              <input placeholder="Dosage (e.g. 500mg)" value={med.dosage} onChange={e => updateMedication(idx, 'dosage', e.target.value)} className="p-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-primary-400" />
                              <input placeholder="Freq (e.g. 1-0-1)" value={med.frequency} onChange={e => updateMedication(idx, 'frequency', e.target.value)} className="p-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-primary-400" />
                              <input placeholder="Days (e.g. 5 Days)" value={med.duration} onChange={e => updateMedication(idx, 'duration', e.target.value)} className="p-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-primary-400" />
                            </div>
                            <button onClick={() => removeMedication(idx)} disabled={medications.length === 1} className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition disabled:opacity-50 mt-1">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Notes / Instructions</label>
                    <textarea 
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="Additional instructions for the patient..."
                      rows={3}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                    ></textarea>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button 
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-colors shadow-lg flex items-center gap-2"
                    >
                      {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                      Save & Sync to Patient Card
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DoctorPortal;
