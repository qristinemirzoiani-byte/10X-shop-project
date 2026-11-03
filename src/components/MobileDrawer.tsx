    import { NavLink } from 'react-router';
    import { User, LogOut, LogIn } from 'lucide-react';
    import { SearchBar } from './SearchBar'; // <-- შემოტანილია SearchBar

    interface MobileDrawerProps {
    isOpen?: boolean;
    open?: boolean;
    user: {
        isLoggedIn: boolean;
        username: string;
    };
    totalItems: number;
    onClose: () => void;
    onLogout: () => void;
    }

    export function MobileDrawer({ isOpen, open, user, totalItems, onClose, onLogout }: MobileDrawerProps) {
    const visible = isOpen ?? open ?? true;

    if (!visible) {
        return null;
    }

    const linkStyle = ({ isActive }: { isActive: boolean }) =>
        `block px-4 py-2.5 rounded-xl text-base font-semibold transition ${
        isActive
            ? 'bg-pink-500/20 text-pink-300 border border-pink-400/40 font-bold backdrop-blur-md'
            : 'text-slate-200 hover:bg-slate-800'
        }`;

    return (
        <div className="md:hidden border-t border-slate-800 bg-slate-900/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2">
        {/* Search Bar  for Mobile */}
        <div className="pb-2 border-b border-slate-800/80">
            <SearchBar onSearchSubmit={onClose} />
        </div>

        <NavLink to="/" end onClick={onClose} className={linkStyle}>
            Catalog
        </NavLink>

        <NavLink
            to="/cart"
            onClick={onClose}
            className={({ isActive }) =>
            `flex items-center justify-between px-4 py-2.5 rounded-xl text-base font-semibold transition ${
                isActive
                ? 'bg-pink-500/20 text-pink-300 border border-pink-400/40 font-bold backdrop-blur-md'
                : 'text-slate-200 hover:bg-slate-800'
            }`
            }
        >
            <span>Cart</span>
            {totalItems > 0 && (
            <span className="bg-pink-500/80 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {totalItems} items
            </span>
            )}
        </NavLink>

        {user.isLoggedIn ? (
            <>
            <NavLink to="/orders" onClick={onClose} className={linkStyle}>
                Orders
            </NavLink>

            <NavLink
                to="/profile"
                onClick={onClose}
                className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-semibold transition ${
                    isActive
                    ? 'bg-pink-500/20 text-pink-300 border border-pink-400/40 font-bold backdrop-blur-md'
                    : 'text-slate-200 hover:bg-slate-800'
                }`
                }
            >
                <User className="w-4 h-4" /> Profile ({user.username})
            </NavLink>

            <button
                type="button"
                onClick={onLogout}
                className="w-full min-h-11 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 transition cursor-pointer"
            >
                <LogOut className="w-4 h-4" /> Log out
            </button>
            </>
        ) : (
            <div className="pt-2">
            <NavLink
                to="/login"
                onClick={onClose}
                className={({ isActive }) =>
                `w-full min-h-11 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition cursor-pointer ${
                    isActive
                    ? 'bg-pink-500/40 border-pink-300 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                    : 'bg-pink-500/25 hover:bg-pink-500/35 border border-pink-400/50 text-white'
                }`
                }
            >
                <LogIn className="w-4 h-4" />
                <span>Log in to Account</span>
            </NavLink>
            </div>
        )}
        </div>
    );
}

export default MobileDrawer;