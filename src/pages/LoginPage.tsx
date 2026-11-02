    import { useState } from 'react';
    import { useNavigate, useLocation, Link } from 'react-router';
    import { useFormik } from 'formik';
    import * as Yup from 'yup';
    import { LogIn, UserPlus, KeyRound, ArrowLeft } from 'lucide-react';
    import { useAuth } from '../contexts/AuthContext';
    import { Button } from '../components/Button';
    import { FormField } from '../components/FormField';
    import { Logo } from '../components/Logo'; // <-- შემოტანილია კომპონენტიდან

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
        validateOnBlur: false,
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
        <div className="relative w-full min-h-[calc(100vh-140px)] flex flex-col justify-center items-center px-4 py-6 sm:py-8">
        {/* Background Watermark */}
        <div
            aria-hidden="true"
            className="pointer-events-none select-none absolute inset-0 flex items-center justify-center font-black text-[16vw] text-pink-500/5 dark:text-pink-950/15 tracking-tighter"
        >
            10X SHOP
        </div>

        {/* Main Login/Register Card */}
        <div className="relative z-10 w-full max-w-md bg-slate-900/90 dark:bg-[#0f172a]/95 border border-slate-700/60 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-5">
            
            {/* 1. ზედა მარცხენა ნავიგაცია — მხოლოდ Back to catalog */}
            <div className="pb-3 border-b border-slate-700/50 dark:border-slate-800/60">
            <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-pink-400 transition cursor-pointer"
            >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to catalog</span>
            </Link>
            </div>

            {/* 2. ცენტრალური Logo კომპონენტი — asLink={false}-ით (ლინკის როლი აღარ აქვს) */}
            <div className="flex flex-col items-center text-center space-y-1.5 pt-1">
            <Logo asLink={false} />
            <p className="text-xs text-slate-400 font-medium">
                {isSignUp ? 'Create a new account' : 'Sign in to your account'}
            </p>
            </div>

            {/* Forgot Password Notice */}
            {forgotMessage && (
            <div className="p-3 rounded-2xl bg-pink-950/40 border border-pink-500/30 text-pink-200 text-xs flex items-start gap-2.5">
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
            <form onSubmit={formik.handleSubmit} className="space-y-3.5">
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
                <div className="text-right mt-1">
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
            <div className="pt-1.5">
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
            <div className="pt-1 text-center text-xs text-slate-400">
            <span>{isSignUp ? 'Already have an account? ' : "Don't have an account? "}</span>
            <button
                type="button"
                onClick={toggleMode}
                className="font-semibold text-pink-400 hover:underline cursor-pointer bg-transparent border-none p-0 ml-1"
            >
                {isSignUp ? 'Log In' : 'Sign Up'}
            </button>
            </div>
        </div>
        </div>
    );
}