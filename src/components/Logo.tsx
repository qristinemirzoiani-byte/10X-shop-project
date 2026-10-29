import { Link } from 'react-router';

    interface LogoProps {
    className?: string;
    onClick?: () => void; 
    }

    export function Logo({ className = '', onClick }: LogoProps) {
    return (
        <div className={`flex items-center gap-2 select-none shrink-0 ${className}`}>
        <Link
            to="/"
            onClick={onClick}
            title="10X - Go to Catalog"
            className="flex items-center group transition-transform hover:scale-105 shrink-0"
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
    );
}

export default Logo;