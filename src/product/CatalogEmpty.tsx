    import { Search } from 'lucide-react';
    import { Link } from 'react-router';

    export function CatalogEmpty() {
    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto space-y-3 shadow-sm">
        <Search className="w-10 h-10 text-slate-400 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">No products found</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
            Try clearing your search or category filter.
        </p>
        <Link
            to="/"
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-pink-500/25 hover:bg-pink-500/35 border border-pink-400/50 text-white font-semibold text-xs transition shadow-[0_0_15px_rgba(244,63,94,0.12)] cursor-pointer"
        >
            Clear Filters
        </Link>
        </div>
    );
}

export default CatalogEmpty;