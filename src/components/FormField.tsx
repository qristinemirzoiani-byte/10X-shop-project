    import React, { useState } from 'react';
    import { Eye, EyeOff } from 'lucide-react';

    interface FormFieldProps {
    label: string;
    type?: string;
    value: string;
    placeholder?: string;
    error?: string;
    required?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    }

    export function FormField({
    label,
    type = 'text',
    value,
    placeholder,
    error,
    required = false,
    onChange,
    }: FormFieldProps) {
    // Password visibility toggle state
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordField = type === 'password';

    return (
        <div>
        {/* Label and required asterisk */}
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            {label} {required && <span className="text-pink-500 font-bold">*</span>}
        </label>

        {/* Input container with seamless background blending */}
        <div className="relative">
            <input
            type={isPasswordField && showPassword ? 'text' : type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-800/80 bg-slate-950/60 text-white placeholder-slate-600 focus:outline-none focus:border-pink-500/80 focus:ring-1 focus:ring-pink-500/50 transition-all duration-300"
            />

            {/* Eye icon to toggle password visibility */}
            {isPasswordField && (
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-pink-400 transition cursor-pointer p-1"
            >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            )}
        </div>

        {/* Validation error message */}
        {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
        </div>
    );
}