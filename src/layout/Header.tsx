    import { NavLink, Link } from 'react-router';
    import { ShoppingCart, Sun, Moon, Package } from 'lucide-react';
    import { useAuth } from '../contexts/AuthContext';
    import { useTheme } from '../contexts/ThemeContext';
    import { Logo } from '../components/Logo';
    import { AuthActions } from '../components/AuthActions';
    import { SearchBar } from '../components/SearchBar';

    export function Header() {
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const cartCount = 0;

    return (
        <header className="sticky top-0 z-40 bg-white/35 dark:bg-[#0B0F19]/35 backdrop-blur-xl border-b border-slate-200/80 dark:border-pink-500/15 transition-colors">
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
                    `px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                        isActive
                        ? 'bg-pink-600/20 text-white font-bold border border-pink-500/50 shadow-md shadow-pink-600/20'
                        : 'text-slate-300 hover:text-white bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/50'
                    }`
                    }
                >
                    Catalog
                </NavLink>

                {/* Search Bar */}
                <div className="flex-1 max-w-md mx-2 sm:mx-4 hidden sm:block">
                    <SearchBar />
                </div>

                {user?.isLoggedIn && (
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
                className="h-10 w-10 text-slate-600 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 bg-slate-100/70 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl transition cursor-pointer flex items-center justify-center shadow-xs backdrop-blur-md"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                {theme === 'dark' ? <Sun size={18} className="text-pink-400" /> : <Moon size={18} />}
                </button>

                {/* Cart Link with Badge */}
                <NavLink
                to="/cart"
                className={({ isActive }) =>
                    `relative h-10 px-4 gap-2 rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center text-xs font-semibold ${
                    isActive
                        ? 'bg-pink-600/20 text-white font-bold border border-pink-500/50 shadow-md shadow-pink-600/20'
                        : 'text-slate-300 hover:text-white bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/50'
                    }`
                }
                title="View Cart"
                >
                <ShoppingCart size={16} />
                <span>Cart</span>
                {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-pink-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg shadow-pink-600/40">
                    {cartCount}
                    </span>
                )}
                </NavLink>

                {/* Auth Actions Component */}
                <AuthActions />
            </div>
            </div>
        </div>
        </header>
    );
}