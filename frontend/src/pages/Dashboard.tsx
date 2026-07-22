import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import api from '../services/api.js';
import {
  CreditCard, Activity, Heart, Shield, QrCode, RotateCw, Download, Edit3,
  Search, FileText, Settings, LogOut, Phone, AlertCircle, Plus, Trash2, Calendar,
  UserCheck, Pill, Stethoscope, Sparkles, CheckCircle2, Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const Dashboard: React.FC = () => {
  const { user, profile, emergencyContact, logout, refreshProfile } = useAuth();

  // 3D Card flip state
  const [isFlipped, setIsFlipped] = useState(false);

  // Timeline / Prescriptions state
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loadingTimeline, setLoadingTimeline] = useState(true);

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editBloodGroup, setEditBloodGroup] = useState(profile?.bloodGroup || 'O+');
  const [editWeight, setEditWeight] = useState(profile?.weight || 70);
  const [editHeight, setEditHeight] = useState(profile?.height || 170);
  const [allergiesList, setAllergiesList] = useState<string[]>(profile?.allergies || []);
  const [newAllergy, setNewAllergy] = useState('');
  const [chronicDiseasesList, setChronicDiseasesList] = useState<string[]>(profile?.chronicDiseases || []);
  const [newChronic, setNewChronic] = useState('');
  const [currentMedicationsList, setCurrentMedicationsList] = useState<string[]>(profile?.currentMedications || []);
  const [newMedication, setNewMedication] = useState('');

  // Emergency contact fields
  const [emName, setEmName] = useState(emergencyContact?.name || '');
  const [emPhone, setEmPhone] = useState(emergencyContact?.phone || '');
  const [emRelation, setEmRelation] = useState(emergencyContact?.relationship || '');

  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Sync edit form fields when profile state updates
  useEffect(() => {
    if (profile) {
      setEditBloodGroup(profile.bloodGroup || 'O+');
      setEditWeight(profile.weight || 70);
      setEditHeight(profile.height || 170);
      setAllergiesList(profile.allergies || []);
      setChronicDiseasesList(profile.chronicDiseases || []);
      setCurrentMedicationsList(profile.currentMedications || []);
    }
    if (emergencyContact) {
      setEmName(emergencyContact.name || '');
      setEmPhone(emergencyContact.phone || '');
      setEmRelation(emergencyContact.relationship || '');
    }
  }, [profile, emergencyContact]);

  // Fetch Prescriptions / Medical Timeline
  const fetchTimeline = async () => {
    setLoadingTimeline(true);
    try {
      const response = await api.get('/patient/prescriptions');
      setPrescriptions(response.data);
    } catch (err) {
      console.error('Failed to load prescriptions timeline:', err);
    } finally {
      setLoadingTimeline(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchTimeline();
    }
  }, [user?.id]);

  // Save Card & Profile updates
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setSaveSuccessMsg('');
    try {
      await api.put('/patient/profile', {
        bloodGroup: editBloodGroup,
        weight: editWeight,
        height: editHeight,
        allergies: allergiesList,
        chronicDiseases: chronicDiseasesList,
        currentMedications: currentMedicationsList,
        emergencyContact: {
          name: emName,
          phone: emPhone,
          relationship: emRelation,
        }
      });
      await refreshProfile();
      setSaveSuccessMsg('Card details synchronized with MongoDB successfully!');
      setTimeout(() => {
        setShowEditModal(false);
        setSaveSuccessMsg('');
      }, 1200);
    } catch (err: any) {
      console.error('Failed to update profile:', err);
    } finally {
      setSaveLoading(false);
    }
  };

  // Tag helper functions
  const addAllergy = () => {
    if (newAllergy.trim() && !allergiesList.includes(newAllergy.trim())) {
      setAllergiesList([...allergiesList, newAllergy.trim()]);
      setNewAllergy('');
    }
  };
  const removeAllergy = (tag: string) => {
    setAllergiesList(allergiesList.filter(t => t !== tag));
  };

  const addChronic = () => {
    if (newChronic.trim() && !chronicDiseasesList.includes(newChronic.trim())) {
      setChronicDiseasesList([...chronicDiseasesList, newChronic.trim()]);
      setNewChronic('');
    }
  };
  const removeChronic = (tag: string) => {
    setChronicDiseasesList(chronicDiseasesList.filter(t => t !== tag));
  };

  const addMedication = () => {
    if (newMedication.trim() && !currentMedicationsList.includes(newMedication.trim())) {
      setCurrentMedicationsList([...currentMedicationsList, newMedication.trim()]);
      setNewMedication('');
    }
  };
  const removeMedication = (tag: string) => {
    setCurrentMedicationsList(currentMedicationsList.filter(t => t !== tag));
  };

  return (
    <div className="min-h-screen bg-[#070b14] flex flex-col md:flex-row relative text-left">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900/90 border-r border-white/10 p-6 flex flex-col justify-between shrink-0 glass">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-cyan-500 to-emerald-400 rounded-xl shadow-lg shadow-cyan-500/20">
              <Activity className="h-6 w-6 text-white animate-pulse-heart" />
            </div>
            <span className="text-lg font-extrabold text-white tracking-tight">OneHealthCard</span>
          </div>

          <nav className="flex flex-col gap-1.5">
            <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-sm font-bold shadow-md">
              <CreditCard className="h-4.5 w-4.5" /> My Health Card
            </Link>
            <Link to="/doctor-finder" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 text-sm font-semibold transition-all">
              <Search className="h-4.5 w-4.5" /> Find Doctors
            </Link>
            <Link to="/report-scanner" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 text-sm font-semibold transition-all">
              <FileText className="h-4.5 w-4.5" /> AI Report Scanner
            </Link>
            <Link to="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 text-sm font-semibold transition-all">
              <Settings className="h-4.5 w-4.5" /> Account Settings
            </Link>
          </nav>
        </div>

        <button onClick={logout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 text-sm font-semibold transition-all border border-transparent mt-8">
          <LogOut className="h-4.5 w-4.5" /> Sign Out
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
        <div className="flex flex-col gap-8">
          
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-widest text-cyan-400 font-mono">PATIENT HEALTH PORTAL</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> MongoDB Synced
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-white mt-1 mb-0">Welcome, {user?.name}</h1>
              <p className="text-slate-400 text-sm mt-1">Universal Health Passport ID: <strong className="text-cyan-400 font-mono">OHC-{user?.id?.slice(-6)?.toUpperCase()}</strong></p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowEditModal(true)}
                className="px-4 py-2.5 bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-bold rounded-xl hover:bg-cyan-500/25 transition-all text-xs flex items-center gap-2"
              >
                <Edit3 className="h-4 w-4" /> Edit Health Info
              </button>
            </div>
          </div>

          {/* Core Grid: 3D Digital Card & Timeline */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: 3D Card & Vitals */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* 3D Card Header Controls */}
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-cyan-400" /> Interactive Digital Card
                </span>
                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/20 transition-all"
                >
                  <RotateCw className="h-3.5 w-3.5" /> Flip Card ({isFlipped ? 'Show Front' : 'Show Back'})
                </button>
              </div>

              {/* 3D Flippable Digital Card */}
              <div className="w-full h-[260px] perspective-1000">
                <motion.div
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.7, ease: 'easeInOut' }}
                  className="w-full h-full preserve-3d relative cursor-pointer shadow-2xl rounded-2xl"
                  onClick={() => setIsFlipped(!isFlipped)}
                >
                  {/* FRONT SIDE */}
                  <div className="absolute inset-0 w-full h-full rounded-2xl glass-card-glow border border-cyan-500/40 p-6 flex flex-col justify-between backface-hidden overflow-hidden text-left bg-slate-900/90">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-cyan-400 animate-pulse" />
                        <span className="text-sm font-extrabold text-white tracking-wide">ONE HEALTH CARD</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold uppercase border border-emerald-500/30">
                        SECURE ID
                      </span>
                    </div>

                    <div className="flex justify-between items-end my-auto">
                      <div className="flex flex-col gap-1">
                        <span className="text-xl font-extrabold text-white tracking-tight uppercase">{user?.name}</span>
                        <span className="text-xs font-mono font-bold text-cyan-400">ARG-{user?.id?.slice(-6)?.toUpperCase()}</span>
                      </div>

                      <div className="p-2 bg-white rounded-xl shadow-lg border border-white shrink-0">
                        <QrCode className="h-16 w-16 text-slate-950" />
                      </div>
                    </div>

                    <div className="flex justify-between items-center border-t border-white/10 pt-3 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">BLOOD GROUP</span>
                        <span className="font-extrabold text-white text-sm">{profile?.bloodGroup || 'O+'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">DOB / AGE</span>
                        <span className="font-extrabold text-white text-sm">{profile?.dob || '2000-01-01'} (26 Yrs)</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">GENDER</span>
                        <span className="font-extrabold text-white text-sm">{profile?.gender || 'Male'}</span>
                      </div>
                    </div>
                  </div>

                  {/* BACK SIDE */}
                  <div className="absolute inset-0 w-full h-full rounded-2xl glass-card-glow border border-emerald-500/40 p-6 flex flex-col justify-between backface-hidden rotate-y-180 overflow-hidden text-left bg-slate-950/95">
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <span className="text-xs font-extrabold text-emerald-400 tracking-wider uppercase">EMERGENCY & MEDICAL SPECS</span>
                      <span className="text-[10px] font-mono text-slate-400">BACK VIEW</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs my-auto">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-rose-400 block mb-1">ALLERGIES</span>
                        <p className="text-white font-medium m-0">{profile?.allergies?.length ? profile.allergies.join(', ') : 'None Reported'}</p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-amber-400 block mb-1">CHRONIC CONDITIONS</span>
                        <p className="text-white font-medium m-0">{profile?.chronicDiseases?.length ? profile.chronicDiseases.join(', ') : 'None Reported'}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">CURRENT MEDICATIONS</span>
                        <p className="text-white font-medium m-0">{profile?.currentMedications?.length ? profile.currentMedications.join(', ') : 'No active prescriptions'}</p>
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-2 text-[11px] flex justify-between items-center text-slate-300">
                      <span>Emergency: <strong className="text-white">{emergencyContact?.name || 'Not Set'}</strong></span>
                      <span className="text-emerald-400 font-bold">{emergencyContact?.phone || ''}</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Action Buttons for Card */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="py-3 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/10 shadow-md"
                >
                  <RotateCw className="h-4 w-4 text-cyan-400" /> Flip Digital Card
                </button>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg hover:opacity-95"
                >
                  <Edit3 className="h-4 w-4" /> Edit Health Info
                </button>
              </div>

              {/* Core Vitals Section */}
              <div className="rounded-2xl glass-card p-6 border border-white/10 text-left">
                <span className="text-xs uppercase font-extrabold tracking-widest text-cyan-400 font-mono mb-4 block">CORE VITAL METRICS</span>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 flex flex-col items-center justify-center gap-1 text-center">
                    <Heart className="h-6 w-6 text-rose-400 animate-pulse-heart" />
                    <span className="text-[10px] uppercase font-bold text-slate-400 mt-1">BLOOD GROUP</span>
                    <span className="text-xl font-extrabold text-white">{profile?.bloodGroup || 'O+'}</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 flex flex-col items-center justify-center gap-1 text-center">
                    <Activity className="h-6 w-6 text-cyan-400" />
                    <span className="text-[10px] uppercase font-bold text-slate-400 mt-1">BODY WEIGHT</span>
                    <span className="text-xl font-extrabold text-white">{profile?.weight || 70} kg</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 flex flex-col items-center justify-center gap-1 text-center">
                    <Shield className="h-6 w-6 text-emerald-400" />
                    <span className="text-[10px] uppercase font-bold text-slate-400 mt-1">BODY HEIGHT</span>
                    <span className="text-xl font-extrabold text-white">{profile?.height || 170} cm</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Medical Record Timeline */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-emerald-400" /> Medical Timeline & Prescriptions
                </span>
                <button onClick={fetchTimeline} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-all">
                  <RotateCw className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="rounded-2xl glass-card p-6 border border-white/10 text-left min-h-[420px] flex flex-col">
                {loadingTimeline ? (
                  <div className="my-auto text-center flex flex-col items-center gap-2 text-slate-400 text-xs">
                    <span className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    <span>Loading medical records...</span>
                  </div>
                ) : prescriptions.length === 0 ? (
                  <div className="my-auto text-center py-12 text-slate-400">
                    <FileText className="h-10 w-10 text-slate-600 mx-auto mb-2" />
                    <p className="text-white font-bold text-sm mb-1">No Prescriptions Yet</p>
                    <p className="text-xs text-slate-500">Doctor consultations & prescribed medications will appear here live.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
                    {prescriptions.map((item, idx) => (
                      <div key={item._id || idx} className="flex gap-4 items-start relative pl-6">
                        <div className="absolute left-1.5 top-1 w-3 h-3 rounded-full bg-cyan-400 glow-primary border-2 border-slate-900 shrink-0" />
                        
                        <div className="flex-1 p-4 rounded-xl bg-slate-950/80 border border-white/10 flex flex-col gap-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-sm font-bold text-white m-0">Prescription Prescribed</h4>
                              <span className="text-xs text-cyan-400 font-semibold">By {item.doctorName || 'Dr. Doctor'}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {new Date(item.createdAt || Date.now()).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="text-xs text-slate-300">
                            <strong>Diagnosis:</strong> {item.diagnosis}
                          </div>

                          {item.medicines?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {item.medicines.map((med: any, mIdx: number) => (
                                <span key={mIdx} className="px-2.5 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold flex items-center gap-1">
                                  <Pill className="h-3 w-3" /> {med.name} ({med.dosage})
                                </span>
                              ))}
                            </div>
                          )}

                          {item.notes && (
                            <p className="text-[11px] text-slate-400 italic m-0 border-t border-white/5 pt-2">
                              Note: {item.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Edit Health Info Modal */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl rounded-3xl glass-card border border-white/15 p-6 md:p-8 overflow-y-auto max-h-[90vh] text-left relative bg-slate-900/95 shadow-2xl"
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white m-0">Edit Digital Health Card</h3>
                  <p className="text-xs text-slate-400 m-0">Update blood group, body vitals, allergies, and emergency contact.</p>
                </div>
                <button onClick={() => setShowEditModal(false)} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {saveSuccessMsg && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> {saveSuccessMsg}
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="flex flex-col gap-6">
                {/* Vitals */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-300">Blood Group</label>
                    <select
                      value={editBloodGroup}
                      onChange={(e) => setEditBloodGroup(e.target.value)}
                      className="py-2.5 px-3 rounded-xl glass-input text-xs font-bold"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                        <option key={bg} value={bg} className="bg-slate-900 text-white">{bg}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-300">Weight (kg)</label>
                    <input
                      type="number"
                      value={editWeight}
                      onChange={(e) => setEditWeight(Number(e.target.value))}
                      className="py-2.5 px-3 rounded-xl glass-input text-xs"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-300">Height (cm)</label>
                    <input
                      type="number"
                      value={editHeight}
                      onChange={(e) => setEditHeight(Number(e.target.value))}
                      className="py-2.5 px-3 rounded-xl glass-input text-xs"
                    />
                  </div>
                </div>

                {/* Allergies Builder */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-rose-400">Known Allergies</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Dust, Penicillin"
                      value={newAllergy}
                      onChange={(e) => setNewAllergy(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addAllergy(); } }}
                      className="flex-1 py-2 px-3 rounded-xl glass-input text-xs"
                    />
                    <button type="button" onClick={addAllergy} className="px-4 py-2 bg-rose-500/20 text-rose-300 font-bold rounded-xl hover:bg-rose-500/30 text-xs">
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {allergiesList.map(tag => (
                      <span key={tag} className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 text-xs flex items-center gap-1 border border-rose-500/30">
                        {tag} <Trash2 onClick={() => removeAllergy(tag)} className="h-3 w-3 cursor-pointer hover:text-white" />
                      </span>
                    ))}
                  </div>
                </div>

                {/* Chronic Diseases Builder */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-amber-400">Chronic Diseases</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Asthma, Diabetes"
                      value={newChronic}
                      onChange={(e) => setNewChronic(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addChronic(); } }}
                      className="flex-1 py-2 px-3 rounded-xl glass-input text-xs"
                    />
                    <button type="button" onClick={addChronic} className="px-4 py-2 bg-amber-500/20 text-amber-300 font-bold rounded-xl hover:bg-amber-500/30 text-xs">
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {chronicDiseasesList.map(tag => (
                      <span key={tag} className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs flex items-center gap-1 border border-amber-500/30">
                        {tag} <Trash2 onClick={() => removeChronic(tag)} className="h-3 w-3 cursor-pointer hover:text-white" />
                      </span>
                    ))}
                  </div>
                </div>

                {/* Current Medications Builder */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-emerald-400">Current Medications</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Paracetamol 500mg, Metformin"
                      value={newMedication}
                      onChange={(e) => setNewMedication(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addMedication(); } }}
                      className="flex-1 py-2 px-3 rounded-xl glass-input text-xs"
                    />
                    <button type="button" onClick={addMedication} className="px-4 py-2 bg-emerald-500/20 text-emerald-300 font-bold rounded-xl hover:bg-emerald-500/30 text-xs">
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {currentMedicationsList.map(tag => (
                      <span key={tag} className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs flex items-center gap-1 border border-emerald-500/30">
                        {tag} <Trash2 onClick={() => removeMedication(tag)} className="h-3 w-3 cursor-pointer hover:text-white" />
                      </span>
                    ))}
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="border-t border-white/10 pt-4 flex flex-col gap-3">
                  <span className="text-xs uppercase font-bold tracking-wider text-cyan-400 font-mono">Emergency Contact Info</span>
                  <div className="grid md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Contact Name"
                      value={emName}
                      onChange={(e) => setEmName(e.target.value)}
                      className="py-2.5 px-3 rounded-xl glass-input text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Phone Number"
                      value={emPhone}
                      onChange={(e) => setEmPhone(e.target.value)}
                      className="py-2.5 px-3 rounded-xl glass-input text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Relationship"
                      value={emRelation}
                      onChange={(e) => setEmRelation(e.target.value)}
                      className="py-2.5 px-3 rounded-xl glass-input text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-5 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saveLoading}
                    className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-extrabold rounded-xl text-xs hover:opacity-95 shadow-lg flex items-center gap-2"
                  >
                    {saveLoading ? <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" /> : 'Save & Sync Card'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
