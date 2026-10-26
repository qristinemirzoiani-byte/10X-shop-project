    import React, { useState } from 'react';
    import { Eye, EyeOff } from 'lucide-react';

    
    interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    required?: boolean;
    }

    export function FormField({
    label,
    type = 'text',
    error,
    required = false,
    className = '',
    ...props 
    }: FormFieldProps) {
    // Password visibility toggle state
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordField = type === 'password';

    return (
        <div className="text-left">
        {/* Label and required asterisk */}
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            {label} {required && <span className="text-pink-500 font-bold">*</span>}
        </label>

        {/* Input container */}
        <div className="relative">
            <input
            type={isPasswordField && showPassword ? 'text' : type}
            className={`w-full px-4 py-2.5 text-sm rounded-xl border bg-slate-950/60 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-pink-500/50 transition-all duration-300 ${
                error
                ? 'border-rose-500/80 focus:border-rose-500'
                : 'border-slate-800/80 focus:border-pink-500/80'
            } ${isPasswordField ? 'pr-11' : ''} ${className}`}
            {...props} 
            />

            {/* Eye icon to toggle password visibility */}
            {isPasswordField && (
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
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