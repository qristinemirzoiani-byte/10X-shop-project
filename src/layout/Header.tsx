    // components/layout/Header.tsx
    import { useState } from 'react';
    import { Link, NavLink, useNavigate } from 'react-router';
    import {
    ShoppingCart,
    User,
    Moon,
    Sun,
    Menu,
    X,
    LogOut,
    PackageCheck,
    LogIn,
    } from 'lucide-react';
    import { useAuth } from '../contexts/AuthContext';
    import { useCart } from '../contexts/CartContext';
    import { useTheme } from '../contexts/ThemeContext';

    import { SearchBar } from '../components/SearchBar';

    export function Header() {
    const { user, logout } = useAuth();
    const { cart } = useCart();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const totalItems = cart.itemCount;

    const handleLogout = () => {
        logout();
        setMobileMenuOpen(false);
        navigate('/');
    };

    return (
        <header className="sticky top-0 z-40 bg-transparent border-none transition-colors">
        <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 gap-3">
            {/* Brand Logo - Compact 10X badge + plain 'Shop' text */}
            <div className="flex items-center gap-2 select-none shrink-0">
                <Link
                to="/"
                className="flex items-center group transition-transform hover:scale-105 shrink-0"
                onClick={() => setMobileMenuOpen(false)}
                title="10X - Go to Catalog"
                >
                <div className="px-2.5 py-0.5 bg-black/95 border border-slate-700/70 rounded-lg shadow-sm flex items-center justify-center group-hover:border-pink-500/50 transition-colors">
                    <span className="text-white font-black text-lg tracking-tight">10</span>
                    <span className="text-pink-500 font-black text-lg">X</span>
                </div>
                </Link>
                <span className="text-xl font-bold tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                Shop
                </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2 pl-2">
                <NavLink
                to="/"
                end
                className={({ isActive }) =>
                    `text-sm font-semibold tracking-wide transition-all px-4 py-1.5 rounded-full flex items-center gap-2 cursor-pointer ${
                    isActive
                        ? 'text-pink-100 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-400/40 backdrop-blur-md shadow-[0_0_15px_rgba(244,63,94,0.18)]'
                        : 'text-slate-200 hover:text-white bg-black/40 hover:bg-black/60 border border-slate-700/50'
                    }`
                }
                >
                Catalog
                </NavLink>

                {user.isLoggedIn && (
                <NavLink
                    to="/orders"
                    className={({ isActive }) =>
                    `text-sm font-semibold tracking-wide transition-all px-4 py-1.5 rounded-full flex items-center gap-2 cursor-pointer ${
                        isActive
                        ? 'text-pink-100 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-400/40 backdrop-blur-md shadow-[0_0_15px_rgba(244,63,94,0.18)]'
                        : 'text-slate-200 hover:text-white bg-black/40 hover:bg-black/60 border border-slate-700/50'
                    }`
                    }
                >
                    <PackageCheck className="w-4 h-4" />
                    <span>Orders</span>
                </NavLink>
                )}
            </nav>

            {/* Search Bar */}
            <div className="hidden sm:flex flex-1 max-w-xs md:max-w-sm ml-4 mr-auto">
                <SearchBar />
            </div>

            {/* Desktop Right Actions: Theme Toggle, Cart, Login / Profile & Logout */}
            <div className="hidden md:flex items-center gap-3 shrink-0">
                {/* Theme Toggle Button (Dark / Light) */}
                <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle dark/light theme"
                className="p-2.5 rounded-full border border-slate-700/50 bg-black/40 hover:bg-black/60 text-slate-200 hover:text-white transition cursor-pointer shadow-sm backdrop-blur-xs"
                >
                {theme === 'dark' ? (
                    <Sun className="w-4 h-4 text-pink-300" />
                ) : (
                    <Moon className="w-4 h-4 text-slate-200" />
                )}
                </button>

                {/* Cart Link with Badge */}
                <NavLink
                to="/cart"
                className={({ isActive }) =>
                    `relative p-2.5 rounded-full border transition cursor-pointer shadow-sm backdrop-blur-xs ${
                    isActive
                        ? 'text-pink-100 bg-pink-500/30 border-pink-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                        : 'text-slate-200 hover:text-white border-slate-700/50 bg-black/40 hover:bg-black/60'
                    }`
                }
                aria-label={`Cart with ${totalItems} items`}
                >
                <ShoppingCart className="w-4 h-4" />
                {totalItems > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-pink-500/80 backdrop-blur-xs text-white text-[10px] font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center border border-pink-400/50 shadow-md">
                    {totalItems}
                    </span>
                )}
                </NavLink>

                {/* User Profile or Login Button */}
                {user.isLoggedIn ? (
                <div className="flex items-center gap-2">
                    <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        `flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold transition cursor-pointer shadow-sm border ${
                        isActive
                            ? 'text-pink-100 bg-pink-500/25 border-pink-400 shadow-[0_0_15px_rgba(244,63,94,0.25)]'
                            : 'text-slate-200 hover:text-white bg-black/40 hover:bg-black/60 border-slate-700/50'
                        }`
                    }
                    >
                    <div className="w-5 h-5 rounded-full bg-pink-500/20 text-pink-300 flex items-center justify-center font-bold text-xs uppercase border border-pink-500/30">
                        {(user.firstName || user.username).charAt(0) || 'U'}
                    </div>
                    <span className="max-w-28 truncate">{user.firstName || user.username}</span>
                    </NavLink>

                    <button
                    type="button"
                    onClick={handleLogout}
                    title="Log out"
                    className="p-2 rounded-full text-slate-300 hover:text-rose-400 bg-black/40 hover:bg-rose-950/40 border border-slate-700/50 transition cursor-pointer shadow-sm"
                    aria-label="Log out"
                    >
                    <LogOut className="w-4 h-4" />
                    </button>
                </div>
                ) : (
                <NavLink
                    to="/login"
                    className={({ isActive }) =>
                    `inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition active:scale-95 cursor-pointer backdrop-blur-md ${
                        isActive
                        ? 'bg-pink-500/40 border border-pink-300 text-white shadow-[0_0_20px_rgba(244,63,94,0.35)] font-bold'
                        : 'bg-pink-500/25 hover:bg-pink-500/35 border border-pink-400/50 text-white shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                    }`
                    }
                >
                    <LogIn className="w-4 h-4" />
                    <span>Log in</span>
                </NavLink>
                )}
            </div>

            {/* Mobile Right Bar: Cart, Theme & Hamburger */}
            <div className="flex items-center gap-2 md:hidden">
                {/* Theme Toggle */}
                <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                {theme === 'dark' ? (
                    <Sun className="w-5 h-5 text-pink-400" />
                ) : (
                    <Moon className="w-5 h-5 text-slate-700" />
                )}
                </button>

                {/* Cart with Badge */}
                <NavLink
                to="/cart"
                className={({ isActive }) =>
                    `relative p-2 rounded-xl transition ${
                    isActive
                        ? 'text-pink-400 bg-pink-500/20 border border-pink-500/30'
                        : 'text-slate-700 dark:text-slate-300 hover:text-pink-500'
                    }`
                }
                aria-label="Cart"
                onClick={() => setMobileMenuOpen(false)}
                >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-linear-to-r from-pink-600 to-rose-600 text-white text-[10px] font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center">
                    {totalItems}
                    </span>
                )}
                </NavLink>

                {/* Hamburger Button */}
                <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label="Toggle menu"
                className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>
            </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
            <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2">
            <NavLink
                to="/"
                end
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                `block px-4 py-2.5 rounded-xl text-base font-semibold ${
                    isActive
                    ? 'bg-pink-500/20 text-pink-300 border border-pink-400/40 font-bold backdrop-blur-md'
                    : 'text-slate-200 hover:bg-slate-800'
                }`
                }
            >
                Catalog
            </NavLink>

            <NavLink
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                `flex items-center justify-between px-4 py-2.5 rounded-xl text-base font-semibold ${
                    isActive
                    ? 'bg-pink-500/20 text-pink-300 border border-pink-400/40 font-bold backdrop-blur-md'
                    : 'text-slate-200 hover:bg-slate-800'
                }`
                }
            >
                <span>Cart</span>
                {totalItems > 0 && (
                <span className="bg-pink-500/80 text-white text-xs px-2 py-0.5 rounded-full font-bold border border-pink-400/40">
                    {totalItems} items
                </span>
                )}
            </NavLink>

            {user.isLoggedIn ? (
                <>
                <NavLink
                    to="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                    `block px-4 py-2.5 rounded-xl text-base font-semibold ${
                        isActive
                        ? 'bg-pink-500/20 text-pink-300 border border-pink-400/40 font-bold backdrop-blur-md'
                        : 'text-slate-200 hover:bg-slate-800'
                    }`
                    }
                >
                    Orders
                </NavLink>

                <NavLink
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-semibold ${
                        isActive
                        ? 'bg-pink-500/20 text-pink-300 border border-pink-400/40 font-bold backdrop-blur-md'
                        : 'text-slate-200 hover:bg-slate-800'
                    }`
                    }
                >
                    <User className="w-4 h-4" />
                    Profile ({user.firstName || user.username})
                </NavLink>

                <div className="pt-2">
                    <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 transition cursor-pointer"
                    >
                    <LogOut className="w-4 h-4" />
                    Log out ({user.firstName || user.username})
                    </button>
                </div>
                </>
            ) : (
                <div className="pt-2">
                <NavLink
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                    `w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition cursor-pointer ${
                        isActive
                        ? 'bg-pink-500/40 border-pink-300 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                        : 'bg-pink-500/25 hover:bg-pink-500/35 border-pink-400/50 text-white backdrop-blur-md shadow-sm'
                    }`
                    }
                >
                    <LogIn className="w-4 h-4" />
                    <span>Log in to Account</span>
                </NavLink>
                </div>
            )}
            </div>
        )}
        </header>
    );
}