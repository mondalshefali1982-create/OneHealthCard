import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, CreditCard, Activity, Cpu, Search, Star, Phone, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 overflow-x-hidden text-left flex flex-col justify-between">
      
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

      {/* Navigation Header */}
      <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-600 text-white rounded-xl shadow-md">
              <Activity className="h-6 w-6 animate-pulse-heart" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 block">OneHealthCard</span>
              <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest block">UNIVERSAL MEDICAL VAULT</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/auth"
              className="text-sm font-bold text-slate-700 hover:text-sky-600 transition-colors px-3 py-2"
            >
              Sign In
            </Link>
            <Link
              to="/auth?tab=signup"
              className="px-5 py-2.5 text-sm font-extrabold bg-sky-600 text-white rounded-xl hover:bg-sky-700 active:scale-95 transition-all shadow-md"
            >
              Register OneHealthCard
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Hero Section with Real Doctor Photography */}
      <main className="max-w-7xl mx-auto px-6 pt-12 pb-20 flex-1">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Text Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 flex flex-col gap-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-xs font-bold text-sky-700 w-fit">
              <Shield className="h-3.5 w-3.5 text-sky-600" /> ISO-27001 Certified Medical Network
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-slate-900">
              Medical Services That <span className="text-sky-600">You Can Trust 100%</span>
            </h1>

            <p className="text-slate-600 text-base leading-relaxed">
              Save time and access verified healthcare online. Store your diagnoses, body vitals, prescriptions, and lab reports in one universal digital health card. Doctor camera QR scanning enabled.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-2">
              <Link
                to="/auth?tab=signup"
                className="px-6 py-3.5 bg-sky-600 text-white font-extrabold rounded-xl hover:bg-sky-700 shadow-lg shadow-sky-600/25 active:scale-95 transition-all flex items-center gap-2 text-sm"
              >
                Register Health Passport <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/auth?role=doctor"
                className="px-6 py-3.5 bg-slate-100 text-slate-800 font-extrabold border border-slate-200 rounded-xl hover:bg-slate-200 active:scale-95 transition-all text-sm"
              >
                Doctor Portal Access
              </Link>
            </div>

            {/* Trust Stats Bar (Matching Reference Image) */}
            <div className="grid grid-cols-3 gap-4 border-t border-slate-200 pt-6 mt-4">
              <div>
                <div className="flex items-center gap-1 text-amber-500 font-extrabold text-xl">
                  <Star className="h-4 w-4 fill-amber-500" /> 4.9★
                </div>
                <span className="text-xs text-slate-500 font-medium">User Rating</span>
              </div>
              <div>
                <span className="font-extrabold text-xl text-slate-900 block">100%</span>
                <span className="text-xs text-slate-500 font-medium">Verified Clinics</span>
              </div>
              <div>
                <span className="font-extrabold text-xl text-sky-600 block">2M+</span>
                <span className="text-xs text-slate-500 font-medium">Scanned Cards</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Embedded Doctor Image & Consultation Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-6 relative flex justify-center"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-sky-50 max-w-lg w-full h-[400px]">
              <img
                src="/images/female_doctor_hero.png"
                alt="Smiling Medical Specialist Doctor"
                className="w-full h-full object-cover object-top"
              />

              {/* Floating Doctor Badge (Matching Inymo & WeCare Reference Images) */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-sky-600 shrink-0">
                    <img src="/images/male_doctor_consult.png" alt="Consulting Doctor" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 m-0">Dr. Shashank Joshi</h4>
                    <p className="text-xs text-sky-700 font-bold m-0">Chief Diabetologist & Endocrinologist</p>
                  </div>
                </div>

                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-extrabold rounded-full">
                  Verified Doctor
                </span>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Feature Cards Grid with Clinic Interior Image */}
        <section className="mt-28 grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl clinical-card bg-white text-left flex flex-col gap-4 shadow-md">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center border border-sky-200 text-sky-600">
              <CreditCard className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">3D Digital Health Card</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Interactive digital passport featuring blood group, body weight, height, allergies, and dynamic scannable QR Code for immediate doctor scanning.
            </p>
          </div>

          <div className="p-8 rounded-3xl clinical-card bg-white text-left flex flex-col gap-4 shadow-md">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-200 text-emerald-600">
              <Cpu className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">AI Report Analyzer</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Upload blood tests, CBC certificates, or lab reports. Built-in OpenRouter OCR AI extracts key parameters and generates clinical summary insights.
            </p>
          </div>

          <div className="p-8 rounded-3xl clinical-card bg-white text-left flex flex-col gap-4 shadow-md">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center border border-sky-200 text-sky-600">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Real City Doctor Locator</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Search Kolkata, Krishnagar, Ranaghat, Mumbai, or Delhi to find real Google Maps verified doctors, contact numbers, and live location map pins.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p>© 2026 OneHealthCard Network. All Rights Reserved. ISO-27001 Secure Healthcare Infrastructure.</p>
      </footer>
    </div>
  );
};
