import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { Activity, ShieldAlert, Heart, Stethoscope, User, Lock, Mail, ArrowRight, ShieldCheck, QrCode, CheckCircle2, Phone, Star, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-between text-left">
      
      {/* Top Clinical Header Ticker (Reference Medilife Style) */}
      <header className="bg-slate-900 text-white text-xs py-2 px-4 md:px-8 flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-4">
          <span>Welcome to <strong>OneHealthCard Digital Portal</strong></span>
          <span className="hidden md:inline text-slate-400">|</span>
          <span className="hidden md:inline text-slate-300">Mon - Sat: 8:00 AM - 10:00 PM</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-300">Helpline: +91 1800 123 4567</span>
          <a href="tel:108" className="bg-red-600 text-white font-extrabold px-3 py-1 rounded-md text-[11px] uppercase tracking-wider hover:bg-red-700 transition-colors flex items-center gap-1">
            <Phone className="h-3 w-3" /> FOR EMERGENCIES CALL 108
          </a>
        </div>
      </header>

      {/* Main Body Grid */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="max-w-6xl w-full grid lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Side: Medical Branding & Trust Features (Reference WeCare / Inymo Style) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 flex flex-col gap-6"
          >
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="p-3 bg-sky-600 text-white rounded-2xl shadow-lg shadow-sky-600/30">
                <Activity className="h-8 w-8 text-white animate-pulse-heart" />
              </div>
              <div>
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight block">OneHealthCard</span>
                <span className="text-xs font-bold text-sky-600 uppercase tracking-widest block">UNIVERSAL MEDICAL NETWORK</span>
              </div>
            </div>

            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
                Medical Services That <span className="text-sky-600">You Can Trust 100%</span>
              </h1>
              <p className="text-slate-600 text-base mt-4 leading-relaxed font-normal">
                Save time and access verified healthcare online. Unified digital health identity syncing blood group, vitals, chronic illnesses, and medical reports for instant QR access.
              </p>
            </div>

            {/* Trust Stats Bar (Reference Inymo Style) */}
            <div className="grid grid-cols-3 gap-4 border-y border-slate-200 py-4 my-1">
              <div>
                <div className="flex items-center gap-1 text-amber-500 font-extrabold text-lg">
                  <Star className="h-4 w-4 fill-amber-500" /> 4.9★
                </div>
                <span className="text-xs text-slate-500 font-medium block">User Rating</span>
              </div>
              <div>
                <span className="font-extrabold text-lg text-slate-900 block">100%</span>
                <span className="text-xs text-slate-500 font-medium block">Verified Doctors</span>
              </div>
              <div>
                <span className="font-extrabold text-lg text-sky-600 block">2M+</span>
                <span className="text-xs text-slate-500 font-medium block">QR Consultations</span>
              </div>
            </div>

            {/* Feature Bullets */}
            <div className="flex flex-col gap-3 text-sm text-slate-700 font-medium">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                <span>Instant Scannable Health ID QR Code for Hospital Access</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-5 w-5 text-sky-600 shrink-0" />
                <span>AI OpenRouter OCR Lab Report Scanner for instant breakdown</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                <span>Verified Google Maps Doctor Directory across all Indian Cities</span>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Clean White Auth Card (Reference Medilife Appointment Form Style) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-6"
          >
            <div className="clinical-card p-6 md:p-8 bg-white shadow-xl relative overflow-hidden text-left border-slate-200">
              
              {/* Header Tabs & Role Pills */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
                <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setTab('login')}
                    className={`px-5 py-2 text-xs font-bold rounded-lg transition-all ${
                      tab === 'login'
                        ? 'bg-sky-600 text-white shadow-md'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab('signup')}
                    className={`px-5 py-2 text-xs font-bold rounded-lg transition-all ${
                      tab === 'signup'
                        ? 'bg-sky-600 text-white shadow-md'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 items-center">
                  <button
                    type="button"
                    onClick={() => setRole('patient')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      role === 'patient'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Heart className="h-3.5 w-3.5 fill-current" /> Patient
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('doctor')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      role === 'doctor'
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Stethoscope className="h-3.5 w-3.5" /> Doctor
                  </button>
                </div>
              </div>

              {/* Error Callout */}
              <AnimatePresence>
                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex gap-3 items-center shadow-sm"
                  >
                    <ShieldAlert className="h-5 w-5 text-red-600 shrink-0" />
                    <span className="font-semibold">{errorMsg}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Main Auth Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
                
                {/* Full Name for Signup */}
                {tab === 'signup' && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-sky-600" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rohan Mondal"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-xl clinical-input text-sm font-medium"
                      />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-sky-600" />
                    <input
                      type="email"
                      required
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl clinical-input text-sm font-medium"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-sky-600" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl clinical-input text-sm font-medium"
                    />
                  </div>
                </div>

                {/* Signup Fields */}
                {tab === 'signup' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-t border-slate-200 pt-4 mt-1 flex flex-col gap-4"
                  >
                    {role === 'patient' ? (
                      <>
                        <span className="text-[11px] uppercase font-bold tracking-widest text-sky-600 font-mono">Patient Medical Details</span>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-bold text-slate-600">Blood Group</label>
                            <select
                              value={bloodGroup}
                              onChange={(e) => setBloodGroup(e.target.value)}
                              className="py-2.5 px-3 rounded-xl clinical-input text-xs font-semibold"
                            >
                              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                <option key={bg} value={bg}>{bg}</option>
                              ))}
                            </select>
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-bold text-slate-600">Date of Birth</label>
                            <input
                              type="date"
                              value={dob}
                              onChange={(e) => setDob(e.target.value)}
                              className="py-2 px-3 rounded-xl clinical-input text-xs"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-bold text-slate-600">Gender</label>
                            <select
                              value={gender}
                              onChange={(e) => setGender(e.target.value)}
                              className="py-2.5 px-3 rounded-xl clinical-input text-xs font-semibold"
                            >
                              {['Male', 'Female', 'Other'].map(g => (
                                <option key={g} value={g}>{g}</option>
                              ))}
                            </select>
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-bold text-slate-600">Weight (kg)</label>
                            <input
                              type="number"
                              value={weight}
                              onChange={(e) => setWeight(Number(e.target.value))}
                              className="py-2 px-3 rounded-xl clinical-input text-xs"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-bold text-slate-600">Height (cm)</label>
                            <input
                              type="number"
                              value={height}
                              onChange={(e) => setHeight(Number(e.target.value))}
                              className="py-2 px-3 rounded-xl clinical-input text-xs"
                            />
                          </div>
                        </div>

                        <span className="text-[11px] uppercase font-bold tracking-widest text-sky-600 font-mono mt-2">Emergency Contact</span>
                        <div className="grid md:grid-cols-3 gap-3">
                          <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-bold text-slate-600">Contact Name</label>
                            <input
                              type="text"
                              placeholder="Father / Spouse"
                              value={emergencyName}
                              onChange={(e) => setEmergencyName(e.target.value)}
                              className="py-2 px-3 rounded-xl clinical-input text-xs"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-bold text-slate-600">Phone Number</label>
                            <input
                              type="text"
                              placeholder="+91 98000 00000"
                              value={emergencyPhone}
                              onChange={(e) => setEmergencyPhone(e.target.value)}
                              className="py-2 px-3 rounded-xl clinical-input text-xs"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-bold text-slate-600">Relation</label>
                            <input
                              type="text"
                              placeholder="Father / Spouse"
                              value={emergencyRelation}
                              onChange={(e) => setEmergencyRelation(e.target.value)}
                              className="py-2 px-3 rounded-xl clinical-input text-xs"
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="text-[11px] uppercase font-bold tracking-widest text-sky-600 font-mono">Doctor Credentials</span>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-bold text-slate-600">Specialization</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Cardiologist / Diabetes Specialist"
                              value={specialization}
                              onChange={(e) => setSpecialization(e.target.value)}
                              className="py-2 px-3 rounded-xl clinical-input text-xs"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-bold text-slate-600">Hospital / Clinic Name</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Apollo Hospital"
                              value={hospital}
                              onChange={(e) => setHospital(e.target.value)}
                              className="py-2 px-3 rounded-xl clinical-input text-xs"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-bold text-slate-600">Experience (Years)</label>
                            <input
                              type="number"
                              required
                              value={experience}
                              onChange={(e) => setExperience(Number(e.target.value))}
                              className="py-2 px-3 rounded-xl clinical-input text-xs"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-bold text-slate-600">Contact Number</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. +91 98765 43210"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              className="py-2 px-3 rounded-xl clinical-input text-xs"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-bold text-slate-600">Location (City, State)</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Salt Lake, Kolkata"
                              value={location}
                              onChange={(e) => setLocation(e.target.value)}
                              className="py-2 px-3 rounded-xl clinical-input text-xs"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-bold text-slate-600">Google Maps URL (Optional)</label>
                            <input
                              type="text"
                              placeholder="https://maps.google.com/..."
                              value={googleMapsLocation}
                              onChange={(e) => setGoogleMapsLocation(e.target.value)}
                              className="py-2 px-3 rounded-xl clinical-input text-xs"
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
                  className="w-full mt-3 py-3.5 bg-sky-600 text-white font-extrabold rounded-xl hover:bg-sky-700 shadow-lg shadow-sky-600/25 active:scale-98 transition-all flex items-center justify-center gap-2 text-sm tracking-wide"
                >
                  {loadingLocal ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
      </main>

      {/* Clinical Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        © 2026 OneHealthCard Network. All Patient Records Encrypted with ISO-27001 Medical Standards.
      </footer>
    </div>
  );
};
