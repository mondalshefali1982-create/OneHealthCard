import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Search, MapPin, Star, Clock, Phone, Loader2, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

// Fix for default marker icons in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper component to change map view
const ChangeView = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

const DoctorFinder: React.FC = () => {
  const [city, setCity] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  
  // Default center (e.g. general view or based on user location later)
  const [mapCenter, setMapCenter] = useState<[number, number]>([20.5937, 78.9629]); // India center
  const [mapZoom, setMapZoom] = useState(5);

  const specialties = [
    'General Physician', 'Cardiologist', 'Dermatologist', 'Neurologist', 
    'Pediatrician', 'Orthopedic', 'Psychiatrist', 'Dentist'
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In a real app, this goes to backend: await api.get(`/doctors/search?city=${city}&specialty=${specialty}`)
      // Mocking for frontend demo since this requires specific geospatial data setup in backend
      setTimeout(() => {
        const mockDoctors = [
          { id: '1', name: 'Dr. Sarah Johnson', specialty: 'Cardiologist', hospital: 'City Heart Center', rating: 4.8, experience: 12, fee: '$150', lat: 28.6139, lng: 77.2090 }, // Delhi
          { id: '2', name: 'Dr. Michael Chen', specialty: 'General Physician', hospital: 'Metro Hospital', rating: 4.5, experience: 8, fee: '$80', lat: 28.5355, lng: 77.3910 }, // Noida
          { id: '3', name: 'Dr. Priya Sharma', specialty: 'Dermatologist', hospital: 'Skin Care Clinic', rating: 4.9, experience: 15, fee: '$120', lat: 19.0760, lng: 72.8777 }, // Mumbai
        ].filter(d => (!specialty || d.specialty === specialty));
        
        setDoctors(mockDoctors);
        if (mockDoctors.length > 0) {
          setMapCenter([mockDoctors[0].lat, mockDoctors[0].lng]);
          setMapZoom(12);
        }
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const focusDoctor = (doc: any) => {
    setSelectedDoctorId(doc.id);
    setMapCenter([doc.lat, doc.lng]);
    setMapZoom(14);
  };

  return (
    <div className="h-full flex flex-col -m-4 md:-m-8">
      {/* Search Bar Top */}
      <div className="glass border-b border-slate-200/50 p-4 shrink-0 z-10 relative">
        <form onSubmit={handleSearch} className="max-w-4xl mx-auto flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="City or ZIP code..." 
              value={city}
              onChange={e => setCity(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
            />
          </div>
          <div className="flex-1 relative">
            <select 
              value={specialty}
              onChange={e => setSpecialty(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 shadow-sm appearance-none"
            >
              <option value="">Any Specialty</option>
              {specialties.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <button type="submit" disabled={loading} className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors shadow-md flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            Find
          </button>
        </form>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Left Panel - Results */}
        <div className="w-full md:w-[40%] md:max-w-md bg-slate-50 border-r border-slate-200 overflow-y-auto custom-scrollbar flex flex-col z-10 h-[50vh] md:h-auto">
          <div className="p-4 border-b border-slate-200 bg-white sticky top-0 z-10 shadow-sm">
            <h2 className="font-bold text-slate-800">
              {doctors.length} Doctors found {city && `in ${city}`}
            </h2>
          </div>
          
          <div className="p-4 space-y-4">
            {doctors.length === 0 && !loading && (
              <div className="text-center p-8 text-slate-500">
                <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p>Search by city and specialty to find doctors near you.</p>
              </div>
            )}
            
            <AnimatePresence>
              {doctors.map(doc => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => focusDoctor(doc)}
                  className={`p-4 bg-white rounded-2xl border transition-all cursor-pointer hover:shadow-lg ${selectedDoctorId === doc.id ? 'border-primary-500 shadow-md ring-2 ring-primary-100' : 'border-slate-200'}`}
                >
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-200 to-primary-300 text-primary-800 font-bold flex items-center justify-center text-lg shrink-0">
                      {doc.name.split(' ')[1]?.[0] || doc.name[0]}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800 text-sm md:text-base">{doc.name}</h3>
                      <p className="text-xs text-primary-600 font-medium mb-1 bg-primary-50 inline-block px-2 py-0.5 rounded-full">{doc.specialty}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mb-2">
                        <MapPin className="w-3 h-3" /> {doc.hospital}
                      </p>
                      
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
                          <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" /> {doc.rating}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {doc.experience}y exp</span>
                        </div>
                        <span className="font-bold text-slate-800">{doc.fee}</span>
                      </div>
                      
                      <button className="w-full mt-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                        <Phone className="w-4 h-4" /> Book Appointment
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Panel - Map */}
        <div className="w-full md:w-[60%] flex-1 bg-slate-200 relative z-0 h-[50vh] md:h-auto">
          <MapContainer center={mapCenter} zoom={mapZoom} className="w-full h-full" zoomControl={false}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            <ChangeView center={mapCenter} zoom={mapZoom} />
            
            {doctors.map(doc => (
              <Marker 
                key={doc.id} 
                position={[doc.lat, doc.lng]}
                eventHandlers={{ click: () => focusDoctor(doc) }}
              >
                <Popup>
                  <div className="font-sans">
                    <strong className="block text-sm">{doc.name}</strong>
                    <span className="text-xs text-slate-500">{doc.specialty}</span>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default DoctorFinder;
