import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, CreditCard, Activity, Cpu, Search, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-950 overflow-hidden relative selection:bg-primary-500 selection:text-white">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-teal-900/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="border-b border-white/5 relative z-10 glass">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-primary-600 to-cyan-400 rounded-xl shadow-lg shadow-primary-500/20">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-primary-400 bg-clip-text text-transparent">
              OneHealthCard
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/auth"
              className="text-sm font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/auth?tab=signup"
              className="px-4 py-2 text-sm font-semibold bg-white text-dark-950 rounded-xl hover:bg-slate-200 active:scale-95 transition-all shadow-md"
            >
              Create Card
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-28 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-6 text-left"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-xs font-semibold text-primary-400 w-fit">
              <Shield className="h-3.5 w-3.5" /> Secure Medical Vault System
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white m-0">
              One Digital Card.<br />
              <span className="bg-gradient-to-r from-primary-400 to-emerald-400 bg-clip-text text-transparent">
                Your Entire Health.
              </span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
              Store your diagnoses, prescriptions, and lab reports securely in one location. Empower doctors with quick camera QR scanning, and analyze blood test charts instantly using OpenRouter AI.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <Link
                to="/auth?tab=signup"
                className="px-6 py-3.5 bg-gradient-to-r from-primary-600 to-cyan-500 text-white font-semibold rounded-xl hover:from-primary-500 hover:to-cyan-400 shadow-lg shadow-primary-500/25 active:scale-95 transition-all"
              >
                Register Your OneHealthCard
              </Link>
              <Link
                to="/auth?role=doctor"
                className="px-6 py-3.5 bg-white/5 text-white font-semibold border border-white/10 rounded-xl hover:bg-white/10 active:scale-95 transition-all"
              >
                Doctor Portal Login
              </Link>
            </div>
          </motion.div>

          {/* Interactive Card Graphic */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="w-[420px] h-[250px] rounded-2xl relative preserve-3d cursor-pointer shadow-2xl transition-all duration-700 hover:[transform:rotateY(10deg)_rotateX(5deg)] group">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-primary-600 to-teal-500 p-[1px]">
                <div className="w-full h-full rounded-2xl bg-slate-900/90 backdrop-blur-md p-6 flex flex-col justify-between relative overflow-hidden">
                  {/* Card Glow Lines */}
                  <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-primary-500/10 rounded-full blur-[40px] pointer-events-none" />
                  
                  {/* Top Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-primary-400 animate-pulse" />
                      <span className="text-sm font-semibold tracking-wide text-slate-300">OneHealthCard</span>
                    </div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">Active</span>
                  </div>

                  {/* Body Info */}
                  <div className="flex gap-4 items-center mt-4">
                    <div className="w-14 h-14 bg-slate-800 border border-white/10 rounded-xl flex items-center justify-between overflow-hidden relative">
                      <div className="absolute inset-2 border-t-2 border-primary-500 animate-pulse rounded" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-base font-bold text-white mb-0.5">ROHAN MONDAL</h3>
                      <p className="text-[11px] font-mono text-primary-400">ID: ARG-829482</p>
                    </div>
                  </div>

                  {/* Bottom Stats */}
                  <div className="flex justify-between items-end border-t border-white/5 pt-3">
                    <div className="text-left">
                      <span className="text-[9px] uppercase tracking-wider text-slate-500 block">Blood Group</span>
                      <span className="text-xs font-bold text-white">O+ Positive</span>
                    </div>
                    <div className="text-left">
                      <span className="text-[9px] uppercase tracking-wider text-slate-500 block">Gender / Age</span>
                      <span className="text-xs font-bold text-white">Male / 24 Yrs</span>
                    </div>
                    {/* Simulated QR block */}
                    <div className="w-10 h-10 bg-white p-1 rounded">
                      <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feature Grid */}
        <section className="mt-40 grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl glass-card text-left flex flex-col gap-4 border border-white/5 hover:border-primary-500/30 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center border border-primary-500/20">
              <CreditCard className="h-6 w-6 text-primary-400" />
            </div>
            <h3 className="text-xl font-bold text-white">3D Digital Health Card</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              An interactive digital card displaying your medical ID, blood group, allergies, and dynamic QR code. Easily viewable, downloadable, and shareable.
            </p>
          </div>

          <div className="p-8 rounded-2xl glass-card text-left flex flex-col gap-4 border border-white/5 hover:border-primary-500/30 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center border border-teal-500/20">
              <Cpu className="h-6 w-6 text-teal-400" />
            </div>
            <h3 className="text-xl font-bold text-white">AI Report Analyzer</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              Upload blood tests, prescriptions, or clinical notes. Our built-in OpenRouter OCR AI reads the document, extracts stats, and gives a simplified summary.
            </p>
          </div>

          <div className="p-8 rounded-2xl glass-card text-left flex flex-col gap-4 border border-white/5 hover:border-primary-500/30 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <Search className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Advanced Search Portal</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              Find specialized clinics and doctors based on diseases, locations, or specialities. View contact numbers and mapped directions directly.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 mt-20 relative z-10 glass">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-500 text-xs">
          <p>© 2026 OneHealthCard Systems. Developed for production efficiency and secure healthcare management.</p>
        </div>
      </footer>
    </div>
  );
};
