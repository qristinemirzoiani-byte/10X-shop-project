import { NavLink } from 'react-router';
import { PackageCheck } from 'lucide-react';

    interface DesktopNavProps {
    isLoggedIn: boolean;
    }

    export function DesktopNav({ isLoggedIn }: DesktopNavProps) {
    // სტილის დამხმარე ფუნქცია, რომელიც ამოვიტანეთ ჰედერიდან
    const navStyle = ({ isActive }: { isActive: boolean }) =>
        `text-sm font-semibold tracking-wide transition-all px-5 py-1.5 rounded-full flex items-center gap-2 cursor-pointer ${
        isActive
            ? 'text-pink-100 bg-pink-500/20 border border-pink-400/40 backdrop-blur-md shadow-[0_0_15px_rgba(244,63,94,0.18)]'
            : 'text-slate-200 hover:text-white bg-black/40 hover:bg-black/60 border border-slate-700/50'
        }`;

    return (
        <nav className="hidden md:flex items-center gap-2 pl-4 flex-1">
        <NavLink to="/" end className={navStyle}>
            Catalog
        </NavLink>

        {isLoggedIn && (
            <NavLink to="/orders" className={navStyle}>
            <PackageCheck className="w-4 h-4" />
            <span>Orders</span>
            </NavLink>
        )}
        </nav>
    );
}

export default DesktopNav;