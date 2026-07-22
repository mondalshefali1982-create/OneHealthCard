import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import {
  Settings as SettingsIcon, Key, Trash2, ShieldAlert, CheckCircle2,
  CreditCard, Search, FileText, LogOut, Activity, Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const Settings: React.FC = () => {
  const { user, changePassword, deleteAccount, logout } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loadingPass, setLoadingPass] = useState(false);
  const [passSuccess, setPassSuccess] = useState('');
  const [passError, setPassError] = useState('');

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassSuccess('');
    setPassError('');

    if (newPassword !== confirmPassword) {
      setPassError('New passwords do not match.');
      return;
    }

    setLoadingPass(true);
    try {
      await changePassword({ currentPassword, newPassword });
      setPassSuccess('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPassError(err.message || 'Failed to update password.');
    } finally {
      setLoadingPass(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoadingDelete(true);
    try {
      await deleteAccount();
    } catch (err: any) {
      alert(err.message || 'Failed to delete account.');
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row relative text-left">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-6 flex flex-col justify-between shrink-0 shadow-sm">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-600 rounded-xl shadow-md text-white">
              <Activity className="h-6 w-6 animate-pulse-heart" />
            </div>
            <div>
              <span className="text-lg font-extrabold text-slate-900 tracking-tight block">OneHealthCard</span>
              <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest block">PATIENT PORTAL</span>
            </div>
          </div>

          <nav className="flex flex-col gap-1.5">
            <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-sm font-semibold transition-all">
              <CreditCard className="h-4.5 w-4.5 text-slate-400" /> My Health Card
            </Link>
            <Link to="/doctor-finder" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-sm font-semibold transition-all">
              <Search className="h-4.5 w-4.5 text-slate-400" /> Find Doctors
            </Link>
            <Link to="/report-scanner" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-sm font-semibold transition-all">
              <FileText className="h-4.5 w-4.5 text-slate-400" /> AI Report Scanner
            </Link>
            <Link to="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 text-sm font-bold shadow-sm">
              <SettingsIcon className="h-4.5 w-4.5 text-sky-600" /> Account Settings
            </Link>
          </nav>
        </div>

        <button onClick={logout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 text-sm font-semibold transition-all border border-transparent mt-8">
          <LogOut className="h-4.5 w-4.5" /> Sign Out
        </button>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 p-6 md:p-8 max-w-4xl mx-auto w-full overflow-y-auto">
        <div className="flex flex-col gap-8">
          
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-sky-600 font-mono">SECURITY & PRIVACY</span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1 mb-0">Account Settings</h1>
            <p className="text-slate-500 text-sm mt-1">Manage password credentials and account data privacy settings.</p>
          </div>

          {/* Change Password Card */}
          <div className="rounded-3xl clinical-card border-slate-200 p-6 md:p-8 shadow-md bg-white flex flex-col gap-6">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
              <div className="p-2.5 bg-sky-50 rounded-xl border border-sky-200">
                <Key className="h-5 w-5 text-sky-600" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 m-0">Change Password</h3>
                <p className="text-xs text-slate-500 m-0">Update your account security password.</p>
              </div>
            </div>

            {passSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> {passSuccess}
              </div>
            )}

            {passError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-red-600" /> {passError}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-sky-600" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl clinical-input text-sm text-slate-900 font-extrabold placeholder:text-slate-400 bg-white"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-sky-600" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl clinical-input text-sm text-slate-900 font-extrabold placeholder:text-slate-400 bg-white"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-sky-600" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl clinical-input text-sm text-slate-900 font-extrabold placeholder:text-slate-400 bg-white"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loadingPass}
                className="w-fit mt-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-extrabold rounded-xl shadow-md text-xs flex items-center gap-2"
              >
                {loadingPass ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Update Password'}
              </button>
            </form>
          </div>

          {/* Delete Account Card */}
          <div className="rounded-3xl clinical-card border-red-200 p-6 md:p-8 shadow-md bg-white flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-50 rounded-xl border border-red-200">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 m-0">Danger Zone</h3>
                <p className="text-xs text-slate-500 m-0">Permanently delete your account and remove all medical cards from MongoDB.</p>
              </div>
            </div>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-fit px-5 py-2.5 bg-red-50 border border-red-200 text-red-700 font-extrabold rounded-xl text-xs hover:bg-red-100 transition-all"
            >
              Delete My Account
            </button>
          </div>

        </div>
      </main>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-3xl clinical-card border-red-200 p-6 text-left relative bg-white shadow-2xl flex flex-col gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-50 rounded-2xl border border-red-200">
                  <ShieldAlert className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 m-0">Confirm Account Deletion</h3>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed m-0">
                Are you sure you want to permanently delete your account? This action cannot be undone and all your health card data will be erased.
              </p>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-200 border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={loadingDelete}
                  className="px-5 py-2 bg-red-600 text-white font-extrabold rounded-xl text-xs hover:bg-red-700 shadow-md flex items-center gap-2"
                >
                  {loadingDelete ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Permanently Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
