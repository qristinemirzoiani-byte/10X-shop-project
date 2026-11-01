    // components/layout/Header.tsx
    import { useState } from 'react';
    import { useNavigate } from 'react-router';
    import { Menu, X } from 'lucide-react';
    import { useAuth } from '../contexts/AuthContext';
    import { useCart } from '../contexts/CartContext';
    import { Logo } from '../components/Logo';
    import { DesktopNav } from '../components/DesktopNav';
    import { SearchBar } from '../components/SearchBar';
    import { ThemeToggle } from '../components/ThemeToggle';
    import { CartButton } from '../components/CartButton';
    import { AuthActions } from '../components/AuthActions';
    import { MobileDrawer } from '../components/MobileDrawer';

    export function Header() {
    const { user, logout } = useAuth();
    const { cart } = useCart();
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
            {/* Logo */}
            <Logo onClick={() => setMobileMenuOpen(false)} />

            {/* Desktop Navigation */}
            <DesktopNav isLoggedIn={user.isLoggedIn} />

            {/* Search Bar */}
            <div className="hidden sm:flex flex-1 max-w-xs md:max-w-sm ml-4 mr-auto">
                <SearchBar />
            </div>

            {/* Desktop Right Actions: Theme Toggle, Cart, AuthActions */}
            <div className="hidden md:flex items-center gap-3 shrink-0">
                <ThemeToggle />
                <CartButton />
                <AuthActions />
            </div>

            {/* Mobile Right Bar: Theme Toggle, Cart with Badge & Hamburger */}
            <div className="flex items-center gap-2 md:hidden">
                <ThemeToggle
                className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                iconClassName="w-5 h-5 text-pink-400 dark:text-pink-400"
                />
                <CartButton isMobile onClick={() => setMobileMenuOpen(false)} />

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

        {/* Mobile Drawer (with isOpen prop) */}
        <MobileDrawer
            isOpen={mobileMenuOpen}
            user={{ isLoggedIn: user.isLoggedIn, username: user.username }}
            totalItems={totalItems}
            onClose={() => setMobileMenuOpen(false)}
            onLogout={handleLogout}
        />
        </header>
    );
}

export default Header;