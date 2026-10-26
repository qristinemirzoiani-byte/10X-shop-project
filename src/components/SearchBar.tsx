    import { useState, useEffect } from 'react';
    import { useSearchParams, useNavigate, useLocation } from 'react-router';
    import { Search, X } from 'lucide-react';

    export function SearchBar() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();

    const queryInUrl = searchParams.get('q') || '';
    const [term, setTerm] = useState(queryInUrl);

    // URL  takes precedence over local state, so if the URL changes externally, we need to update our local state accordingly
    useEffect(() => {
        setTerm(queryInUrl);
    }, [queryInUrl]);

    // 400ms Debounce PRD 
    useEffect(() => {
        const timer = setTimeout(() => {
        const trimmed = term.trim();
        const currentQ = searchParams.get('q') || '';

        if (trimmed !== currentQ) {
            if (trimmed) {
            // for catalog page, we want to reset the page to 1 when searching
            navigate(`/?q=${encodeURIComponent(trimmed)}&page=1`);
            } else if (location.pathname === '/' && currentQ) {
            // if the search term is cleared, we want to remove the query param from the URL
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
        <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9.5 pr-8 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/90 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500/50 transition"
        />
        {term && (
            <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 cursor-pointer"
            >
            <X className="w-3.5 h-3.5" />
            </button>
        )}
        </div>
    );
}