    import React, { useState } from 'react';

    export default function LoginPage() {
    // -------------------------------------------------------------
    // 1. STATE MANAGEMENT
    // -------------------------------------------------------------
    // Mode toggle: false = 'Login', true = 'Sign Up'
    const [isSignUp, setIsSignUp] = useState(false);

    // Controlled input values
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Validation error messages
    const [usernameError, setUsernameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    // -------------------------------------------------------------
    // 2. FORM VALIDATION & SUBMISSION LOGIC
    // -------------------------------------------------------------
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Prevent full page refresh
        let isValid = true;

        // Validate Username: required, non-empty after trim()
        if (!username.trim()) {
        setUsernameError('Username is required');
        isValid = false;
        } else {
        setUsernameError('');
        }

        // Validate Email: only required during Sign Up mode
        if (isSignUp) {
        if (!email.trim() || !email.includes('@')) {
            setEmailError('Please enter a valid email address');
            isValid = false;
        } else {
            setEmailError('');
        }
        }

        // Validate Password: required, minimum 6 characters
        if (!password) {
        setPasswordError('Password is required');
        isValid = false;
        } else if (password.length < 6) {
        setPasswordError('Password must be at least 6 characters');
        isValid = false;
        } else {
        setPasswordError('');
        }

        // Execute when validation passes
        if (isValid) {
        if (isSignUp) {
            alert(`Account created successfully for ${username}! You can now log in.`);
            setIsSignUp(false); // Switch back to login mode
        } else {
            alert(`Welcome back, ${username}! Login successful.`);
        }
        }
    };

    // -------------------------------------------------------------
    // 3. UI RENDERING (JSX with Tailwind CSS v4)
    // -------------------------------------------------------------
    return (
        // Main full-screen background with ambient neon glow
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
        
        {/* Decorative ambient background glows */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Glassmorphic card container */}
        <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 space-y-6">
            
            {/* 10X Vector Logo Header */}
            <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-2xl border border-slate-800 mb-3 bg-[#121212] flex items-center justify-center shadow-lg relative select-none">
                <div className="relative flex items-center justify-center">
                {/* Pink accent bar */}
                <div className="absolute bottom-0.5 left-2 right-0 h-3 bg-pink-600 rounded-xs" />
                {/* White 10X typography */}
                <span className="relative z-10 text-white font-black text-2xl tracking-tighter">
                    10x
                </span>
                </div>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">10X Shop</h1>
            <p className="text-xs text-slate-400 mt-1">
                {isSignUp ? 'Create your new account' : 'Sign in to your account'}
            </p>
            </div>

            {/* Interactive Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username Input Field */}
            <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Username <span className="text-rose-500 font-bold">*</span>
                </label>
                <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-700 bg-slate-800/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                />
                {usernameError && (
                <p className="text-xs text-rose-400 mt-1">{usernameError}</p>
                )}
            </div>

            {/* Email Input Field (Visible only in Sign Up mode) */}
            {isSignUp && (
                <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Email Address <span className="text-rose-500 font-bold">*</span>
                </label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-700 bg-slate-800/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                />
                {emailError && (
                    <p className="text-xs text-rose-400 mt-1">{emailError}</p>
                )}
                </div>
            )}

            {/* Password Input Field */}
            <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password <span className="text-rose-500 font-bold">*</span> (min. 6 characters)
                </label>
                <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-700 bg-slate-800/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                />
                {passwordError && (
                <p className="text-xs text-rose-400 mt-1">{passwordError}</p>
                )}
            </div>

            {/* Submit Action Button */}
            <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold rounded-xl transition shadow-lg shadow-pink-600/30 active:scale-[0.98]"
            >
                {isSignUp ? 'Create Account' : 'Log In'}
            </button>
            </form>

            {/* Toggle Mode: Switch between Login and Sign Up */}
            <div className="text-center pt-2 border-t border-slate-800/80">
            <p className="text-xs text-slate-400">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                type="button"
                onClick={() => {
                    setIsSignUp(!isSignUp);
                    setUsernameError('');
                    setPasswordError('');
                    setEmailError('');
                }}
                className="text-pink-400 hover:text-pink-300 font-bold underline transition ml-1"
                >
                {isSignUp ? 'Log In' : 'Sign Up'}
                </button>
            </p>
            </div>

            {/* Back to Catalog Link */}
            <div className="text-center">
            <button
                type="button"
                className="text-xs text-slate-500 hover:text-slate-300 transition"
            >
                ← Back to catalog
            </button>
            </div>

        </div>
        </div>
    );
}