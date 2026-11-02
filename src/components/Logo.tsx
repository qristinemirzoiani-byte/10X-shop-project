    import { Link } from 'react-router';

    interface LogoProps {
    className?: string;
    onClick?: () => void;
    asLink?: boolean; // <-- დამატებულია
    }

    export function Logo({ className = '', onClick, asLink = true }: LogoProps) {
    const content = (
        <div
        className={`flex items-center gap-2 select-none shrink-0 ${
            asLink ? 'group transition-transform hover:scale-105 cursor-pointer' : 'cursor-default pointer-events-none'
        } ${className}`}
        >
        <div className="px-2.5 py-0.5 bg-black/95 border border-slate-700/70 rounded-lg shadow-sm flex items-center justify-center group-hover:border-pink-500/50 transition-colors">
            <span className="text-white font-black text-lg tracking-tight">10</span>
            <span className="text-pink-500 font-black text-lg">X</span>
        </div>
        <span className="text-xl font-bold tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Shop
        </span>
        </div>
    );

    // if asLink is false 
    if (!asLink) {
        return content;
    }

    return (
        <Link
        to="/"
        onClick={onClick}
        title="10X Shop - Go to Catalog"
        className="inline-block"
        >
        {content}
        </Link>
    );
}

export default Logo;