    import React from 'react';

    // Props for the reusable Button component
    interface ButtonProps {
    children: React.ReactNode; // Button text or inside elements
    type?: 'button' | 'submit' | 'reset'; // Button behavior type
    onClick?: () => void; 
    fullWidth?: boolean; // If true, stretches across 100% width
    }

    export function Button({
    children,
    type = 'button',
    onClick,
    fullWidth = false,
    }: ButtonProps) {
    return (
        <button
        type={type}
        onClick={onClick}
        className={`py-3 px-6 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold rounded-xl transition shadow-lg shadow-pink-600/30 active:scale-95 ${
            fullWidth ? 'w-full' : ''
        }`}
        >
        {children}
        </button>
    );
}