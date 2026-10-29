// pages/ProfilePage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
    User,
    Save,
    Moon,
    Sun,
    Trash2,
    LogOut,
    CheckCircle2,
    AlertCircle,
    PackageCheck,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import { STORAGE_KEYS } from '../models/StorageService';
import { isValidEmail, isValidPhone } from '../utils/validation';

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: user.firstName || user.username || '',
    lastName: user.lastName || '',
    email: user.email || '',
    phone: user.phone || '',
  });

  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  }>({});

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

  const validate = (): boolean => {
    const errs: typeof errors = {};

    if (!formData.firstName.trim() || formData.firstName.trim().length < 2) {
      errs.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName.trim() || formData.lastName.trim().length < 2) {
      errs.lastName = 'Last name must be at least 2 characters';
    }

    if (!formData.email.trim() || !isValidEmail(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }

    if (formData.phone.trim() && !isValidPhone(formData.phone)) {
      errs.phone = 'Please enter a valid phone number';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    updateProfile({
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
    });

    showToast('Profile updated successfully ✓', 'success');
  };

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

      {/* Account Overview Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-black text-xl flex items-center justify-center uppercase shadow-md shadow-indigo-600/20">
            {user.username.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <span>{user.username}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                Active Member
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {user.email || `${user.username}@example.com`}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 block">Total Orders</span>
          <span className="font-bold text-lg text-slate-900 dark:text-white">
            {orderCount}
          </span>
        </div>
      </div>

      {/* Personal Info Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <h3 className="font-bold text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          Personal Details
        </h3>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                First Name *
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => {
                  setFormData((p) => ({ ...p, firstName: e.target.value }));
                  if (errors.firstName) setErrors((p) => ({ ...p, firstName: undefined }));
                }}
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                  errors.firstName
                    ? 'border-rose-500 focus:border-rose-500'
                    : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
                }`}
              />
              {errors.firstName && (
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Last Name *
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => {
                  setFormData((p) => ({ ...p, lastName: e.target.value }));
                  if (errors.lastName) setErrors((p) => ({ ...p, lastName: undefined }));
                }}
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                  errors.lastName
                    ? 'border-rose-500 focus:border-rose-500'
                    : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
                }`}
              />
              {errors.lastName && (
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.lastName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData((p) => ({ ...p, email: e.target.value }));
                  if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                }}
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                  errors.email
                    ? 'border-rose-500 focus:border-rose-500'
                    : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
                }`}
              />
              {errors.email && (
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Phone Number (optional)
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => {
                  setFormData((p) => ({ ...p, phone: e.target.value }));
                  if (errors.phone) setErrors((p) => ({ ...p, phone: undefined }));
                }}
                placeholder="+995 555 12 34 56"
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                  errors.phone
                    ? 'border-rose-500 focus:border-rose-500'
                    : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
                }`}
              />
              {errors.phone && (
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.phone}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition active:scale-95"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </form>
      </div>

      {/* Preferences & Theme */}
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 transition"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            <span>Switch to {theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </div>

      {/* Danger Zone */}
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
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs font-bold transition shrink-0"
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
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold transition shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
