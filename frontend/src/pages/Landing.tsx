import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Shield, Stethoscope, ChevronRight, Activity, Brain } from 'lucide-react';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="glass fixed top-0 w-full z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-sky-400 to-primary-600 rounded-xl text-white shadow-lg">
            <Activity className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">OneHealth<span className="text-primary-600">Card</span></span>
        </div>
        <Link to="/auth" className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-medium transition-colors">
          Sign In
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto relative">
        <div className="absolute top-20 left-10 w-64 h-64 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-20 right-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-64 h-64 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6">
              Your Health,<br />
              <span className="text-gradient">One Card Away.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed">
              Experience the future of healthcare. A unified digital health passport, instant doctor syncing, and AI-powered medical insights.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth" className="w-full sm:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-primary-500/30 flex items-center justify-center gap-2">
                Get Started <ChevronRight className="w-5 h-5" />
              </Link>
              <Link to="/auth" state={{ role: 'doctor' }} className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-800 rounded-full font-semibold text-lg transition-all shadow-md border border-slate-200 flex items-center justify-center gap-2">
                I'm a Doctor
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 hover:-translate-y-2 transition-transform duration-300"
          >
            <div className="w-14 h-14 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mb-6">
              <Shield className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Digital Health Passport</h3>
            <p className="text-slate-600 leading-relaxed">
              All your vitals, allergies, and prescriptions in one beautifully designed, universally accessible 3D digital card.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass-card p-8 hover:-translate-y-2 transition-transform duration-300"
          >
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <Stethoscope className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Instant Doctor Sync</h3>
            <p className="text-slate-600 leading-relaxed">
              Doctors simply scan your Health ID to view history and instantly sync new prescriptions to your card.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="glass-card p-8 hover:-translate-y-2 transition-transform duration-300"
          >
            <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
              <Brain className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">AI Medical Insights</h3>
            <p className="text-slate-600 leading-relaxed">
              Upload blood tests and lab reports to get them explained in plain English by our advanced medical AI.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 text-center">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-white">
            <Activity className="w-6 h-6" />
            <span className="font-bold text-xl tracking-tight">OneHealthCard</span>
          </div>
          <p>© 2026 OneHealthCard. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
