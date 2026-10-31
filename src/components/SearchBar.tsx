import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router';
import { Search, X } from 'lucide-react';

export function SearchBar() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();

    const queryInUrl = searchParams.get('q') || '';
    const [term, setTerm] = useState(queryInUrl);

    useEffect(() => {
        setTerm(queryInUrl);
    }, [queryInUrl]);

    useEffect(() => {
        const timer = setTimeout(() => {
        const trimmed = term.trim();
        const currentQ = searchParams.get('q') || '';

        if (trimmed !== currentQ) {
            if (trimmed) {
            navigate(`/?q=${encodeURIComponent(trimmed)}&page=1`);
            } else if (location.pathname === '/' && currentQ) {
            navigate('/');
            }
        }
        }, 400);

        return () => clearTimeout(timer);
    }, [term]);

    const handleClear = () => {
        setTerm('');
        if (location.pathname === '/') {
        navigate('/');
        }
    };

    return (
        <div className="relative w-full max-w-xs sm:max-w-sm">
        <Search className="w-4 h-4 text-slate-300 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9.5 pr-8 py-2 text-xs sm:text-sm rounded-full border border-slate-700/60 bg-black/45 hover:bg-black/60 text-white placeholder-slate-400 focus:outline-none focus:border-pink-500/70 focus:ring-2 focus:ring-pink-500/30 backdrop-blur-md transition-all shadow-sm"
        />
        {term && (
            <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 cursor-pointer transition"
            title="Clear search"
            >
            <X className="w-3.5 h-3.5" />
            </button>
        )}
        </div>
    );
}

export default SearchBar;