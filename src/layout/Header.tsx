    // components/layout/Header.tsx
    import { useState } from 'react';
    import { Link, useNavigate } from 'react-router';
    import {
    ShoppingCart,
    Moon,
    Sun,
    Menu,
    X,
    LogOut,
    LogIn,
    } from 'lucide-react';
    import { useAuth } from '../contexts/AuthContext';
    import { useCart } from '../contexts/CartContext';
    import { useTheme } from '../contexts/ThemeContext';
    import { Logo } from '../components/Logo';
    import { DesktopNav } from '../components/DesktopNav';
    import { MobileDrawer } from '../components/MobileDrawer';


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
            <div className="flex items-center justify-between h-16 gap-4">
            
            {/* Brand Logo - Compact 10X badge + plain 'Shop' text */}
            <Logo onClick={() => setMobileMenuOpen(false)} />

            {/* Desktop Navigation - Centered / Middle space */}
            <DesktopNav isLoggedIn={user.isLoggedIn} />

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
                <Link
                to="/cart"
                className="relative p-2.5 rounded-full border border-slate-700/50 bg-black/40 hover:bg-black/60 text-slate-200 hover:text-white transition cursor-pointer shadow-sm backdrop-blur-xs"
                aria-label={`Cart with ${totalItems} items`}
                >
                <ShoppingCart className="w-4 h-4" />
                {totalItems > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-pink-500/80 backdrop-blur-xs text-white text-[10px] font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center border border-pink-400/50 shadow-md">
                    {totalItems}
                    </span>
                )}
                </Link>

                {/* User Profile or Login Button */}
                {user.isLoggedIn ? (
                <div className="flex items-center gap-2">
                    <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold text-slate-200 hover:text-white bg-black/40 hover:bg-black/60 border border-slate-700/50 transition cursor-pointer shadow-sm"
                    >
                    <div className="w-5 h-5 rounded-full bg-pink-500/20 text-pink-300 flex items-center justify-center font-bold text-xs uppercase border border-pink-500/30">
                        {user.username.charAt(0) || 'U'}
                    </div>
                    <span>{user.username}</span>
                    </Link>

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
                <Link
                    to="/login"
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold bg-pink-500/25 hover:bg-pink-500/35 border border-pink-400/50 text-white backdrop-blur-md shadow-[0_0_15px_rgba(244,63,94,0.2)] transition active:scale-95 cursor-pointer"
                >
                    <LogIn className="w-4 h-4" />
                    <span>Log in</span>
                </Link>
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
                <Link
                to="/cart"
                className="relative p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-pink-500 transition"
                aria-label="Cart"
                onClick={() => setMobileMenuOpen(false)}
                >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-linear-to-r from-pink-600 to-rose-600 text-white text-[10px] font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center">
                    {totalItems}
                    </span>
                )}
                </Link>

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
            <MobileDrawer 
                user={user} 
                totalItems={totalItems} 
                onClose={() => setMobileMenuOpen(false)} 
                onLogout={handleLogout} 
            />
            )}
            
        </header>
    );
}

