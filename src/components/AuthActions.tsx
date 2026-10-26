    import { Link, useNavigate } from 'react-router';
    import { LogIn, LogOut, User } from 'lucide-react';
    import { useAuth } from '../contexts/AuthContext';

    export function AuthActions() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (user.isLoggedIn) {
        return (
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <Link 
            to="/profile" 
            className="h-10 flex items-center gap-2 px-3.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl hover:border-pink-500 transition"
            >
            <User size={16} className="text-pink-600 dark:text-pink-400" />
            <span className="text-xs font-bold text-slate-800 dark:text-white max-w-28 truncate">
                {user.username}
            </span>
            </Link>

            <button
            type="button"
            onClick={handleLogout}
            className="h-10 flex items-center gap-1.5 px-3.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition cursor-pointer"
            title="Log Out"
            >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
            </button>
        </div>
        );
    }

    return (
        <Link
        to="/login"
        className="h-10 flex items-center gap-2 px-5 text-xs font-bold text-white bg-linear-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 rounded-xl transition shadow-lg shadow-pink-600/20 active:scale-95 cursor-pointer"
        >
        <LogIn size={16} />
        <span>Login</span>
        </Link>
    );
}