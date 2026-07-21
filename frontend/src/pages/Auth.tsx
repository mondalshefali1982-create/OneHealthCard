import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { Activity, ShieldAlert, Heart, Stethoscope, User, Lock, Mail, ArrowRight } from 'lucide-react';
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
  
  // Fields state
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
        // Registering
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
      setErrorMsg(err.message || 'Authentication failed. Please verify entries.');
    } finally {
      setLoadingLocal(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col justify-center items-center py-12 px-6 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-primary-800/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-800/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Title logo */}
      <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => navigate('/')}>
        <div className="p-2.5 bg-gradient-to-tr from-primary-600 to-cyan-400 rounded-xl shadow-lg">
          <Activity className="h-6 w-6 text-white" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-white">OneHealthCard</span>
      </div>

      {/* Main Glass Panel */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl rounded-2xl glass-card border border-white/10 p-8 shadow-2xl z-10"
      >
        {/* Auth Mode Toggle Tabs */}
        <div className="flex justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setTab('login')}
              className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                tab === 'login'
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setTab('signup')}
              className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                tab === 'signup'
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          <div className="flex bg-slate-800/50 p-1 rounded-xl items-center border border-white/5">
            <button
              onClick={() => setRole('patient')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                role === 'patient'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Heart className="h-3 w-3" /> Patient
            </button>
            <button
              onClick={() => setRole('doctor')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                role === 'doctor'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Stethoscope className="h-3 w-3" /> Doctor
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
              className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm text-left flex gap-3 items-start"
            >
              <ShieldAlert className="h-5 w-5 shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
          {/* Common Fields */}
          {tab === 'signup' && (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-400">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohan Mondal"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-400">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500" />
              <input
                type="email"
                required
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-400">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm"
              />
            </div>
          </div>

          {/* Tab Specific Signup Fields */}
          {tab === 'signup' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border-t border-white/5 pt-5 mt-2 flex flex-col gap-4"
            >
              {role === 'patient' ? (
                <>
                  <h4 className="text-xs uppercase tracking-widest text-primary-400 font-bold mb-1">Patient Info</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-slate-400">Blood Group</label>
                      <select
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value)}
                        className="py-2.5 px-3 rounded-xl glass-input text-sm"
                      >
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                          <option key={bg} value={bg} className="bg-slate-900">{bg}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-slate-400">Date of Birth</label>
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="py-2.5 px-3 rounded-xl glass-input text-sm"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-slate-400">Gender</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="py-2.5 px-3 rounded-xl glass-input text-sm"
                      >
                        {['Male', 'Female', 'Other'].map(g => (
                          <option key={g} value={g} className="bg-slate-900">{g}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-slate-400">Weight (kg)</label>
                      <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(Number(e.target.value))}
                        className="py-2.5 px-3 rounded-xl glass-input text-sm"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-slate-400">Height (cm)</label>
                      <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(Number(e.target.value))}
                        className="py-2.5 px-3 rounded-xl glass-input text-sm"
                      />
                    </div>
                  </div>

                  <h4 className="text-xs uppercase tracking-widest text-primary-400 font-bold mb-1 mt-4">Emergency Contact</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-slate-400">Contact Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Papa / Spouse"
                        value={emergencyName}
                        onChange={(e) => setEmergencyName(e.target.value)}
                        className="py-2.5 px-3 rounded-xl glass-input text-sm"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-slate-400">Phone Number</label>
                      <input
                        type="text"
                        placeholder="000-000-0000"
                        value={emergencyPhone}
                        onChange={(e) => setEmergencyPhone(e.target.value)}
                        className="py-2.5 px-3 rounded-xl glass-input text-sm"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-slate-400">Relationship</label>
                      <input
                        type="text"
                        placeholder="Father / Wife"
                        value={emergencyRelation}
                        onChange={(e) => setEmergencyRelation(e.target.value)}
                        className="py-2.5 px-3 rounded-xl glass-input text-sm"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h4 className="text-xs uppercase tracking-widest text-primary-400 font-bold mb-1">Doctor Credentials</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-slate-400">Specialization</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Cardiologist / Diabetes Specialist"
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                        className="py-2.5 px-3 rounded-xl glass-input text-sm"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-slate-400">Hospital / Clinic Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Apollo Hospital"
                        value={hospital}
                        onChange={(e) => setHospital(e.target.value)}
                        className="py-2.5 px-3 rounded-xl glass-input text-sm"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-slate-400">Years of Experience</label>
                      <input
                        type="number"
                        required
                        value={experience}
                        onChange={(e) => setExperience(Number(e.target.value))}
                        className="py-2.5 px-3 rounded-xl glass-input text-sm"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-slate-400">Contact Number</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. +91 98765 43210"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="py-2.5 px-3 rounded-xl glass-input text-sm"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-slate-400">Location (City, State)</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Salt Lake, Kolkata"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="py-2.5 px-3 rounded-xl glass-input text-sm"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-slate-400">Google Maps URL (Optional)</label>
                      <input
                        type="text"
                        placeholder="https://maps.google.com/..."
                        value={googleMapsLocation}
                        onChange={(e) => setGoogleMapsLocation(e.target.value)}
                        className="py-2.5 px-3 rounded-xl glass-input text-sm"
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
            className="w-full mt-4 py-3 bg-gradient-to-r from-primary-600 to-cyan-500 text-white font-semibold rounded-xl hover:from-primary-500 hover:to-cyan-400 shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            {loadingLocal ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {tab === 'login' ? 'Access Portal' : 'Register Digital Card'} <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
