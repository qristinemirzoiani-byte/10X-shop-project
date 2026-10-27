
import { Search } from 'lucide-react';

interface CatalogEmptyProps {
    onClear: () => void;
    }

export function CatalogEmpty({ onClear }: CatalogEmptyProps) {
    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto space-y-3">
        <Search className="w-10 h-10 text-slate-400 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">No products found</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
            Try clearing your search or category filter.
        </p>
        <button
            type="button"
            onClick={onClear}
            className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-semibold text-xs transition cursor-pointer"
        >
            Clear Filters
        </button>
        </div>
    );
}