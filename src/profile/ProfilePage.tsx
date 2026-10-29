import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Moon, Sun, Trash2, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import { STORAGE_KEYS } from '../models/StorageService';
import { ProfileOverview } from '../profile/ProfileOverview';
import { ProfileForm } from '../profile/ProfileForm';

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [orderCount, setOrderCount] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.orders);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed.length;
      }
    } catch {
      // ignore
    }
    return 0;
  });

  const handleClearLocalData = () => {
    if (
      window.confirm(
        'Are you sure you want to clear your local cart, orders, and reviews? Your active session will be preserved.'
      )
    ) {
      try {
        localStorage.removeItem(STORAGE_KEYS.cart);
        localStorage.removeItem(STORAGE_KEYS.orders);
        localStorage.removeItem(STORAGE_KEYS.reviews);
        setOrderCount(0);
        showToast('Local cart, orders, and reviews cleared', 'info');
      } catch (e) {
        console.warn('Failed to clear local data:', e);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          User Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your account information and preferences
        </p>
      </div>

      {/* 1. Account Overview Component */}
      <ProfileOverview user={user} orderCount={orderCount} />

      {/* 2. Personal Details Form Component */}
      <ProfileForm user={user} onSave={updateProfile} showToast={showToast} />

      {/* 3. Preferences & Theme */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white">
          Appearance & Preferences
        </h3>

        <div className="flex items-center justify-between py-2">
          <div>
            <h4 className="font-semibold text-sm text-slate-900 dark:text-white">Theme Mode</h4>
            <p className="text-xs text-slate-500">Currently using {theme} mode</p>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 transition cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            <span>Switch to {theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </div>

      {/* 4. Danger Zone */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-rose-600 dark:text-rose-400">
          Account Actions & Storage
        </h3>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div>
            <h4 className="font-semibold text-sm text-slate-900 dark:text-white">Clear Local Data</h4>
            <p className="text-xs text-slate-500">
              Wipe locally stored cart items, simulated orders, and reviews. Keeps current login session.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClearLocalData}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs font-bold transition shrink-0 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Local Data
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div>
            <h4 className="font-semibold text-sm text-slate-900 dark:text-white">Sign Out</h4>
            <p className="text-xs text-slate-500">
              End your session and switch back to guest mode.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold transition shrink-0 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}