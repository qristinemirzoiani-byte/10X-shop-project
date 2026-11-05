    import { useState, useEffect, useRef } from 'react';
    import { useSearchParams, useNavigate, useLocation } from 'react-router';
    import { Search, X } from 'lucide-react';
    import { useDebounce } from '../hooks/useDebounce';

    interface SearchBarProps {
        onSearchSubmit?: () => void;
    }

    export function SearchBar({ onSearchSubmit }: SearchBarProps) {
        const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();

        const queryInUrl = searchParams.get('q') || '';
        const [term, setTerm] = useState(queryInUrl);
        const debouncedTerm = useDebounce(term, 400);
        const submittedQuery = useRef<string | null>(null);

        useEffect(() => {
            if (submittedQuery.current === queryInUrl) {
                submittedQuery.current = null;
                return;
            }
            setTerm(queryInUrl);
        }, [queryInUrl]);

        useEffect(() => {
            const trimmed = debouncedTerm.trim();
            const currentQ = searchParams.get('q') || '';

        if (trimmed === term.trim() && trimmed !== currentQ) {
            const nextParams = new URLSearchParams(searchParams);
            if (trimmed) {
                nextParams.set('q', trimmed);
            nextParams.delete('category');
        } else {
            nextParams.delete('q');
        }
        nextParams.set('page', '1');
        submittedQuery.current = trimmed;

        if (location.pathname !== '/') {
            navigate(`/?${nextParams.toString()}`);
        } else {
            setSearchParams(nextParams);
        }
        onSearchSubmit?.();
        }
    }, [debouncedTerm, location.pathname, navigate, onSearchSubmit, searchParams, setSearchParams, term]);

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
            className="w-full h-8.5 pl-9.5 pr-8 py-1 text-xs sm:text-sm rounded-full border border-slate-700/60 bg-black/45 hover:bg-black/60 text-white placeholder-slate-400 focus:outline-none focus:border-pink-500/70 focus:ring-2 focus:ring-pink-500/30 backdrop-blur-md transition-all shadow-sm"
        />
        {term && (
            <button
            type="button"
            onClick={handleClear}
            className="absolute right-1 top-1/2 -translate-y-1/2 min-w-11 min-h-11 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer transition"
            title="Clear search"
            >
            <X className="w-3.5 h-3.5" />
            </button>
        )}
        </div>
    );
}

export default SearchBar;