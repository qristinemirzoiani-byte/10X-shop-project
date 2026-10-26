    import { useState } from 'react';
    import { useNavigate, useLocation, Link } from 'react-router';
    import { useFormik } from 'formik';
    import * as Yup from 'yup';
    import { LogIn, UserPlus, KeyRound } from 'lucide-react';
    import { useAuth } from '../contexts/AuthContext';
    import { Button } from '../components/Button';
    import { FormField } from '../components/FormField';
    import { Logo } from '../components/Logo';

    // Dynamic Validation Schema based on mode
    const getValidationSchema = (isSignUp: boolean) => {
    return Yup.object({
        username: Yup.string().trim().required('Username is required'),
        email: isSignUp
        ? Yup.string().email('Invalid email format').required('Email is required')
        : Yup.string().notRequired(),
        password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
    });
    };

    export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // State to toggle between Login and Sign Up mode
    const [isSignUp, setIsSignUp] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [forgotMessage, setForgotMessage] = useState<string | null>(null);

    const from = (location.state as { from?: string })?.from || '/';

    const formik = useFormik({
        initialValues: {
        username: '',
        email: '',
        password: '',
        },
        // Pass current isSignUp state to the validation function
        validationSchema: getValidationSchema(isSignUp),
        onSubmit: (values) => {
        setIsSubmitting(true);
        setTimeout(() => {
            login(values.username);
            setIsSubmitting(false);
            navigate(from, { replace: true });
        }, 400);
        },
    });

    const handleForgotPassword = () => {
        const userVal = formik.values.username.trim();
        setForgotMessage(
        userVal
            ? `Reset link sent for "${userVal}"! (Demo password: emilyspass)`
            : 'Password reset link requested. (Demo login: emilys / emilyspass)'
        );
    };

    const toggleMode = () => {
        setIsSignUp((prev) => !prev);
        setForgotMessage(null);
    };

    return (
        <div className="relative min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-[#0B0F19] text-slate-100 overflow-hidden">
        {/* Background Watermark */}
        <div
            aria-hidden="true"
            className="pointer-events-none select-none absolute inset-0 flex items-center justify-center font-black text-[18vw] text-pink-950/15 tracking-tighter"
        >
            10X SHOP
        </div>

        {/* Main Login/Register Card */}
        <div className="relative z-10 w-full max-w-md bg-[#0f172a] border border-slate-800/80 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
            {/* Header Logo */}
            <div className="flex flex-col items-center text-center space-y-2">
            <Link
                to="/"
                title="Go to 10X Shop Catalog"
                className="transition-transform hover:scale-105 cursor-pointer"
            >
                <Logo />
            </Link>
            <p className="text-xs text-slate-400 font-medium">
                {isSignUp ? 'Create a new account' : 'Sign in to your account'}
            </p>
            </div>

            {/* Forgot Password Notice */}
            {forgotMessage && (
            <div className="p-3.5 rounded-2xl bg-pink-950/40 border border-pink-500/30 text-pink-200 text-xs flex items-start gap-2.5">
                <KeyRound className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                <p className="font-semibold text-pink-300">Password Recovery</p>
                <p className="text-[11px] text-slate-300 mt-0.5">{forgotMessage}</p>
                </div>
                <button
                type="button"
                onClick={() => setForgotMessage(null)}
                className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
                >
                ✕
                </button>
            </div>
            )}

            {/* Form */}
            <form onSubmit={formik.handleSubmit} className="space-y-4">
            {/* Username Field */}
            <FormField
                label="Username"
                autoComplete="username"
                required
                placeholder="Enter username"
                {...formik.getFieldProps('username')}
                error={formik.touched.username && formik.errors.username ? formik.errors.username : undefined}
            />

            {/* Email Field - Shows only in Sign Up mode */}
            {isSignUp && (
                <FormField
                label="Email Address"
                required
                type="email"
                placeholder="you@example.com"
                {...formik.getFieldProps('email')}
                error={formik.touched.email && formik.errors.email ? formik.errors.email : undefined}
                />
            )}

            {/* Password Field */}
            <div>
                <FormField
                label="Password (min. 6 chars)"
                required
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                {...formik.getFieldProps('password')}
                error={formik.touched.password && formik.errors.password ? formik.errors.password : undefined}
                />
                {!isSignUp && (
                <div className="text-right mt-1.5">
                    <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[11px] font-medium text-pink-400 hover:text-pink-300 hover:underline cursor-pointer"
                    >
                    Forgot password?
                    </button>
                </div>
                )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
                <Button
                type="submit"
                fullWidth
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2"
                >
                {isSignUp ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                <span>
                    {isSubmitting
                    ? isSignUp
                        ? 'Creating account...'
                        : 'Logging in...'
                    : isSignUp
                    ? 'Sign Up'
                    : 'Log In'}
                </span>
                </Button>
            </div>
            </form>

            {/* Toggle Mode Footer */}
            <div className="pt-2 text-center text-xs text-slate-400">
            <span>{isSignUp ? 'Already have an account? ' : "Don't have an account? "}</span>
            <button
                type="button"
                onClick={toggleMode}
                className="font-semibold text-pink-400 hover:underline cursor-pointer bg-transparent border-none p-0"
            >
                {isSignUp ? 'Log In' : 'Sign Up'}
            </button>
            </div>
        </div>
        </div>
    );
}