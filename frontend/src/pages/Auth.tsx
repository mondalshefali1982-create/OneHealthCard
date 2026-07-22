import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { Activity, ShieldAlert, Heart, Stethoscope, User, Lock, Mail, ArrowRight, ShieldCheck, QrCode, FileText, CheckCircle2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Auth: React.FC = () => {
  const { login, register, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // URL Queries for tabs and roles
  const urlTab = searchParams.get('tab') === 'signup' ? 'signup' : 'login';
  const urlRole = searchParams.get('role') === 'doctor' ? 'doctor' : 'patient';

  const [tab, setTab] = useState<'login' | 'signup'>(urlTab);
  const [role, setRole] = useState<'patient' | 'doctor'>(urlRole);
  
  // Common fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // Patient details
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [dob, setDob] = useState('2000-01-01');
  const [gender, setGender] = useState('Male');
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('');

  // Doctor details
  const [specialization, setSpecialization] = useState('');
  const [hospital, setHospital] = useState('');
  const [experience, setExperience] = useState(5);
  const [location, setLocation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [googleMapsLocation, setGoogleMapsLocation] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [loadingLocal, setLoadingLocal] = useState(false);

  // Redirect if logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'patient') {
        navigate('/dashboard');
      } else {
        navigate('/doctor-portal');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoadingLocal(true);

    try {
      if (tab === 'login') {
        await login(email, password);
      } else {
        const registrationData: any = {
          name,
          email,
          password,
          role,
        };

        if (role === 'patient') {
          registrationData.bloodGroup = bloodGroup;
          registrationData.dob = dob;
          registrationData.gender = gender;
          registrationData.weight = weight;
          registrationData.height = height;
          if (emergencyName || emergencyPhone) {
            registrationData.emergencyContact = {
              name: emergencyName,
              phone: emergencyPhone,
              relationship: emergencyRelation || 'Family member',
            };
          }
        } else {
          registrationData.specialization = specialization;
          registrationData.hospital = hospital;
          registrationData.experience = Number(experience);
          registrationData.location = location;
          registrationData.phoneNumber = phoneNumber;
          registrationData.googleMapsLocation = googleMapsLocation;
        }

        await register(registrationData);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoadingLocal(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] flex items-center justify-center py-10 px-4 md:px-8 relative overflow-hidden text-left">
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-600/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl w-full grid lg:grid-cols-12 gap-10 items-center z-10">
        
        {/* Left Side: Medical Branding & Preview */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-5 flex flex-col gap-6"
        >
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="p-3 bg-gradient-to-tr from-cyan-500 via-primary-500 to-emerald-400 rounded-2xl shadow-lg shadow-cyan-500/25 glow-primary">
              <Activity className="h-7 w-7 text-white animate-pulse-heart" />
            </div>
            <span className="text-3xl font-extrabold text-white tracking-tight">OneHealthCard</span>
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldCheck className="h-3.5 w-3.5" /> ISO 27001 SECURED MEDICAL VAULT
            </span>
            <h1 className="text-4xl font-extrabold text-white leading-tight">
              Universal Digital Medical Card & AI Diagnostic Portal
            </h1>
            <p className="text-slate-300 text-sm mt-3 leading-relaxed font-normal">
              Unified digital health identity syncing blood group, vitals, chronic illnesses, and medical reports for instant QR access by doctors.
            </p>
          </div>

          {/* Interactive Glowing Card Preview */}
          <div className="rounded-2xl glass-card-glow p-5 border border-cyan-500/30 relative overflow-hidden mt-2 hidden sm:block">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-cyan-400 animate-pulse" />
                <span className="text-xs font-bold text-white tracking-wide">DIGITAL HEALTH PASSPORT</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold uppercase border border-emerald-500/30">
                ACTIVE VERIFIED
              </span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <div className="flex flex-col gap-1">
                <span className="text-base font-extrabold text-white">ROHAN MONDAL</span>
                <span className="text-cyan-400 font-mono font-semibold text-[11px]">CARD ID: OHC-749281</span>
                <div className="flex gap-4 mt-2">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">BLOOD GROUP</span>
                    <span className="text-white font-bold text-sm">O+ POSITIVE</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">AGE / GENDER</span>
                    <span className="text-white font-bold text-sm">26 Yrs / Male</span>
                  </div>
                </div>
              </div>

              <div className="p-2 bg-white rounded-xl shadow-lg border border-white shrink-0">
                <QrCode className="h-14 w-14 text-slate-950" />
              </div>
            </div>
          </div>

          {/* Bullet points */}
          <div className="flex flex-col gap-2.5 text-xs text-slate-300 mt-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Instant QR Code scanning for hospital & clinic visits</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
              <span>AI Lab Report OCR scanner for instant lab analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Verified doctor search with Google Maps locations</span>
            </div>
          </div>
        </motion.div>

        {/* Right Side: High-Contrast Auth Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-7"
        >
          <div className="rounded-3xl glass-card border border-white/15 p-6 md:p-8 shadow-2xl relative overflow-hidden bg-slate-900/90">
            
            {/* Tab Header & Role Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5 mb-6">
              <div className="flex p-1 bg-slate-950/80 rounded-2xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setTab('login')}
                  className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all ${
                    tab === 'login'
                      ? 'bg-gradient-to-r from-cyan-500 to-primary-600 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setTab('signup')}
                  className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all ${
                    tab === 'signup'
                      ? 'bg-gradient-to-r from-cyan-500 to-primary-600 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>

              <div className="flex p-1 bg-slate-950/80 rounded-2xl border border-white/10 items-center">
                <button
                  type="button"
                  onClick={() => setRole('patient')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    role === 'patient'
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Heart className="h-3.5 w-3.5 fill-current" /> Patient
                </button>
                <button
                  type="button"
                  onClick={() => setRole('doctor')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    role === 'doctor'
                      ? 'bg-cyan-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Stethoscope className="h-3.5 w-3.5" /> Doctor
                </button>
              </div>
            </div>

            {/* Error Message Callout */}
            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex gap-3 items-center shadow-lg"
                >
                  <ShieldAlert className="h-5 w-5 text-rose-400 shrink-0" />
                  <span className="font-semibold">{errorMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
              
              {/* Full Name for Signup */}
              {tab === 'signup' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-200">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rohan Mondal"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm text-white font-medium"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-200">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400" />
                  <input
                    type="email"
                    required
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm text-white font-medium"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-200">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm text-white font-medium"
                  />
                </div>
              </div>

              {/* Signup Fields */}
              {tab === 'signup' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-t border-white/10 pt-4 mt-1 flex flex-col gap-4"
                >
                  {role === 'patient' ? (
                    <>
                      <span className="text-[11px] uppercase font-bold tracking-widest text-cyan-400 font-mono">Patient Medical Details</span>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-bold text-slate-300">Blood Group</label>
                          <select
                            value={bloodGroup}
                            onChange={(e) => setBloodGroup(e.target.value)}
                            className="py-2.5 px-3 rounded-xl glass-input text-xs font-semibold"
                          >
                            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                              <option key={bg} value={bg} className="bg-slate-900 text-white">{bg}</option>
                            ))}
                          </select>
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-bold text-slate-300">Date of Birth</label>
                          <input
                            type="date"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            className="py-2 px-3 rounded-xl glass-input text-xs"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-bold text-slate-300">Gender</label>
                          <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="py-2.5 px-3 rounded-xl glass-input text-xs font-semibold"
                          >
                            {['Male', 'Female', 'Other'].map(g => (
                              <option key={g} value={g} className="bg-slate-900 text-white">{g}</option>
                            ))}
                          </select>
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-bold text-slate-300">Weight (kg)</label>
                          <input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(Number(e.target.value))}
                            className="py-2 px-3 rounded-xl glass-input text-xs"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-bold text-slate-300">Height (cm)</label>
                          <input
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(Number(e.target.value))}
                            className="py-2 px-3 rounded-xl glass-input text-xs"
                          />
                        </div>
                      </div>

                      <span className="text-[11px] uppercase font-bold tracking-widest text-cyan-400 font-mono mt-2">Emergency Contact</span>
                      <div className="grid md:grid-cols-3 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-bold text-slate-300">Contact Name</label>
                          <input
                            type="text"
                            placeholder="Father / Spouse"
                            value={emergencyName}
                            onChange={(e) => setEmergencyName(e.target.value)}
                            className="py-2 px-3 rounded-xl glass-input text-xs"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-bold text-slate-300">Phone Number</label>
                          <input
                            type="text"
                            placeholder="+91 98000 00000"
                            value={emergencyPhone}
                            onChange={(e) => setEmergencyPhone(e.target.value)}
                            className="py-2 px-3 rounded-xl glass-input text-xs"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-bold text-slate-300">Relation</label>
                          <input
                            type="text"
                            placeholder="Father / Spouse"
                            value={emergencyRelation}
                            onChange={(e) => setEmergencyRelation(e.target.value)}
                            className="py-2 px-3 rounded-xl glass-input text-xs"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="text-[11px] uppercase font-bold tracking-widest text-cyan-400 font-mono">Doctor Credentials</span>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-bold text-slate-300">Specialization</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Cardiologist / Diabetes Specialist"
                            value={specialization}
                            onChange={(e) => setSpecialization(e.target.value)}
                            className="py-2 px-3 rounded-xl glass-input text-xs"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-bold text-slate-300">Hospital / Clinic Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Apollo Hospital"
                            value={hospital}
                            onChange={(e) => setHospital(e.target.value)}
                            className="py-2 px-3 rounded-xl glass-input text-xs"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-bold text-slate-300">Experience (Years)</label>
                          <input
                            type="number"
                            required
                            value={experience}
                            onChange={(e) => setExperience(Number(e.target.value))}
                            className="py-2 px-3 rounded-xl glass-input text-xs"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-bold text-slate-300">Contact Number</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. +91 98765 43210"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="py-2 px-3 rounded-xl glass-input text-xs"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-bold text-slate-300">Location (City, State)</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Salt Lake, Kolkata"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="py-2 px-3 rounded-xl glass-input text-xs"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-bold text-slate-300">Google Maps URL (Optional)</label>
                          <input
                            type="text"
                            placeholder="https://maps.google.com/..."
                            value={googleMapsLocation}
                            onChange={(e) => setGoogleMapsLocation(e.target.value)}
                            className="py-2 px-3 rounded-xl glass-input text-xs"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loadingLocal}
                className="w-full mt-3 py-3.5 bg-gradient-to-r from-cyan-500 via-primary-500 to-emerald-400 text-slate-950 font-extrabold rounded-2xl hover:opacity-95 shadow-xl shadow-cyan-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 text-sm tracking-wide"
              >
                {loadingLocal ? (
                  <span className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {tab === 'login' ? 'Access Medical Portal' : 'Register OneHealthCard'} <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>

      </div>
    </div>
  );
};
