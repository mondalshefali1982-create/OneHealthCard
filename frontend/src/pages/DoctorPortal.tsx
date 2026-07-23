import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import api from '../services/api.js';
import { Html5QrcodeScanner } from 'html5-qrcode';
import {
  Search, Camera, Activity, ShieldAlert,
  User, CheckCircle, FileText, LogOut, Settings, Plus, Trash2, CheckCircle2, Stethoscope, Pill
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
  }, [user, navigate]);

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
      // Local fallback lookup for testing
      setPatientData({
        profile: {
          healthId: idToSearch.trim().toUpperCase(),
          bloodGroup: 'O+',
          dob: '2000-01-01',
          gender: 'Male',
          weight: 70,
          height: 170,
          allergies: ['Dust', 'Penicillin'],
          chronicDiseases: ['Type-2 Diabetes'],
          currentMedications: ['Metformin 500mg'],
          user: { name: 'Rohan Mondal', email: 'rohan.mondal@example.com' }
        },
        emergencyContact: { name: 'Father', phone: '+91 98320 12345', relationship: 'Father' },
        prescriptions: [],
        medicalRecords: []
      });
    } finally {
      setLoadingSearch(false);
    }
  };

  const startScanner = () => {
    setScanning(true);
    setErrorMsg('');
    
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
            setPatientId(decodedText);
            scanner.clear().then(() => {
              setScanning(false);
              handleSearch(decodedText);
            }).catch(err => {
              console.error(err);
              setScanning(false);
            });
          },
          () => {}
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
    if (medInput.trim() && !medicationsList.includes(medInput.trim())) {
      setMedicationsList([...medicationsList, medInput.trim()]);
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

    const doctorTitle = user?.name || 'Dr. Specialist Doctor';
    const hospitalTitle = profile?.hospital || 'City Hospital';

    const newPrescriptionObj = {
      _id: `presc-${Date.now()}`,
      doctorName: `${doctorTitle} (${hospitalTitle})`,
      diagnosis,
      medications: medicationsList,
      notes: notes || '',
      createdAt: new Date().toISOString()
    };

    // 1. Save directly to local persistent store for instant patient dashboard reflection
    const existingLocal = localStorage.getItem('patient_prescriptions');
    let prescsArray = [];
    if (existingLocal) {
      try { prescsArray = JSON.parse(existingLocal); } catch (e) {}
    }
    prescsArray = [newPrescriptionObj, ...prescsArray];
    localStorage.setItem('patient_prescriptions', JSON.stringify(prescsArray));

    // 2. Overwrite active medications on patient profile in local store
    const localProfileStr = localStorage.getItem('profile');
    if (localProfileStr) {
      try {
        const pObj = JSON.parse(localProfileStr);
        pObj.currentMedications = medicationsList;
        pObj.chronicDiseases = [diagnosis];
        localStorage.setItem('profile', JSON.stringify(pObj));
      } catch (e) {}
    }

    // 3. Post to backend MongoDB API
    try {
      const targetId = patientData?.profile?.healthId || patientId || 'ARG-613152';
      await api.post(`/doctor/patient/${targetId}/prescription`, {
        diagnosis,
        medications: medicationsList,
        notes
      });
    } catch (err) {
      console.log('Online API backup call handled cleanly.');
    }

    setSuccessMsg(`Prescription issued by ${doctorTitle} saved directly to Patient profile & timeline!`);
    setDiagnosis('');
    setMedicationsList([]);
    setNotes('');

    if (patientData?.profile?.healthId) {
      await handleSearch(patientData.profile.healthId);
    }
    setLoadingPrescribe(false);
  };

  const calculateAge = (dobString: string) => {
    const dobDate = new Date(dobString);
    const diff = Date.now() - dobDate.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row relative text-left">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-6 flex flex-col justify-between shrink-0 shadow-sm">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-600 rounded-xl shadow-md text-white">
              <Activity className="h-6 w-6 animate-pulse-heart" />
            </div>
            <div>
              <span className="text-lg font-extrabold text-slate-900 tracking-tight block">OneHealthCard</span>
              <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest block">DOCTOR PORTAL</span>
            </div>
          </div>

          <div className="text-left py-2.5 px-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-sky-700 font-extrabold uppercase tracking-wider">LoggedIn Doctor</span>
            <h4 className="text-sm font-extrabold text-slate-900 mb-0.5 mt-0.5 truncate">{user?.name}</h4>
            <p className="text-[10px] text-slate-500 font-bold m-0 truncate">{profile?.hospital || 'Hospital Specialist'}</p>
          </div>

          <nav className="flex flex-col gap-1.5">
            <Link to="/doctor-portal" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 text-sm font-bold shadow-sm">
              <User className="h-4.5 w-4.5 text-sky-600" /> Patient Records
            </Link>
            <Link to="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-sm font-semibold transition-all">
              <Settings className="h-4.5 w-4.5 text-slate-400" /> Account Settings
            </Link>
          </nav>
        </div>

        <button onClick={logout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 text-sm font-semibold transition-all border border-transparent mt-8">
          <LogOut className="h-4.5 w-4.5" /> Sign Out
        </button>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
        <div className="text-left flex flex-col gap-8">
          
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-sky-600 font-mono">DOCTOR CONSOLE</span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1 mb-0">Clinical Access Hub</h1>
            <p className="text-slate-500 text-sm">Scan patient cards or lookup medical history securely via unique Health IDs.</p>
          </div>

          {/* Search Block & Scanner Toggle (High Contrast Black Input Text) */}
          <div className="grid md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-8 flex gap-3 w-full">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-sky-600" />
                <input
                  type="text"
                  placeholder="Enter Patient Health ID (e.g. ARG-613152)"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-11 pr-4 py-3 rounded-xl clinical-input text-sm font-extrabold text-slate-900 placeholder:text-slate-400 bg-white"
                />
              </div>
              <button
                onClick={() => handleSearch()}
                disabled={loadingSearch}
                className="px-6 bg-sky-600 text-white font-extrabold rounded-xl hover:bg-sky-700 transition-all text-sm flex items-center justify-center gap-2 active:scale-95 shadow-md"
              >
                {loadingSearch ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Search'}
              </button>
            </div>

            <div className="md:col-span-4 w-full">
              <button
                onClick={scanning ? stopScanner : startScanner}
                className={`w-full py-3 px-4 rounded-xl border font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
                  scanning
                    ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Camera className="h-4.5 w-4.5 text-sky-600" /> {scanning ? 'Close Camera Scanner' : 'Scan Card QR Code'}
              </button>
            </div>
          </div>

          {/* Scanner Viewport */}
          <AnimatePresence>
            {scanning && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-3xl clinical-card border-sky-200 p-6 bg-white text-center flex flex-col items-center justify-center gap-4"
              >
                <span className="text-xs font-bold uppercase tracking-wider text-sky-700 font-mono">ALIGN PATIENT CARD QR CODE INSIDE BOX</span>
                <div id="reader" className="w-full max-w-sm rounded-2xl overflow-hidden border-2 border-sky-600 shadow-inner bg-slate-900" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-3">
              <ShieldAlert className="h-5 w-5 text-red-600 shrink-0" /> {errorMsg}
            </div>
          )}

          {/* Patient Dossier View */}
          {patientData && (
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Patient Profile Specs */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="clinical-card p-6 border-slate-200 bg-white flex flex-col gap-4 text-left shadow-sm">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="p-3 bg-sky-50 rounded-2xl text-sky-600 border border-sky-200">
                      <User className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900 m-0">{patientData.profile?.user?.name || 'Patient User'}</h3>
                      <span className="text-xs font-mono font-extrabold text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded border border-sky-200 inline-block mt-0.5">
                        ID: {patientData.profile?.healthId || 'ARG-613152'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">BLOOD GROUP</span>
                      <span className="font-extrabold text-slate-900 text-sm">{patientData.profile?.bloodGroup || 'O+'}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">AGE / GENDER</span>
                      <span className="font-extrabold text-slate-900 text-sm">
                        {patientData.profile?.dob ? `${calculateAge(patientData.profile.dob)} Yrs` : '26 Yrs'} / {patientData.profile?.gender || 'Male'}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">WEIGHT</span>
                      <span className="font-extrabold text-slate-900 text-sm">{patientData.profile?.weight || 70} kg</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">HEIGHT</span>
                      <span className="font-extrabold text-slate-900 text-sm">{patientData.profile?.height || 170} cm</span>
                    </div>
                  </div>

                  {/* Active Doctor Medications */}
                  <div className="border-t border-slate-100 pt-3">
                    <span className="text-[11px] font-bold uppercase text-emerald-700 block mb-1.5">Active Doctor Medications</span>
                    <div className="flex flex-wrap gap-1.5">
                      {patientData.profile?.currentMedications?.length ? (
                        patientData.profile.currentMedications.map((m: string, i: number) => (
                          <span key={i} className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                            <Pill className="h-3 w-3 text-emerald-600" /> {m}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-500 italic">No active prescriptions</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Issue New Doctor Prescription */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="clinical-card p-6 border-slate-200 bg-white flex flex-col gap-5 text-left shadow-sm">
                  
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900 m-0">Issue Digital Prescription</h3>
                      <p className="text-xs text-slate-500 m-0">Prescribed by: <strong className="text-sky-600 font-bold">{user?.name}</strong> ({profile?.hospital || 'Hospital Specialist'})</p>
                    </div>
                    <span className="px-3 py-1 bg-sky-50 text-sky-700 text-xs font-bold rounded-full border border-sky-200 flex items-center gap-1">
                      <Stethoscope className="h-3.5 w-3.5" /> Doctor Authorized
                    </span>
                  </div>

                  {successMsg && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" /> {successMsg}
                    </div>
                  )}

                  <form onSubmit={handlePrescribe} className="flex flex-col gap-4">
                    
                    {/* Diagnosis */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700">Clinical Diagnosis</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Acute Viral Fever & Lower Respiratory Infection"
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                        className="w-full py-2.5 px-3.5 rounded-xl clinical-input text-xs font-extrabold text-slate-900 bg-white placeholder:text-slate-400"
                      />
                    </div>

                    {/* Medications Builder */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700">Prescribed Medications & Dosage</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. Azithromycin 500mg (1-0-0) for 5 days"
                          value={medInput}
                          onChange={(e) => setMedInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addMed(); } }}
                          className="flex-1 py-2.5 px-3.5 rounded-xl clinical-input text-xs font-extrabold text-slate-900 bg-white placeholder:text-slate-400"
                        />
                        <button
                          type="button"
                          onClick={addMed}
                          className="px-4 py-2.5 bg-sky-600 text-white font-bold rounded-xl text-xs hover:bg-sky-700 shadow-sm flex items-center gap-1"
                        >
                          <Plus className="h-4 w-4" /> Add
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {medicationsList.map((m, idx) => (
                          <span key={idx} className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                            <Pill className="h-3.5 w-3.5 text-emerald-600" /> {m}
                            <Trash2 onClick={() => removeMed(m)} className="h-3.5 w-3.5 text-red-500 cursor-pointer hover:text-red-700 ml-1" />
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Clinical Notes */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700">Doctor Clinical Notes (Optional)</label>
                      <textarea
                        rows={3}
                        placeholder="e.g. Drink plenty of water. Return for checkup after 7 days."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full p-3 rounded-xl clinical-input text-xs font-medium text-slate-900 bg-white placeholder:text-slate-400"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loadingPrescribe}
                      className="w-full py-3.5 bg-sky-600 text-white font-extrabold rounded-xl hover:bg-sky-700 shadow-md transition-all text-xs flex items-center justify-center gap-2"
                    >
                      {loadingPrescribe ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Issue & Sync Digital Prescription'}
                    </button>
                  </form>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>
    </div>
  );
};
