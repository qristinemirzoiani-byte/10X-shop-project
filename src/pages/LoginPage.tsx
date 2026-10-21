    import React, { useState } from 'react';
    import { useAuth } from '../contexts/AuthContext';
    import { FormField } from '../components/FormField';
    import { Button } from '../components/Button';
    import { Logo } from '../components/Logo';

    export default function LoginPage() {
    const { login } = useAuth();

    // Mode: false = Login, true = Sign Up
    const [isSignUp, setIsSignUp] = useState(false);

    // Form input fields
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Form validation errors
    const [usernameError, setUsernameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    // Handle form submission and validation
    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        let isValid = true;

        // 1. Validate Username
        if (!username.trim()) {
        setUsernameError('Username is required');
        isValid = false;
        } else {
        setUsernameError('');
        }

        // 2. Validate Email (Sign Up only)
        if (isSignUp) {
        if (!email.trim() || !email.includes('@')) {
            setEmailError('Please enter a valid email address');
            isValid = false;
        } else {
            setEmailError('');
        }
        }

        // 3. Validate Password
        if (!password) {
        setPasswordError('Password is required');
        isValid = false;
        } else if (password.length < 6) {
        setPasswordError('Password must be at least 6 characters');
        isValid = false;
        } else {
        setPasswordError('');
        }

        // On successful validation
        if (isValid) {
        if (isSignUp) {
            alert(`Account created for ${username}! Please log in.`);
            setIsSignUp(false);
        } else {
            login(username);
        }
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        {/* Centered Glassmorphic Card */}
        <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
            
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
                label="Password"
                type="password"
                value={password}
                placeholder="••••••••"
                error={passwordError}
                required
                onChange={(e) => setPassword(e.target.value)}
            />

            {/* Reusable Submit Button */}
            <Button type="submit" fullWidth>
                {isSignUp ? 'Create Account' : 'Log In'}
            </Button>
            </form>

            {/* Toggle Login / Sign Up */}
            <div className="text-center pt-2 border-t border-slate-800">
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
                className="text-pink-400 hover:text-pink-300 font-bold underline ml-1"
                >
                {isSignUp ? 'Log In' : 'Sign Up'}
                </button>
            </p>
            </div>

        </div>
        </div>
    );
}