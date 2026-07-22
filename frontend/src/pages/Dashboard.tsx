import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import api from '../services/api.js';
import QRCode from 'qrcode';
import {
  CreditCard, Activity, Calendar, Download, RefreshCw,
  Plus, Edit, Search, User, ShieldAlert, Heart, CalendarRange,
  Scale, FileText, ChevronRight, LogOut, Settings, PlusCircle
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const Dashboard: React.FC = () => {
  const { user, profile, emergencyContact, logout, refreshProfile } = useAuth();
  const navigate = useNavigate();
  
  // Dashboard states
  const [timeline, setTimeline] = useState<any[]>([]);
  const [recentPrescriptions, setRecentPrescriptions] = useState<any[]>([]);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Edit Form Fields
  const [editWeight, setEditWeight] = useState(profile?.weight || 70);
  const [editHeight, setEditHeight] = useState(profile?.height || 170);
  const [editAllergies, setEditAllergies] = useState<string[]>(profile?.allergies || []);
  const [editDiseases, setEditDiseases] = useState<string[]>(profile?.chronicDiseases || []);
  const [editMeds, setEditMeds] = useState<string[]>(profile?.currentMedications || []);
  
  const [allergyInput, setAllergyInput] = useState('');
  const [diseaseInput, setDiseaseInput] = useState('');
  const [medInput, setMedInput] = useState('');

  const [emergencyName, setEmergencyName] = useState(emergencyContact?.name || '');
  const [emergencyPhone, setEmergencyPhone] = useState(emergencyContact?.phone || '');
  const [emergencyRelation, setEmergencyRelation] = useState(emergencyContact?.relationship || '');

  // References for QR code and 3D card
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const backQrCanvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Sync form inputs whenever profile, emergencyContact, or modal open state changes
  useEffect(() => {
    if (profile) {
      setEditWeight(profile.weight || 70);
      setEditHeight(profile.height || 170);
      setEditAllergies(profile.allergies || []);
      setEditDiseases(profile.chronicDiseases || []);
      setEditMeds(profile.currentMedications || []);
    }
    if (emergencyContact) {
      setEmergencyName(emergencyContact.name || '');
      setEmergencyPhone(emergencyContact.phone || '');
      setEmergencyRelation(emergencyContact.relationship || '');
    }
  }, [profile, emergencyContact, showEditModal]);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (user.role === 'doctor') {
      navigate('/doctor-portal');
      return;
    }

    loadDashboardData();
  }, [user?.id]);

  // Generate QR Code on canvas
  useEffect(() => {
    if (profile?.healthId) {
      if (qrCanvasRef.current) {
        QRCode.toCanvas(qrCanvasRef.current, profile.healthId, {
          width: 80,
          margin: 1,
          color: {
            dark: '#0f172a',
            light: '#ffffff'
          }
        }).catch(err => console.error(err));
      }
      if (backQrCanvasRef.current) {
        QRCode.toCanvas(backQrCanvasRef.current, profile.healthId, {
          width: 70,
          margin: 1,
          color: {
            dark: '#0f172a',
            light: '#ffffff'
          }
        }).catch(err => console.error(err));
      }
    }
  }, [profile, cardFlipped]);

  const loadDashboardData = async () => {
    setLoadingDashboard(true);
    try {
      const timelineRes = await api.get('/patient/timeline');
      setTimeline(timelineRes.data);

      const dashRes = await api.get('/patient/dashboard');
      setRecentPrescriptions(dashRes.data.prescriptions || []);
    } catch (error) {
      console.error('Failed to load patient dashboard:', error);
    } finally {
      setLoadingDashboard(false);
    }
  };

  const handleDownloadCard = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 350;
    const ctx = canvas.getContext('2d');
    
    if (ctx && profile) {
      const gradient = ctx.createLinearGradient(0, 0, 600, 350);
      gradient.addColorStop(0, '#0f172a');
      gradient.addColorStop(1, '#1e293b');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 600, 350);

      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 4;
      ctx.strokeRect(10, 10, 580, 330);

      ctx.fillStyle = '#06b6d4';
      ctx.font = 'bold 24px Arial';
      ctx.fillText('ONE HEALTH CARD', 30, 50);

      ctx.fillStyle = '#10b981';
      ctx.font = '12px Arial';
      ctx.fillText('SECURE MEDICAL IDENTITY', 30, 70);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px Arial';
      ctx.fillText(user?.name.toUpperCase() || 'PATIENT NAME', 30, 150);

      ctx.fillStyle = '#06b6d4';
      ctx.font = 'bold 18px Courier';
      ctx.fillText(`HEALTH ID: ${profile.healthId}`, 30, 185);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px Arial';
      ctx.fillText('BLOOD GROUP', 30, 240);
      ctx.fillText('DOB', 180, 240);
      ctx.fillText('GENDER', 300, 240);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(profile.bloodGroup, 30, 265);
      ctx.fillText(new Date(profile.dob).toLocaleDateString(), 180, 265);
      ctx.fillText(profile.gender, 300, 265);

      if (qrCanvasRef.current) {
        ctx.drawImage(qrCanvasRef.current, 450, 40, 120, 120);
      }

      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `OneHealthCard_${profile.healthId}.png`;
      link.href = url;
      link.click();
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/patient/profile', {
        weight: editWeight,
        height: editHeight,
        allergies: editAllergies,
        chronicDiseases: editDiseases,
        currentMedications: editMeds,
        emergencyContact: {
          name: emergencyName,
          phone: emergencyPhone,
          relationship: emergencyRelation
        }
      });
      
      // Refresh AuthContext profile and emergencyContact to sync immediately with MongoDB
      await refreshProfile();
      await loadDashboardData();
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
      alert('Failed to save profile to MongoDB. Please review fields.');
    }
  };

  const addAllergy = () => {
    if (allergyInput && !editAllergies.includes(allergyInput)) {
      setEditAllergies([...editAllergies, allergyInput]);
      setAllergyInput('');
    }
  };

  const addDisease = () => {
    if (diseaseInput && !editDiseases.includes(diseaseInput)) {
      setEditDiseases([...editDiseases, diseaseInput]);
      setDiseaseInput('');
    }
  };

  const addMed = () => {
    if (medInput && !editMeds.includes(medInput)) {
      setEditMeds([...editMeds, medInput]);
      setMedInput('');
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

          <nav className="flex flex-col gap-1">
            <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-semibold transition-all">
              <CreditCard className="h-4 w-4" /> My Health Card
            </Link>
            <Link to="/doctor-finder" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 text-sm font-semibold transition-all">
              <Search className="h-4 w-4" /> Find Doctors
            </Link>
            <Link to="/report-scanner" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 text-sm font-semibold transition-all">
              <FileText className="h-4 w-4" /> AI Report Scanner
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
        {loadingDashboard ? (
          <div className="h-[60vh] flex items-center justify-center flex-col gap-4">
            <span className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Compiling medical card history...</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8 text-left">
            
            {/* Left Column: Greeting, Stats & Card */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-primary-400">PATIENT HUB</span>
                <h1 className="text-3xl font-extrabold text-white mt-1 mb-0">Welcome, {user?.name}</h1>
                <p className="text-slate-400 text-sm">Your medical data is encrypted and synced with MongoDB.</p>
              </div>

              {/* 3D Flipping Card Container */}
              <div className="perspective-1000 w-full max-w-[420px] aspect-[1.7/1] relative select-none">
                <div
                  ref={cardRef}
                  onClick={() => setCardFlipped(!cardFlipped)}
                  className={`w-full h-full rounded-2xl preserve-3d transition-transform duration-700 cursor-pointer relative shadow-2xl ${
                    cardFlipped ? 'rotate-y-180' : ''
                  }`}
                >
                  {/* Card Front Side */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-primary-600 to-teal-500 p-[1px] backface-hidden">
                    <div className="w-full h-full rounded-2xl bg-slate-900/95 p-5 flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(6,182,212,0.1),transparent_50%)] pointer-events-none" />
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Activity className="h-5 w-5 text-primary-400 animate-pulse" />
                          <span className="text-xs font-bold tracking-wider text-slate-300">ONE HEALTH CARD</span>
                        </div>
                        <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">Secure ID</span>
                      </div>

                      <div className="flex gap-4 items-center mt-3">
                        <div className="w-12 h-12 bg-slate-800 border border-white/10 rounded-xl flex items-center justify-center text-primary-400 font-bold text-lg">
                          {user?.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white mb-0.5 uppercase">{user?.name}</h3>
                          <p className="text-xs font-mono text-primary-400 m-0">{profile?.healthId}</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-end border-t border-white/5 pt-3 mt-2">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-slate-500 block">Blood Group</span>
                          <span className="text-xs font-bold text-white">{profile?.bloodGroup || 'O+'}</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-slate-500 block">DOB / Age</span>
                          <span className="text-xs font-bold text-white">
                            {profile?.dob ? new Date(profile.dob).toLocaleDateString() : 'N/A'} ({profile?.dob ? calculateAge(profile.dob) : 0} Yrs)
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-slate-500 block">Gender</span>
                          <span className="text-xs font-bold text-white">{profile?.gender || 'Male'}</span>
                        </div>
                        <canvas ref={qrCanvasRef} className="hidden" />
                        <div className="w-14 h-14 bg-white p-1 rounded-lg shadow-md shrink-0 flex items-center justify-center">
                          <img
                            src={profile?.healthId ? `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${profile.healthId}` : ''}
                            alt="QR"
                            className="w-12 h-12"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Back Side */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-teal-600 to-primary-700 p-[1px] backface-hidden rotate-y-180">
                    <div className="w-full h-full rounded-2xl bg-slate-900/95 p-5 flex flex-col justify-between relative overflow-hidden">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-xs font-semibold text-primary-400">EMERGENCY INFO & ALLERGIES</span>
                        <span className="text-[9px] font-mono text-slate-500">{profile?.healthId}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs my-2">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-slate-500 block">Chronic Conditions</span>
                          <p className="font-semibold text-white truncate m-0">
                            {profile?.chronicDiseases?.length > 0 ? profile.chronicDiseases.join(', ') : 'None Declared'}
                          </p>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-slate-500 block">Allergies</span>
                          <p className="font-semibold text-white truncate m-0">
                            {profile?.allergies?.length > 0 ? profile.allergies.join(', ') : 'None Declared'}
                          </p>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-slate-500 block">Current Medications</span>
                          <p className="font-semibold text-slate-300 truncate m-0">
                            {profile?.currentMedications?.length > 0 ? profile.currentMedications.join(', ') : 'None'}
                          </p>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-slate-500 block">Emergency Contact</span>
                          <p className="font-semibold text-rose-400 m-0">
                            {emergencyContact?.name ? `${emergencyContact.name} (${emergencyContact.phone})` : 'None Provided'}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center border-t border-white/5 pt-2 text-[9px] text-slate-500 font-mono">
                        <span>Scan card front to view clinical verification records.</span>
                        <canvas ref={backQrCanvasRef} className="hidden" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="flex gap-4">
                <button
                  onClick={handleDownloadCard}
                  className="flex-1 py-3 px-4 rounded-xl border border-white/10 text-white font-semibold hover:bg-white/5 transition-all text-sm flex items-center justify-center gap-2 active:scale-95"
                >
                  <Download className="h-4 w-4" /> Download Card
                </button>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="flex-1 py-3 px-4 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-500 transition-all text-sm flex items-center justify-center gap-2 active:scale-95"
                >
                  <Edit className="h-4 w-4" /> Edit Card Info
                </button>
              </div>

              {/* Core Health Vitals Panel */}
              <div className="p-5 rounded-2xl glass border border-white/5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Core Vitals</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-white/5 rounded-xl">
                    <Heart className="h-5 w-5 text-rose-400 mx-auto mb-1" />
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Blood Group</span>
                    <span className="text-base font-bold text-white">{profile?.bloodGroup || 'O+'}</span>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl">
                    <Scale className="h-5 w-5 text-teal-400 mx-auto mb-1" />
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Weight</span>
                    <span className="text-base font-bold text-white">{profile?.weight || 0} kg</span>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl">
                    <CalendarRange className="h-5 w-5 text-primary-400 mx-auto mb-1" />
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Height</span>
                    <span className="text-base font-bold text-white">{profile?.height || 0} cm</span>
                  </div>
                </div>
              </div>

              {/* Emergency Panel */}
              <div className="p-5 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-left flex gap-4 items-start">
                <ShieldAlert className="h-6 w-6 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Emergency Contact</h4>
                  {emergencyContact?.name ? (
                    <div className="text-xs text-slate-400 flex flex-col gap-0.5">
                      <span><strong className="text-slate-300">Name:</strong> {emergencyContact.name} ({emergencyContact.relationship})</span>
                      <span><strong className="text-slate-300">Phone:</strong> {emergencyContact.phone}</span>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">No emergency details provided. Click edit card info to save contacts.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Medical Timeline */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h2 className="text-2xl font-bold text-white m-0">Medical Record Timeline</h2>
                <button
                  onClick={loadDashboardData}
                  className="p-2 hover:bg-white/5 rounded-xl text-slate-400 hover:text-white transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>

              {timeline.length === 0 ? (
                <div className="p-12 rounded-2xl glass border border-white/5 text-center flex flex-col items-center gap-4">
                  <Activity className="h-10 w-10 text-slate-600" />
                  <h3 className="text-lg font-bold text-white">Your Medical Timeline is Empty</h3>
                  <p className="text-slate-400 text-sm max-w-sm">
                    No doctor diagnoses, prescriptions, or blood test files have been uploaded yet. Provide your Health ID to your practitioner or scan a report in the AI scanner tab to populate this timeline.
                  </p>
                  <Link
                    to="/report-scanner"
                    className="mt-2 px-4 py-2 text-xs font-semibold bg-primary-600 text-white rounded-xl hover:bg-primary-500 transition-all"
                  >
                    Upload First Report
                  </Link>
                </div>
              ) : (
                <div className="relative pl-6 border-l-2 border-white/10 flex flex-col gap-8 text-left">
                  {timeline.map((event) => (
                    <div key={event.id} className="relative">
                      <span className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 bg-slate-900 ${
                        event.type === 'visit' ? 'border-primary-500' :
                        event.type === 'prescription' ? 'border-emerald-500' : 'border-purple-500'
                      }`} />

                      <div>
                        <span className="text-[10px] font-mono text-slate-500">
                          {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                        <h4 className="text-base font-bold text-white mt-1 mb-0.5">{event.title}</h4>
                        <span className="text-xs text-primary-400/80 font-semibold">{event.subtitle}</span>
                        <p className="text-xs text-slate-400 leading-relaxed mt-2">{event.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mt-3">
                          {event.tags.map((tag: string, tid: number) => (
                            <span key={tid} className="px-2.5 py-0.5 rounded-full bg-slate-800 text-[10px] font-semibold text-slate-300">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </main>

      {/* Edit Health Card Information Modal */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-xl rounded-2xl glass-card border border-white/10 p-6 md:p-8 shadow-2xl text-left"
            >
              <h3 className="text-xl font-bold text-white mb-6">Edit Digital Card & Profile</h3>
              
              <form onSubmit={handleSaveProfile} className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-400">Weight (kg)</label>
                    <input
                      type="number"
                      value={editWeight}
                      onChange={(e) => setEditWeight(Number(e.target.value))}
                      className="py-2 px-3 rounded-xl glass-input text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-400">Height (cm)</label>
                    <input
                      type="number"
                      value={editHeight}
                      onChange={(e) => setEditHeight(Number(e.target.value))}
                      className="py-2 px-3 rounded-xl glass-input text-sm"
                    />
                  </div>
                </div>

                {/* Chronic Diseases */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-primary-400 font-bold">Chronic Diseases / Diagnoses</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Diabetes, Asthma"
                      value={diseaseInput}
                      onChange={(e) => setDiseaseInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addDisease())}
                      className="flex-1 py-2 px-3 rounded-xl glass-input text-sm"
                    />
                    <button type="button" onClick={addDisease} className="p-2.5 rounded-xl bg-slate-800 text-white font-bold text-sm hover:bg-slate-700">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {editDiseases.map(d => (
                      <span key={d} className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 text-xs text-white">
                        {d}
                        <button type="button" onClick={() => setEditDiseases(editDiseases.filter(item => item !== d))} className="text-[10px] text-slate-400 hover:text-white">✕</button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Allergies */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-teal-400 font-bold">Allergies</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Peanuts, Penicillin"
                      value={allergyInput}
                      onChange={(e) => setAllergyInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
                      className="flex-1 py-2 px-3 rounded-xl glass-input text-sm"
                    />
                    <button type="button" onClick={addAllergy} className="p-2.5 rounded-xl bg-slate-800 text-white font-bold text-sm hover:bg-slate-700">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {editAllergies.map(a => (
                      <span key={a} className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 text-xs text-white">
                        {a}
                        <button type="button" onClick={() => setEditAllergies(editAllergies.filter(item => item !== a))} className="text-[10px] text-slate-400 hover:text-white">✕</button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Current Medications */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-purple-400 font-bold">Current Medications</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Metformin 500mg, Paracetamol"
                      value={medInput}
                      onChange={(e) => setMedInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addMed())}
                      className="flex-1 py-2 px-3 rounded-xl glass-input text-sm"
                    />
                    <button type="button" onClick={addMed} className="p-2.5 rounded-xl bg-slate-800 text-white font-bold text-sm hover:bg-slate-700">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {editMeds.map(m => (
                      <span key={m} className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 text-xs text-white">
                        {m}
                        <button type="button" onClick={() => setEditMeds(editMeds.filter(item => item !== m))} className="text-[10px] text-slate-400 hover:text-white">✕</button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Emergency Contact */}
                <h4 className="text-xs uppercase tracking-widest text-primary-400 font-bold mt-2">Emergency Contact</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-400">Contact Name</label>
                    <input
                      type="text"
                      placeholder="Name"
                      value={emergencyName}
                      onChange={(e) => setEmergencyName(e.target.value)}
                      className="py-2 px-3 rounded-xl glass-input text-xs"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-400">Phone</label>
                    <input
                      type="text"
                      placeholder="Phone"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      className="py-2 px-3 rounded-xl glass-input text-xs"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-400">Relation</label>
                    <input
                      type="text"
                      placeholder="Father / Spouse"
                      value={emergencyRelation}
                      onChange={(e) => setEmergencyRelation(e.target.value)}
                      className="py-2 px-3 rounded-xl glass-input text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 border-t border-white/5 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 border border-white/10 text-white rounded-xl text-xs hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-semibold hover:bg-primary-500"
                  >
                    Save Changes
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
