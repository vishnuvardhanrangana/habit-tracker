import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { User, Shield, Moon, Sun, Monitor, Download, Trash2, Key, Info } from 'lucide-react';

const Settings = () => {
  const { user, updateProfile } = useAuth();
  const { theme, changeTheme } = useTheme();
  const { showToast } = useToast();

  // Profile Editor State
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      showToast('Name cannot be empty', 'warning');
      return;
    }

    setProfileSaving(true);
    const res = await updateProfile(fullName.trim(), null, null);
    setProfileSaving(false);

    if (res.success) {
      showToast('Profile name updated successfully', 'success');
    } else {
      showToast(res.message || 'Failed to update name', 'error');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      showToast('All password fields are required', 'warning');
      return;
    }

    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters long', 'warning');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    setPasswordSaving(true);
    const res = await updateProfile(fullName, currentPassword, newPassword);
    setPasswordSaving(false);

    if (res.success) {
      showToast('Password changed successfully', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } else {
      showToast(res.message || 'Failed to change password', 'error');
    }
  };

  const handleExportData = async () => {
    try {
      const res = await api.get('/habits', { params: { includeArchived: true } });
      if (res.data.success) {
        const habitsData = res.data.data;
        
        // Batch fetch completions to pack complete historical backup
        const exportList = await Promise.all(habitsData.map(async (habit) => {
          const compsRes = await api.get(`/habits/${habit.id}/completions`);
          return {
            ...habit,
            completions: compsRes.data.success ? compsRes.data.data : []
          };
        }));

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportList, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `habit_flow_backup_${new Date().toISOString().slice(0,10)}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        showToast('Data exported successfully!', 'success');
      }
    } catch (err) {
      console.error("Export failed:", err);
      showToast('Failed to compile export data', 'error');
    }
  };

  const handleClearArchived = async () => {
    if (!window.confirm("Are you sure you want to permanently delete all archived habits? This will purge their history and cannot be undone.")) {
      return;
    }

    try {
      const res = await api.delete('/habits/archived');
      if (res.data.success) {
        showToast('Archived habits cleared permanently', 'success');
      }
    } catch (err) {
      console.error("Purge failed:", err);
      showToast('Failed to clear archived habits', 'error');
    }
  };

  const getJoinedDate = () => {
    if (!user?.createdAt) return 'Recent';
    return new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Manage your personal profile, appearance, and habit data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Navigation Sidebar */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-premium dark:shadow-premium-dark flex flex-col items-center text-center transition-colors duration-300">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-green-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-emerald-500/10 mb-4">
              {user?.fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">{user?.fullName}</h3>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">{user?.email}</p>
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 px-3 py-1 rounded-full mt-4 border border-slate-100 dark:border-slate-800">
              Joined {getJoinedDate()}
            </span>
          </div>
        </div>

        {/* Configurations Forms Container */}
        <div className="md:col-span-2 space-y-6">
          {/* Profile Details Form */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-premium dark:shadow-premium-dark space-y-4 transition-colors duration-300">
            <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800/50 pb-3 mb-2">
              <User className="w-5 h-5 text-emerald-650" />
              <h3 className="text-xs font-bold text-slate-450 dark:text-white uppercase tracking-wider">Profile Information</h3>
            </div>

            <form onSubmit={handleUpdateName} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-450 dark:text-slate-350 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email}
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/50 text-slate-400 dark:text-slate-600 focus:outline-none text-sm font-medium cursor-not-allowed"
                />
                <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-medium">
                  <Info className="w-3.5 h-3.5" />
                  Email updates require contact verification.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-455 dark:text-slate-350 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-950/20 focus:outline-none dark:text-white transition-all text-sm font-medium"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={profileSaving}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-5 rounded-xl transition-all text-xs disabled:opacity-50 active:scale-98 shadow-sm"
              >
                {profileSaving ? 'Saving...' : 'Save Profile'}
              </button>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-premium dark:shadow-premium-dark space-y-4 transition-colors duration-300">
            <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800/50 pb-3 mb-2">
              <Key className="w-5 h-5 text-emerald-650" />
              <h3 className="text-xs font-bold text-slate-450 dark:text-white uppercase tracking-wider">Change Password</h3>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-455 dark:text-slate-350 uppercase tracking-wider mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-950/20 focus:outline-none dark:text-white transition-all text-sm font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-455 dark:text-slate-350 uppercase tracking-wider mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-950/20 focus:outline-none dark:text-white transition-all text-sm font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-455 dark:text-slate-350 uppercase tracking-wider mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-950/20 focus:outline-none dark:text-white transition-all text-sm font-medium"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={passwordSaving}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-5 rounded-xl transition-all text-xs disabled:opacity-50 active:scale-98 shadow-sm"
              >
                {passwordSaving ? 'Updating...' : 'Change Password'}
              </button>
            </form>
          </div>

          {/* Theme Settings Panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-premium dark:shadow-premium-dark space-y-4 transition-colors duration-300">
            <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800/50 pb-3 mb-2">
              <Sun className="w-5 h-5 text-emerald-650" />
              <h3 className="text-xs font-bold text-slate-450 dark:text-white uppercase tracking-wider">Appearance</h3>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => changeTheme('light')}
                className={`p-4 border rounded-2xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-700 dark:text-emerald-450 font-bold scale-[1.02]'
                    : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-500 hover:bg-emerald-50/20 hover:text-emerald-750'
                }`}
              >
                <Sun className="w-5 h-5" />
                <span className="text-xs font-bold">Light</span>
              </button>

              <button
                onClick={() => changeTheme('dark')}
                className={`p-4 border rounded-2xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-700 dark:text-emerald-450 font-bold scale-[1.02]'
                    : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-500 hover:bg-emerald-50/20 hover:text-emerald-750'
                }`}
              >
                <Moon className="w-5 h-5" />
                <span className="text-xs font-bold">Dark</span>
              </button>

              <button
                onClick={() => changeTheme('system')}
                className={`p-4 border rounded-2xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                  theme === 'system'
                    ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-700 dark:text-emerald-450 font-bold scale-[1.02]'
                    : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-500 hover:bg-emerald-50/20 hover:text-emerald-750'
                }`}
              >
                <Monitor className="w-5 h-5" />
                <span className="text-xs font-bold">System</span>
              </button>
            </div>
          </div>

          {/* Data Backup / Export / Purge Section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-premium dark:shadow-premium-dark space-y-4 transition-colors duration-300">
            <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800/50 pb-3 mb-2">
              <Shield className="w-5 h-5 text-emerald-650" />
              <h3 className="text-xs font-bold text-slate-455 dark:text-white uppercase tracking-wider">Data & Security</h3>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-slate-100 dark:border-slate-800 rounded-2xl p-4 gap-4 bg-slate-50/30 dark:bg-slate-950/30">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Export Backups</h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 leading-snug">
                    Download a full copy of all your habits and day-to-day completion histories in JSON format.
                  </p>
                </div>
                <button
                  onClick={handleExportData}
                  className="inline-flex items-center justify-center space-x-2 bg-white dark:bg-slate-950 hover:bg-emerald-50/55 hover:text-emerald-750 hover:border-emerald-500 text-slate-700 dark:text-slate-300 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors border border-slate-250 dark:border-slate-750 flex-shrink-0 cursor-pointer active:scale-98"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Data</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-rose-100 dark:border-rose-900/30 rounded-2xl p-4 gap-4 bg-rose-50/10 dark:bg-rose-950/10">
                <div>
                  <h4 className="text-xs font-bold text-rose-650 dark:text-rose-400 uppercase tracking-wider">Purge Archived Data</h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 leading-snug">
                    Permanently delete all archived habits. This action is irreversible and purges complete stats records.
                  </p>
                </div>
                <button
                  onClick={handleClearArchived}
                  className="inline-flex items-center justify-center space-x-2 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex-shrink-0 shadow-md shadow-rose-600/10 cursor-pointer active:scale-98"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear Archives</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
