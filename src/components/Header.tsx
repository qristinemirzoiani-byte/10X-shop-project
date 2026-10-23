    import { NavLink, Link, useNavigate } from 'react-router';
    import { ShoppingCart, LogIn, LogOut, User, Sun, Moon, Package } from 'lucide-react';
    import { useAuth } from '../contexts/AuthContext';
    import { useTheme } from '../contexts/ThemeContext';
    import { Logo } from './Logo';

    export function Header() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const cartCount = 0;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
            
            {/* Left: Brand Logo & Navigation */}
            <div className="flex items-center gap-6">
                <Link to="/" className="cursor-pointer focus:outline-none">
                <Logo />
                </Link>

                <nav className="hidden sm:flex items-center gap-2">
                <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                    `px-3.5 py-2 text-xs font-semibold rounded-xl transition cursor-pointer ${
                        isActive
                        ? 'bg-pink-600/15 text-pink-600 dark:text-pink-400 font-bold border border-pink-500/30'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`
                    }
                >
                    Catalog
                </NavLink>

                {user.isLoggedIn && (
                    <NavLink
                    to="/orders"
                    className={({ isActive }) =>
                        `px-3.5 py-2 text-xs font-semibold rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                        isActive
                            ? 'bg-pink-600/15 text-pink-600 dark:text-pink-400 font-bold border border-pink-500/30'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        }`
                    }
                    >
                    <Package size={14} />
                    <span>Orders</span>
                    </NavLink>
                )}
                </nav>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
                {/* Theme Toggle Button (Light/Dark) */}
                <button
                type="button"
                onClick={toggleTheme}
                className="h-10 w-10 text-slate-600 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl transition cursor-pointer flex items-center justify-center shadow-sm"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                {theme === 'dark' ? <Sun size={18} className="text-pink-400" /> : <Moon size={18} />}
                </button>

                {/* Cart Link with Badge */}
                <NavLink
                to="/cart"
                className="relative h-10 w-10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl transition cursor-pointer flex items-center justify-center shadow-sm"
                title="View Cart"
                >
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-pink-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg shadow-pink-600/40">
                    {cartCount}
                    </span>
                )}
                </NavLink>

                {/* User Profile or Login */}
                {user.isLoggedIn ? (
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                    <div className="h-10 flex items-center gap-2 px-3.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl">
                    <User size={16} className="text-pink-600 dark:text-pink-400" />
                    <span className="text-xs font-bold text-slate-800 dark:text-white max-w-28 truncate">
                        {user.username}
                    </span>
                    </div>

                    <button
                    type="button"
                    onClick={handleLogout}
                    className="h-10 flex items-center gap-1.5 px-3.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 border border-transparent rounded-xl transition cursor-pointer"
                    title="Log Out"
                    >
                    <LogOut size={16} />
                    <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
                ) : (
                <Link
                    to="/login"
                    className="h-10 flex items-center gap-2 px-5 text-xs font-bold text-white bg-linear-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 rounded-xl transition shadow-lg shadow-pink-600/20 active:scale-95 cursor-pointer"
                >
                    <LogIn size={16} />
                    <span>Login</span>
                </Link>
                )}
            </div>

            </div> 
        </div>   
        </header>
    );
}