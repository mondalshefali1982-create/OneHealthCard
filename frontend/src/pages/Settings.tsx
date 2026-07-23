import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Trash2, Save, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/Toast';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Profile updated successfully (Mock)', 'success');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    showToast('Password changed successfully (Mock)', 'success');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you absolutely sure you want to delete your account and all associated health data? This cannot be undone.')) {
      showToast('Account deletion requested', 'info');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Account Settings</h1>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 md:p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-sky-200 to-primary-300 text-primary-800 flex items-center justify-center text-2xl font-bold">
            {user?.name?.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{user?.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm bg-slate-100 text-slate-600 px-2 py-0.5 rounded capitalize">{user?.role}</span>
              {user?.healthId && (
                <span className="text-sm bg-primary-50 text-primary-700 px-2 py-0.5 rounded font-mono border border-primary-100">{user.healthId}</span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Profile Form */}
          <form onSubmit={handleUpdateProfile}>
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"><User className="w-5 h-5 text-primary-500" /> Personal Info</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input type="email" value={user?.email} disabled className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed" />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button type="submit" className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </form>

          <hr className="border-slate-100" />

          {/* Password Form */}
          <form onSubmit={handleChangePassword}>
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"><Lock className="w-5 h-5 text-primary-500" /> Security</h3>
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
            </div>
            <div className="mt-4">
              <button type="submit" className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-sm font-medium transition-colors">
                Update Password
              </button>
            </div>
          </form>

          <hr className="border-slate-100" />

          {/* Danger Zone */}
          <div>
            <h3 className="text-lg font-semibold text-red-600 mb-4 flex items-center gap-2"><Shield className="w-5 h-5" /> Danger Zone</h3>
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-red-800">Delete Account</p>
                <p className="text-sm text-red-600 mt-1">Permanently remove your account and all health records.</p>
              </div>
              <button onClick={handleDeleteAccount} className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 shrink-0">
                <Trash2 className="w-4 h-4" /> Delete Account
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
