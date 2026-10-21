    import React from 'react';

    
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
    return (
        <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            {label} {required && <span className="text-rose-500 font-bold">*</span>}
        </label>
        
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-700 bg-slate-800/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
        />

        {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
        </div>
    );
}