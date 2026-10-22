    import React, { useState } from 'react';
    import { useAuth } from '../contexts/AuthContext';
    import { FormField } from '../components/FormField';
    import { Button } from '../components/Button';
    import { Logo } from '../components/Logo';

    export default function LoginPage() {
    const { login } = useAuth();

    // Mode: false = Login, true = Sign Up
    const [isSignUp, setIsSignUp] = useState(false);

    // Form input values
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Validation error states
    const [usernameError, setUsernameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    // Form submission handler
    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        let isValid = true;

        // Validate Username
        if (!username.trim()) {
        setUsernameError('Username is required');
        isValid = false;
        } else {
        setUsernameError('');
        }

        // Validate Email in Sign Up mode
        if (isSignUp) {
        if (!email.trim() || !email.includes('@')) {
            setEmailError('Please enter a valid email address');
            isValid = false;
        } else {
            setEmailError('');
        }
        }

        // Validate Password (min 6 characters)
        if (!password) {
        setPasswordError('Password is required');
        isValid = false;
        } else if (password.length < 6) {
        setPasswordError('Password must be at least 6 characters');
        isValid = false;
        } else {
        setPasswordError('');
        }

        if (isValid) {
        if (isSignUp) {
            alert(`Account created for ${username}! You can now log in.`);
            setIsSignUp(false);
        } else {
            login(username);
        }
        }
    };

    return (
        <div className="min-h-screen bg-[#07090e] flex items-center justify-center p-4 relative overflow-hidden font-sans select-none">
        
        {/* Background Animated Neon Watermark: 10X SHOP */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
            <span className="text-[18vw] font-black text-pink-500 tracking-tighter animate-pulse blur-[1px]">
            10X SHOP
            </span>
        </div>

        {/* Ambient Neon Glow Orbs */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Main Glassmorphic Card */}
        <div className="max-w-md w-full bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 space-y-6">
            
            {/* Header with Logo */}
            <div className="flex flex-col items-center text-center">
            <Logo />
            <p className="text-xs text-slate-400 mt-2">
                {isSignUp ? 'Create your new account' : 'Sign in to your account'}
            </p>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
                label="Username"
                value={username}
                placeholder="Enter username"
                error={usernameError}
                required
                onChange={(e) => setUsername(e.target.value)}
            />

            {isSignUp && (
                <FormField
                label="Email Address"
                type="email"
                value={email}
                placeholder="you@example.com"
                error={emailError}
                required
                onChange={(e) => setEmail(e.target.value)}
                />
            )}

            <FormField
                label="Password (min. 6 chars)"
                type="password"
                value={password}
                placeholder="••••••••"
                error={passwordError}
                required
                onChange={(e) => setPassword(e.target.value)}
            />

            {/* Forgot Password Link (Active only in Login mode) */}
            {!isSignUp && (
                <div className="flex justify-end">
                <button
                    type="button"
                    onClick={() => alert('Password reset instructions have been sent to your email!')}
                    className="text-xs text-pink-400 hover:text-pink-300 transition cursor-pointer"
                >
                    Forgot password?
                </button>
                </div>
            )}

            <Button type="submit" fullWidth>
                {isSignUp ? 'Create Account' : 'Log In'}
            </Button>
            </form>

            {/* Mode Toggle: Login vs Sign Up */}
            <div className="text-center pt-2 border-t border-slate-800/60">
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
                className="text-pink-400 hover:text-pink-300 font-bold underline ml-1 cursor-pointer"
                >
                {isSignUp ? 'Log In' : 'Sign Up'}
                </button>
            </p>
            </div>

        </div>
        </div>
    );
}