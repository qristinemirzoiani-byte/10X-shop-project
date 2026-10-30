    import React, { useState } from 'react';
    import { ArrowRight } from 'lucide-react';
    import type { ShippingInfo } from '../types/order';
    import { isValidEmail, isValidPhone } from '../utils/validation';
    import { formatPrice } from '../utils/format';

    interface FormErrors {
    fullName?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    }

    interface CheckoutFormProps {
    initialData: ShippingInfo;
    totalPrice: number;
    isSubmitting: boolean;
    onSubmit: (formData: ShippingInfo) => void;
    }

    const countries = ['Georgia', 'United States', 'Germany', 'United Kingdom', 'France', 'Poland'];

    export function CheckoutForm({ initialData, totalPrice, isSubmitting, onSubmit }: CheckoutFormProps) {
    const [formData, setFormData] = useState<ShippingInfo>(initialData);
    const [errors, setErrors] = useState<FormErrors>({});

    const validate = (): boolean => {
        const errs: FormErrors = {};

        if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
        errs.fullName = 'Full name must be at least 3 characters';
        }

        if (!formData.email.trim() || !isValidEmail(formData.email)) {
        errs.email = 'Please enter a valid email address';
        }

        if (!formData.phone?.trim() || !isValidPhone(formData.phone)) {
        errs.phone = 'Please enter a valid phone number';
        }

        if (!formData.address.trim() || formData.address.trim().length < 5) {
        errs.address = 'Address must be at least 5 characters';
        }

        if (!formData.city.trim()) {
        errs.city = 'City is required';
        }

        const postalClean = formData.postalCode?.trim() || '';
        if (!postalClean || postalClean.length < 4 || postalClean.length > 10) {
        errs.postalCode = 'Postal code must be 4-10 digits';
        }

        if (!formData.country?.trim()) {
        errs.country = 'Please select a country';
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleInputChange = (field: keyof ShippingInfo, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
        onSubmit(formData);
        }
    };

    return (
        <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6"
        >
        <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Shipping & Contact Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name *
            </label>
            <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="e.g. John Doe"
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                errors.fullName
                    ? 'border-rose-500 focus:border-rose-500'
                    : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
                }`}
            />
            {errors.fullName && (
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.fullName}</p>
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
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="e.g. john@example.com"
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
                Phone Number * (9-15 digits)
            </label>
            <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="e.g. +995555123456"
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

            {/* Address */}
            <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Delivery Address *
            </label>
            <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Street name, building, apartment"
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                errors.address
                    ? 'border-rose-500 focus:border-rose-500'
                    : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
                }`}
            />
            {errors.address && (
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.address}</p>
            )}
            </div>

            {/* City */}
            <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                City *
            </label>
            <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="e.g. Tbilisi"
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                errors.city
                    ? 'border-rose-500 focus:border-rose-500'
                    : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
                }`}
            />
            {errors.city && (
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.city}</p>
            )}
            </div>

            {/* Postal Code */}
            <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Postal Code * (4-10 digits)
            </label>
            <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                placeholder="e.g. 0179"
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                errors.postalCode
                    ? 'border-rose-500 focus:border-rose-500'
                    : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
                }`}
            />
            {errors.postalCode && (
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.postalCode}</p>
            )}
            </div>

            {/* Country */}
            <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Country *
            </label>
            <select
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
                {countries.map((c) => (
                <option key={c} value={c}>
                    {c}
                </option>
                ))}
            </select>
            {errors.country && (
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.country}</p>
            )}
            </div>
        </div>

        <div className="pt-4">
            <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition active:scale-[0.99] cursor-pointer"
            >
            {isSubmitting ? (
                <span>Processing Order...</span>
            ) : (
                <>
                <span>Place Order · {formatPrice(totalPrice)}</span>
                <ArrowRight className="w-4 h-4" />
                </>
            )}
            </button>
        </div>
        </form>
    );
}

export default CheckoutForm;