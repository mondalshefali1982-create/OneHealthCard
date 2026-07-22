import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import api from '../services/api.js';
import { Html5QrcodeScanner } from 'html5-qrcode';
import {
  Search, Camera, Activity, Calendar, Award, ShieldAlert,
  User, CheckCircle, Plus, FileText, Trash2, Heart, Scale,
  CalendarRange, LogOut, ArrowRight, BookOpen, RefreshCw, Settings
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const DoctorPortal: React.FC = () => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  // Doctor state
  const [patientId, setPatientId] = useState('');
  const [patientData, setPatientData] = useState<any | null>(null);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Scanner state
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  // New Prescription Form state
  const [diagnosis, setDiagnosis] = useState('');
  const [medInput, setMedInput] = useState('');
  const [medicationsList, setMedicationsList] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [loadingPrescribe, setLoadingPrescribe] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (user.role === 'patient') {
      navigate('/dashboard');
      return;
    }
  }, [user]);

  // Clean up scanner on unmount
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error(err));
      }
    };
  }, []);

  const handleSearch = async (targetId?: string) => {
    const idToSearch = targetId || patientId;
    if (!idToSearch) {
      setErrorMsg('Please enter a Health ID or scan a card.');
      return;
    }

    setLoadingSearch(true);
    setErrorMsg('');
    setPatientData(null);

    try {
      const response = await api.get(`/doctor/patient/${idToSearch.trim()}`);
      setPatientData(response.data);
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || 'Patient not found. Verify Health ID.');
    } finally {
      setLoadingSearch(false);
    }
  };

  const startScanner = () => {
    setScanning(true);
    setErrorMsg('');
    
    // Defer initialization to ensure DOM element with id="reader" exists
    setTimeout(() => {
      try {
        const scanner = new Html5QrcodeScanner(
          'reader',
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            rememberLastUsedCamera: true
          },
          false
        );

        scanner.render(
          (decodedText) => {
            // Success callback
            setPatientId(decodedText);
            scanner.clear().then(() => {
              setScanning(false);
              handleSearch(decodedText);
            }).catch(err => {
              console.error(err);
              setScanning(false);
            });
          },
          (errorMessage) => {
            // Verbose error callback, standard to ignore to avoid logs flooding
          }
        );

        scannerRef.current = scanner;
      } catch (err) {
        console.error('Error starting html5-qrcode scanner:', err);
        setScanning(false);
        setErrorMsg('Webcam scanner failed to initialize. Try manual input.');
      }
    }, 200);
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().then(() => {
        setScanning(false);
        scannerRef.current = null;
      }).catch(err => {
        console.error(err);
        setScanning(false);
      });
    } else {
      setScanning(false);
    }
  };

  const addMed = () => {
    if (medInput && !medicationsList.includes(medInput)) {
      setMedicationsList([...medicationsList, medInput]);
      setMedInput('');
    }
  };

  const removeMed = (med: string) => {
    setMedicationsList(medicationsList.filter(m => m !== med));
  };

  const handlePrescribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagnosis || medicationsList.length === 0) {
      alert('Please enter diagnosis and at least one medication.');
      return;
    }

    setLoadingPrescribe(true);
    setSuccessMsg('');

    try {
      await api.post(`/doctor/patient/${patientData.profile.healthId}/prescription`, {
        diagnosis,
        medications: medicationsList,
        notes
      });

      setSuccessMsg('Prescription saved directly to Patient profile timeline.');
      setDiagnosis('');
      setMedicationsList([]);
      setNotes('');

      // Refresh patient profile view
      await handleSearch(patientData.profile.healthId);
    } catch (err) {
      console.error(err);
      alert('Failed to save prescription.');
    } finally {
      setLoadingPrescribe(false);
    }
  };

  const calculateAge = (dobString: string) => {
    const dobDate = new Date(dobString);
    const diff = Date.now() - dobDate.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col md:flex-row relative">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-dark-900 border-r border-white/5 p-6 flex flex-col justify-between shrink-0">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-600 rounded-lg">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="text-base font-bold text-white tracking-tight">OneHealthCard</span>
          </div>

          <div className="text-left py-2 px-3 rounded-xl bg-slate-800/40 border border-white/5">
            <span className="text-[10px] text-primary-400 font-bold uppercase tracking-wider">LoggedIn Doctor</span>
            <h4 className="text-sm font-bold text-white mb-0.5 mt-0.5 truncate">{user?.name}</h4>
            <p className="text-[10px] text-slate-500 m-0 truncate">{profile?.hospital}</p>
          </div>

          <nav className="flex flex-col gap-1">
            <Link to="/doctor-portal" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-semibold transition-all">
              <User className="h-4 w-4" /> Patient Records
            </Link>
            <Link to="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 text-sm font-semibold transition-all">
              <Settings className="h-4 w-4" /> Account Settings
            </Link>
          </nav>
        </div>

        <button onClick={logout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 text-sm font-semibold transition-all border border-transparent mt-8">
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
        <div className="text-left flex flex-col gap-8">
          
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-primary-400">DOCTOR CONSOLE</span>
            <h1 className="text-3xl font-extrabold text-white mt-1 mb-0">Clinical Access Hub</h1>
            <p className="text-slate-400 text-sm">Scan patient cards or lookup medical history securely via unique Health IDs.</p>
          </div>

          {/* Search Block & Scanner Toggle */}
          <div className="grid md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-8 flex gap-3 w-full">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Enter Patient Health ID (e.g. ARG-428194)"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm"
                />
              </div>
              <button
                onClick={() => handleSearch()}
                disabled={loadingSearch}
                className="px-6 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-500 transition-all text-sm flex items-center justify-center gap-2 active:scale-95"
              >
                {loadingSearch ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Search'}
              </button>
            </div>

            <div className="md:col-span-4 w-full">
              <button
                onClick={scanning ? stopScanner : startScanner}
                className={`w-full py-3 px-4 rounded-xl border font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                  scanning
                    ? 'border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                    : 'border-white/10 text-white hover:bg-white/5'
                }`}
              >
                <Camera className="h-4.5 w-4.5" />
                {scanning ? 'Cancel Scan' : 'Scan Card QR'}
              </button>
            </div>
          </div>

          {/* QR Code Reader Box */}
          <AnimatePresence>
            {scanning && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full max-w-md mx-auto p-4 rounded-2xl glass border border-white/10 flex flex-col items-center gap-3 overflow-hidden shadow-2xl relative"
              >
                <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary-500/15 border border-primary-500/25 text-[10px] font-bold text-primary-400">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse" /> Live Camera Scanner
                </div>
                <div id="reader" className="w-full bg-slate-900 overflow-hidden rounded-xl border border-white/5 mt-4" style={{ minHeight: '300px' }} />
                <p className="text-xs text-slate-400 text-center">Place the QR code of the Patient Health Card in front of the lens.</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search Result display */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex gap-3 items-center"
              >
                <ShieldAlert className="h-5 w-5 shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {patientData && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid lg:grid-cols-12 gap-8 mt-4"
            >
              {/* Patient Meta / Details Column */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                
                {/* Profile Details */}
                <div className="p-6 rounded-2xl glass border border-white/10 shadow-lg relative overflow-hidden">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-primary-400 block mb-1">PATIENT DOSSIER</span>
                  <h3 className="text-xl font-bold text-white mb-4 uppercase">{patientData.profile.user?.name || 'NAME REDACTED'}</h3>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-500 uppercase tracking-wider block text-[9px]">Health ID</span>
                      <span className="font-bold text-white font-mono">{patientData.profile.healthId}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 uppercase tracking-wider block text-[9px]">Age / DOB</span>
                      <span className="font-semibold text-slate-200">
                        {calculateAge(patientData.profile.dob)} Yrs ({new Date(patientData.profile.dob).toLocaleDateString()})
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 uppercase tracking-wider block text-[9px]">Blood Group</span>
                      <span className="font-bold text-white">{patientData.profile.bloodGroup}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 uppercase tracking-wider block text-[9px]">Gender</span>
                      <span className="font-semibold text-slate-200">{patientData.profile.gender}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4 mt-4 text-xs">
                    <div>
                      <span className="text-slate-500 uppercase tracking-wider block text-[9px]">Weight</span>
                      <span className="font-semibold text-slate-200">{patientData.profile.weight} kg</span>
                    </div>
                    <div>
                      <span className="text-slate-500 uppercase tracking-wider block text-[9px]">Height</span>
                      <span className="font-semibold text-slate-200">{patientData.profile.height} cm</span>
                    </div>
                  </div>
                </div>

                {/* Chronic & Allergies Summary */}
                <div className="p-6 rounded-2xl glass border border-white/10">
                  <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-3">Allergies & Diseases</h4>
                  <div className="flex flex-col gap-4 text-xs text-left">
                    <div>
                      <span className="text-slate-500 uppercase tracking-wider block text-[9px] mb-1">Allergies</span>
                      <div className="flex flex-wrap gap-1">
                        {patientData.profile.allergies?.length > 0 ? (
                          patientData.profile.allergies.map((a: string) => (
                            <span key={a} className="px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 font-semibold">{a}</span>
                          ))
                        ) : (
                          <span className="text-slate-400">None Declared</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500 uppercase tracking-wider block text-[9px] mb-1">Chronic Diseases</span>
                      <div className="flex flex-wrap gap-1">
                        {patientData.profile.chronicDiseases?.length > 0 ? (
                          patientData.profile.chronicDiseases.map((d: string) => (
                            <span key={d} className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold">{d}</span>
                          ))
                        ) : (
                          <span className="text-slate-400">None Declared</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                {patientData.emergencyContact && (
                  <div className="p-5 rounded-2xl bg-slate-800/20 border border-white/5 text-xs text-left flex gap-3.5 items-start">
                    <ShieldAlert className="h-5 w-5 text-rose-400 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase mb-1">Emergency contact</h4>
                      <p className="text-slate-400 m-0">
                        <strong>Name:</strong> {patientData.emergencyContact.name} ({patientData.emergencyContact.relationship})<br />
                        <strong>Phone:</strong> {patientData.emergencyContact.phone}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Prescribe / Write Section & History Column */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                
                {/* Form to Prescribe */}
                <div className="p-6 rounded-2xl glass border border-white/10 shadow-lg relative">
                  <h4 className="text-sm font-bold text-white mb-4">Add Prescription / Diagnosis</h4>

                  <AnimatePresence>
                    {successMsg && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-4 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-xs flex gap-2.5 items-center"
                      >
                        <CheckCircle className="h-4.5 w-4.5" />
                        <span>{successMsg}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form onSubmit={handlePrescribe} className="flex flex-col gap-4 text-left">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-semibold text-slate-400">Diagnosis / Chronic Condition</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Type-2 Diabetes / Hypertensive Urgency"
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                        className="py-2.5 px-3 rounded-xl glass-input text-xs"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-semibold text-slate-400">Medications List</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. Metformin 500mg (1-0-1)"
                          value={medInput}
                          onChange={(e) => setMedInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addMed())}
                          className="flex-1 py-2 px-3 rounded-xl glass-input text-xs"
                        />
                        <button
                          type="button"
                          onClick={addMed}
                          className="px-3 bg-slate-800 text-white rounded-xl text-xs hover:bg-slate-700 font-semibold"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {medicationsList.map(med => (
                          <span key={med} className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 text-xs text-white">
                            {med}
                            <button type="button" onClick={() => removeMed(med)} className="text-[10px] text-slate-400 hover:text-white">✕</button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-semibold text-slate-400">Clinical Notes / Instructions</label>
                      <textarea
                        rows={3}
                        placeholder="e.g. Avoid sugar, take medicines after meal, repeat blood check in 30 days."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="py-2.5 px-3 rounded-xl glass-input text-xs"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loadingPrescribe}
                      className="py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 mt-2"
                    >
                      {loadingPrescribe ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Submit Medical Update'}
                    </button>
                  </form>
                </div>

                {/* Patient Prescription History Timeline */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-sm font-bold text-white border-b border-white/5 pb-2 m-0">Recent Prescription Entries</h4>
                  {patientData.prescriptions?.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No prescription records found for this patient.</p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {patientData.prescriptions.map((pr: any) => (
                        <div key={pr._id} className="p-4 rounded-xl glass border border-white/5 text-left text-xs">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-white">Dr. {pr.doctorName}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{new Date(pr.date).toLocaleDateString()}</span>
                          </div>
                          <p className="m-0"><strong className="text-primary-400">Diagnosis:</strong> {pr.diagnosis}</p>
                          <p className="mt-1 mb-0"><strong className="text-teal-400">Meds:</strong> {pr.medications.join(', ')}</p>
                          {pr.notes && <p className="mt-1 mb-0 text-slate-400 italic font-sans">Notes: {pr.notes}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          )}

        </div>
      </main>
    </div>
  );
};
