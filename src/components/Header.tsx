
    import { ShoppingCart, LogIn, LogOut, User } from 'lucide-react';
    import { useAuth } from '../contexts/AuthContext';
    import { Logo } from './Logo';

    interface HeaderProps {
    cartCount?: number; // Number of items in shopping cart
    onNavigateLogin?: () => void; 
    onNavigateCatalog?: () => void; 
    onNavigateCart?: () => void; 
    }

    export function Header({
    cartCount = 0,
    onNavigateLogin,
    onNavigateCatalog,
    onNavigateCart,
    }: HeaderProps) {
    // Consume auth state and logout function from global AuthContext
    const { user, logout } = useAuth();

    return (
        <header className="sticky top-0 z-50 bg-[#07090e]/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            
            {/* Left: Brand Logo & Navigation */}
            <div className="flex items-center gap-6">
            <button
                type="button"
                onClick={onNavigateCatalog}
                className="cursor-pointer focus:outline-none"
            >
                <Logo />
            </button>

            <nav className="hidden sm:flex items-center gap-1">
                <button
                type="button"
                onClick={onNavigateCatalog}
                className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition cursor-pointer"
                >
                Catalog
                </button>
            </nav>
            </div>

            {/* Right: Cart and User Auth Actions */}
            <div className="flex items-center gap-3">
            
            {/* Shopping Cart Button with Badge */}
            <button
                type="button"
                onClick={onNavigateCart}
                className="relative p-2.5 text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 rounded-xl transition cursor-pointer flex items-center justify-center"
                title="View Cart"
            >
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-pink-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg shadow-pink-600/40">
                    {cartCount}
                </span>
                )}
            </button>

            {/* Conditional User Section: Guest vs Logged In */}
            {user.isLoggedIn ? (
                // State: User is Logged In
                <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 border border-slate-800 rounded-xl">
                    <User size={15} className="text-pink-400" />
                    <span className="text-xs font-bold text-white max-w-30 truncate">
                    {user.username}
                    </span>
                </div>

                {/* Logout Button */}
                <button
                    type="button"
                    onClick={logout}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 border border-transparent hover:border-rose-900/40 rounded-xl transition cursor-pointer"
                    title="Log Out"
                >
                    <LogOut size={15} />
                    <span className="hidden sm:inline">Logout</span>
                </button>
                </div>
            ) : (
                // State: User is Guest (Show Login Button)
                <button
                type="button"
                onClick={onNavigateLogin}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-linear-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 rounded-xl transition shadow-lg shadow-pink-600/20 active:scale-95 cursor-pointer"
                >
                <LogIn size={15} />
                <span>Login</span>
                </button>
            )}

            </div>

        </div>
        </header>
    );
}