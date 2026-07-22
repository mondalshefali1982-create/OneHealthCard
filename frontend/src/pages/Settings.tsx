import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import {
  Lock, Settings as SettingsIcon, ShieldAlert, CheckCircle2,
  Trash2, Activity, CreditCard, Search, FileText, LogOut
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const Settings: React.FC = () => {
  const { user, logout, changePassword, deleteAccount } = useAuth();
  const navigate = useNavigate();

  // Password fields state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loadingPass, setLoadingPass] = useState(false);
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  // Delete account confirmation state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (newPassword !== confirmPassword) {
      setPassError('New passwords do not match.');
      return;
    }

    setLoadingPass(true);
    try {
      await changePassword({ currentPassword, newPassword });
      setPassSuccess('Password changed successfully.');
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
      navigate('/');
    } catch (err: any) {
      alert(err.message || 'Account deletion failed.');
      setLoadingDelete(false);
    }
  };

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
            {user?.role === 'patient' ? (
              <>
                <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 text-sm font-semibold transition-all">
                  <CreditCard className="h-4 w-4" /> My Health Card
                </Link>
                <Link to="/doctor-finder" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 text-sm font-semibold transition-all">
                  <Search className="h-4 w-4" /> Find Doctors
                </Link>
                <Link to="/report-scanner" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 text-sm font-semibold transition-all">
                  <FileText className="h-4 w-4" /> AI Report Scanner
                </Link>
              </>
            ) : (
              <Link to="/doctor-portal" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 text-sm font-semibold transition-all">
                <User className="h-4 w-4" /> Patient Records
              </Link>
            )}
            <Link to="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-semibold transition-all">
              <SettingsIcon className="h-4 w-4" /> Account Settings
            </Link>
          </nav>
        </div>

        <button onClick={logout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 text-sm font-semibold transition-all border border-transparent mt-8">
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 p-6 md:p-8 max-w-3xl mx-auto w-full overflow-y-auto">
        <div className="text-left flex flex-col gap-8">
          
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-primary-400 font-sans">PREFERENCES</span>
            <h1 className="text-3xl font-extrabold text-white mt-1 mb-0">Account Settings</h1>
            <p className="text-slate-400 text-sm">Update clinical profile permissions, edit passwords, and manage credentials.</p>
          </div>

          {/* Password Change Form */}
          <div className="p-6 rounded-2xl glass-card border border-white/10 shadow-lg flex flex-col gap-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="h-4.5 w-4.5 text-primary-400" /> Change Password
            </h3>

            <AnimatePresence>
              {passError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex gap-2.5 items-center"
                >
                  <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
                  <span>{passError}</span>
                </motion.div>
              )}

              {passSuccess && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-xs flex gap-2.5 items-center"
                >
                  <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
                  <span>{passSuccess}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handlePasswordChange} className="flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold text-slate-400">Current Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="py-2.5 px-3 rounded-xl glass-input text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold text-slate-400">New Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="py-2.5 px-3 rounded-xl glass-input text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold text-slate-400">Confirm New Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="py-2.5 px-3 rounded-xl glass-input text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={loadingPass}
                className="py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 mt-2 w-fit px-6 active:scale-95"
              >
                {loadingPass ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Save Password'}
              </button>
            </form>
          </div>

          {/* Delete Account Panel */}
          <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/10 flex flex-col gap-4">
            <h3 className="text-base font-bold text-rose-400 flex items-center gap-2">
              <Trash2 className="h-4.5 w-4.5" /> Danger Zone
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed m-0">
              Permanently delete your account and remove all related medical health profiles, histories, emergency contacts, prescriptions, and analyzed reports. This action cannot be undone.
            </p>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="py-2.5 px-6 rounded-xl bg-rose-500/15 border border-rose-500/25 text-rose-400 hover:bg-rose-500/25 transition-all text-xs font-semibold w-fit active:scale-95"
              >
                Delete My Account
              </button>
            ) : (
              <div className="flex flex-col gap-3 mt-2 border-t border-rose-500/10 pt-4 text-xs">
                <p className="text-white font-bold m-0">Are you absolutely sure you want to delete this account?</p>
                <div className="flex gap-3">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={loadingDelete}
                    className="py-2 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all"
                  >
                    {loadingDelete ? 'Deleting...' : 'Yes, Delete Permanent'}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="py-2 px-4 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};
