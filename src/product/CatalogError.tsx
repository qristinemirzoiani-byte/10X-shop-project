import { AlertCircle, RefreshCw } from 'lucide-react';

interface CatalogErrorProps {
    error: string;
    onRetry: () => void;
}

export function CatalogError({ error, onRetry }: CatalogErrorProps) {
    return (
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-3xl p-8 text-center max-w-md mx-auto space-y-3">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h3 className="font-bold text-slate-900 dark:text-white">Failed to load products</h3>
        <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>
        <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-xs transition cursor-pointer"
        >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
        </button>
        </div>
    );
}