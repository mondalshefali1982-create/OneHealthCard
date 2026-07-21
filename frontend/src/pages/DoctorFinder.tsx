import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import api from '../services/api.js';
import {
  Search, MapPin, Phone, Hospital, Award, Calendar, Activity,
  ChevronRight, Compass, Star, ArrowLeft, LogOut, CreditCard, Settings, FileText
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Mock pre-seeded doctors for beautiful initial render/hackathon demo
const SEED_DOCTORS = [
  {
    _id: 'seed-1',
    user: { name: 'Dr. Anita Desai' },
    specialization: 'Diabetes Specialist',
    hospital: 'Fortis Clinic',
    experience: 12,
    location: 'Salt Lake, Kolkata',
    phoneNumber: '+91 98300 12345',
    googleMapsLocation: 'https://maps.google.com/?q=Salt+Lake+Kolkata'
  },
  {
    _id: 'seed-2',
    user: { name: 'Dr. Vivek Sharma' },
    specialization: 'Cardiologist',
    hospital: 'Apollo Heart Center',
    experience: 15,
    location: 'New Town, Kolkata',
    phoneNumber: '+91 98450 67890',
    googleMapsLocation: 'https://maps.google.com/?q=New+Town+Kolkata'
  },
  {
    _id: 'seed-3',
    user: { name: 'Dr. Ramesh Nair' },
    specialization: 'Endocrinologist (Diabetes)',
    hospital: 'Max Health Care',
    experience: 10,
    location: 'Ballygunge, Kolkata',
    phoneNumber: '+91 90070 54321',
    googleMapsLocation: 'https://maps.google.com/?q=Ballygunge+Kolkata'
  },
  {
    _id: 'seed-4',
    user: { name: 'Dr. Priya Mehta' },
    specialization: 'General Physician',
    hospital: 'Woodlands Multispecialty',
    experience: 8,
    location: 'Alipore, Kolkata',
    phoneNumber: '+91 91234 56789',
    googleMapsLocation: 'https://maps.google.com/?q=Alipore+Kolkata'
  }
];

export const DoctorFinder: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Directory state
  const [specialization, setSpecialization] = useState('');
  const [location, setLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [doctorsList, setDoctorsList] = useState<any[]>(SEED_DOCTORS);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [activeTab, setActiveTab] = useState('All');

  const handleSearch = async () => {
    setLoadingSearch(true);
    try {
      // Query backend to see if there are database doctors
      const params: any = {};
      if (specialization) params.specialization = specialization;
      if (location) params.location = location;
      if (searchQuery) params.query = searchQuery;

      const response = await api.get('/doctor/directory', { params });
      
      // Merge pre-seeded demo doctors with MongoDB database doctors
      const dbDoctors = response.data;
      if (dbDoctors.length > 0) {
        // Dedup and combine
        const combined = [...dbDoctors, ...SEED_DOCTORS].filter(
          (value, index, self) => self.findIndex(t => t._id === value._id) === index
        );
        setDoctorsList(combined);
      } else {
        // If query matches nothing in database, filter the seed list locally for hackathon convenience
        const filteredSeed = SEED_DOCTORS.filter(doc => {
          const specMatch = !specialization || doc.specialization.toLowerCase().includes(specialization.toLowerCase());
          const locMatch = !location || doc.location.toLowerCase().includes(location.toLowerCase());
          const queryMatch = !searchQuery || 
            doc.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.hospital.toLowerCase().includes(searchQuery.toLowerCase());
          return specMatch && locMatch && queryMatch;
        });
        setDoctorsList(filteredSeed);
      }
    } catch (error) {
      console.error('Failed to query doctor directory:', error);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleTabClick = (spec: string) => {
    setActiveTab(spec);
    if (spec === 'All') {
      setSpecialization('');
      setDoctorsList(SEED_DOCTORS);
    } else {
      setSpecialization(spec);
      // Filter list immediately
      const filtered = SEED_DOCTORS.filter(d => d.specialization.toLowerCase().includes(spec.toLowerCase()));
      setDoctorsList(filtered);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [specialization, location]);

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
            <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 text-sm font-semibold transition-all">
              <CreditCard className="h-4 w-4" /> My Health Card
            </Link>
            <Link to="/doctor-finder" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-semibold transition-all">
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
        <div className="text-left flex flex-col gap-8">
          
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-primary-400 font-sans">FIND SPECIALISTS</span>
            <h1 className="text-3xl font-extrabold text-white mt-1 mb-0">Doctor Locator</h1>
            <p className="text-slate-400 text-sm">Locate verified medical clinics, cardiologists, and diabetes endocrinologists.</p>
          </div>

          {/* Search Inputs */}
          <div className="grid md:grid-cols-3 gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search Doctor or Hospital Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm"
              />
            </div>
            
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500" />
              <input
                type="text"
                placeholder="City/Area (e.g. Salt Lake)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm"
              />
            </div>

            <button
              onClick={handleSearch}
              disabled={loadingSearch}
              className="py-3 px-6 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl transition-all text-sm flex items-center justify-center gap-2 active:scale-95 shadow-lg"
            >
              {loadingSearch ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Apply Filters'}
            </button>
          </div>

          {/* Specialization Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 border-b border-white/5">
            {['All', 'Diabetes', 'Cardiologist', 'General Physician'].map((tabName) => (
              <button
                key={tabName}
                onClick={() => handleTabClick(tabName)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  activeTab === tabName
                    ? 'bg-primary-500 text-white border-primary-500 shadow-md'
                    : 'text-slate-400 border-white/5 hover:text-white hover:bg-white/5'
                }`}
              >
                {tabName}
              </button>
            ))}
          </div>

          {/* Main Content Layout (Doctor list & Map mockup) */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* List side */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {doctorsList.length === 0 ? (
                <div className="p-12 text-center rounded-2xl glass border border-white/5">
                  <Compass className="h-10 w-10 text-slate-600 mx-auto mb-3" />
                  <h4 className="text-white font-bold mb-1">No matches found</h4>
                  <p className="text-slate-400 text-xs">Try broadening your search query or location settings.</p>
                </div>
              ) : (
                doctorsList.map((doc) => (
                  <div
                    key={doc._id}
                    className="p-5 rounded-2xl glass-card border border-white/5 hover:border-primary-500/25 transition-all text-left flex gap-4 items-start"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center border border-primary-500/20 shrink-0">
                      <Hospital className="h-6 w-6 text-primary-400" />
                    </div>

                    <div className="flex-1 flex flex-col gap-1 text-xs">
                      <div className="flex justify-between items-center">
                        <h3 className="text-base font-bold text-white m-0">{doc.user?.name || doc.name}</h3>
                        <div className="flex items-center gap-1 text-amber-400">
                          <Star className="h-3 w-3 fill-amber-400" />
                          <span className="font-semibold">4.9</span>
                        </div>
                      </div>

                      <span className="text-primary-400 font-semibold">{doc.specialization}</span>
                      <p className="text-slate-400 flex items-center gap-1.5 mt-2 mb-1">
                        <Hospital className="h-3.5 w-3.5 shrink-0 text-slate-500" /> {doc.hospital}
                      </p>
                      
                      <p className="text-slate-400 flex items-center gap-1.5 mb-1">
                        <Award className="h-3.5 w-3.5 shrink-0 text-slate-500" /> {doc.experience} Years Experience
                      </p>

                      <p className="text-slate-400 flex items-center gap-1.5 mb-2">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-500" /> {doc.location}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-2 border-t border-white/5 pt-3">
                        <a
                          href={`tel:${doc.phoneNumber}`}
                          className="px-3.5 py-2 rounded-lg bg-slate-800 text-white font-semibold flex items-center gap-1.5 hover:bg-slate-700 transition-colors"
                        >
                          <Phone className="h-3.5 w-3.5" /> Call Clinic
                        </a>
                        <a
                          href={doc.googleMapsLocation}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2 rounded-lg bg-primary-500/10 border border-primary-500/25 text-primary-400 hover:bg-primary-500/20 font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <MapPin className="h-3.5 w-3.5" /> Locate
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Map Mockup side */}
            <div className="lg:col-span-5 relative hidden lg:block">
              <div className="rounded-2xl border border-white/10 glass overflow-hidden sticky top-6 shadow-2xl">
                <div className="p-4 bg-slate-900/60 border-b border-white/5 flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Interactive Locator Map</span>
                  <span className="text-[10px] text-primary-400 font-mono">Live GPS</span>
                </div>
                {/* Visual SVG Mockup map representation */}
                <div className="h-[400px] w-full bg-slate-950 relative flex items-center justify-center p-6 select-none overflow-hidden">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
                  <div className="absolute top-1/4 left-1/3 w-3.5 h-3.5 rounded-full bg-primary-500 glow-primary border-2 border-slate-900 animate-bounce" />
                  <div className="absolute top-1/2 right-1/4 w-3.5 h-3.5 rounded-full bg-primary-500 glow-primary border-2 border-slate-900 animate-bounce" style={{ animationDelay: '0.4s' }} />
                  <div className="absolute bottom-1/3 left-1/2 w-3.5 h-3.5 rounded-full bg-primary-500 glow-primary border-2 border-slate-900 animate-bounce" style={{ animationDelay: '0.8s' }} />
                  
                  {/* Current Position Marker */}
                  <div className="p-3 rounded-2xl glass border border-white/15 flex flex-col gap-1 items-center z-10 text-[10px]">
                    <MapPin className="h-5 w-5 text-emerald-400 fill-emerald-400/20" />
                    <span className="font-bold text-white">Your Position</span>
                    <span className="text-slate-500">Salt Lake Sector V</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};
