import React, { useState } from 'react';
import { User, Save } from 'lucide-react';
import type { AuthUser } from '../contexts/AuthContext';
import { isValidEmail, isValidPhone } from '../utils/validation';

interface ProfileFormProps {
    user: AuthUser;
    onSave: (details: Partial<AuthUser>) => void;
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

    export function ProfileForm({ user, onSave, showToast }: ProfileFormProps) {
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

        onSave({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        });

        showToast('Profile updated successfully ✓', 'success');
};

    return (
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
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition active:scale-95 cursor-pointer"
            >
            <Save className="w-4 h-4" />
            Save Changes
            </button>
        </form>
        </div>
    );
}

export default ProfileForm;