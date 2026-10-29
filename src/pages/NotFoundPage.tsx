import { Link } from 'react-router';
import { FileQuestion, ShoppingBag } from 'lucide-react';

export default function NotFoundPage() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center py-12 text-center px-4">
        <div className="w-20 h-20 rounded-3xl bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 flex items-center justify-center mb-6 shadow-sm border border-pink-200/50 dark:border-pink-500/20">
            <FileQuestion className="w-10 h-10" />
        </div>

        <span className="text-sm font-bold text-pink-600 dark:text-pink-400 uppercase tracking-widest mb-1">
            404 Error
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
            Page not found
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-8">
            The page you are looking for does not exist.
        </p>

        <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-sm shadow-md shadow-pink-600/25 transition active:scale-95"
        >
            <ShoppingBag className="w-4 h-4" />
            Go to catalog
        </Link>
        </div>
    );
}
