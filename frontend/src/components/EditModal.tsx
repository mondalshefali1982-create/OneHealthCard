import React, { useState, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Plus, Loader2 } from 'lucide-react';
import api from '../services/api';
import { useToast } from './Toast';

interface EditModalProps {
  patient: any;
  onClose: () => void;
  onSuccess: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ patient, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState('vitals');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    bloodGroup: patient?.bloodGroup || '',
    weight: patient?.weight || '',
    height: patient?.height || '',
    dob: patient?.dob || '',
    gender: patient?.gender || '',
    allergies: patient?.allergies || [],
    conditions: patient?.conditions || [],
    medications: patient?.medications || [],
    emergencyContact: {
      name: patient?.emergencyContact?.name || '',
      relationship: patient?.emergencyContact?.relationship || '',
      phone: patient?.emergencyContact?.phone || '',
    }
  });

  const [tempInput, setTempInput] = useState('');

  const handleArrayAdd = (field: 'allergies' | 'conditions' | 'medications', e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tempInput.trim()) {
      e.preventDefault();
      if (!formData[field].includes(tempInput.trim())) {
        setFormData(prev => ({ ...prev, [field]: [...prev[field], tempInput.trim()] }));
      }
      setTempInput('');
    }
  };

  const removeArrayItem = (field: 'allergies' | 'conditions' | 'medications', index: number) => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      newArray.splice(index, 1);
      return { ...prev, [field]: newArray };
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put('/patient/profile', {
        bloodGroup: formData.bloodGroup,
        weight: formData.weight,
        height: formData.height,
        dob: formData.dob,
        gender: formData.gender,
        allergies: formData.allergies,
        conditions: formData.conditions,
        medications: formData.medications,
      });

      await api.put('/patient/emergency-contact', formData.emergencyContact);

      showToast('Profile updated successfully', 'success');
      onSuccess();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'vitals', label: 'Vitals & Info' },
    { id: 'medical', label: 'Medical History' },
    { id: 'emergency', label: 'Emergency Contact' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Edit Health Profile</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b border-slate-100 px-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50 custom-scrollbar">
          {activeTab === 'vitals' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Blood Group</label>
                <select value={formData.bloodGroup} onChange={e => setFormData({...formData, bloodGroup: e.target.value})} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none">
                  <option value="">Select...</option>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none">
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
                <input type="date" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Weight (kg)</label>
                <input type="number" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" placeholder="e.g. 70" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Height (cm)</label>
                <input type="number" value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" placeholder="e.g. 175" />
              </div>
            </div>
          )}

          {activeTab === 'medical' && (
            <div className="space-y-6">
              {['allergies', 'conditions', 'medications'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-slate-700 mb-1 capitalize">{field}</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData[field as 'allergies' | 'conditions' | 'medications'].map((item: string, idx: number) => (
                      <span key={idx} className="flex items-center gap-1 px-3 py-1 bg-slate-200 text-slate-700 rounded-full text-sm">
                        {item}
                        <button onClick={() => removeArrayItem(field as any, idx)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={tempInput}
                    onChange={e => setTempInput(e.target.value)}
                    onKeyDown={e => handleArrayAdd(field as any, e)}
                    onFocus={() => setTempInput('')} // simple way to avoid cross-contamination
                    placeholder="Type and press Enter to add..."
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                  <p className="text-xs text-slate-500 mt-1">Press Enter to add. Only use for this specific field.</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'emergency' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contact Name</label>
                <input type="text" value={formData.emergencyContact.name} onChange={e => setFormData({ ...formData, emergencyContact: { ...formData.emergencyContact, name: e.target.value } })} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Relationship</label>
                <input type="text" value={formData.emergencyContact.relationship} onChange={e => setFormData({ ...formData, emergencyContact: { ...formData.emergencyContact, relationship: e.target.value } })} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" placeholder="e.g. Spouse, Parent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                <input type="tel" value={formData.emergencyContact.phone} onChange={e => setFormData({ ...formData, emergencyContact: { ...formData.emergencyContact, phone: e.target.value } })} className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-white">
          <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-medium">Cancel</button>
          <button onClick={handleSave} disabled={loading} className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2 shadow-md shadow-primary-500/20">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default EditModal;
