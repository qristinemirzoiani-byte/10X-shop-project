    import { NavLink, useNavigate } from 'react-router';
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
        <div className="flex items-center gap-2 pl-2 border-l border-slate-700/50">
            <NavLink
            to="/profile"
            className={({ isActive }) =>
                `h-[34px] flex items-center gap-2 px-3.5 rounded-xl border transition cursor-pointer ${
                isActive
                    ? 'bg-pink-500/20 text-pink-300 border-pink-400/50 shadow-[0_0_15px_rgba(244,63,94,0.25)] font-bold'
                    : 'bg-black/40 hover:bg-black/60 border-slate-700/60 text-slate-200 hover:border-pink-500'
                }`
            }
            >
            <User size={16} className="text-pink-400" />
            <span className="text-xs font-bold text-white max-w-28 truncate">
                {user.username}
            </span>
            </NavLink>

            <button
            type="button"
            onClick={handleLogout}
            className="h-[34px] flex items-center gap-1.5 px-3.5 text-xs font-semibold text-slate-300 hover:text-rose-400 bg-black/40 hover:bg-rose-950/40 border border-slate-700/50 rounded-xl transition cursor-pointer shadow-sm"
            title="Log Out"
            >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
            </button>
        </div>
        );
    }

    return (
        <NavLink
        to="/login"
        className={({ isActive }) =>
            `h-10 flex items-center gap-2 px-5 text-xs font-bold text-white rounded-xl border transition shadow-[0_0_15px_rgba(244,63,94,0.12)] active:scale-95 cursor-pointer ${
            isActive
                ? 'bg-pink-500/40 border-pink-300 shadow-[0_0_20px_rgba(244,63,94,0.35)]'
                : 'bg-pink-500/25 hover:bg-pink-500/35 border-pink-400/50'
            }`
        }
        >
        <LogIn size={16} />
        <span>Login</span>
        </NavLink>
    );
}

export default AuthActions;