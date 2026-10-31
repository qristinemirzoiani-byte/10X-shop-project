import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
    page: number;
    totalPages: number;
    onChange: (page: number) => void;
    }

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
    if (totalPages <= 1) return null;

// Generate page numbers with ellipsis
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
        } else {
        pages.push(1);
        if (page > 3) {
            pages.push('...');
        }

        const start = Math.max(2, page - 1);
        const end = Math.min(totalPages - 1, page + 1);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (page < totalPages - 2) {
            pages.push('...');
        }
        pages.push(totalPages);
        }
        return pages;
    };

    return (
        <nav className="flex items-center justify-center gap-2 mt-8" aria-label="Pagination">
        {/* Previous button */}
        <button
            type="button"
            disabled={page <= 1}
            onClick={() => onChange(page - 1)}
            className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-slate-200/60 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md text-slate-600 dark:text-slate-400 disabled:opacity-20 disabled:cursor-not-allowed hover:border-pink-500/40 hover:text-pink-500 dark:hover:text-pink-400 hover:bg-pink-500/10 transition-all duration-200 cursor-pointer"
            aria-label="Previous page"
        >
            <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Numbered buttons */}
        {getPageNumbers().map((item, index) => {
            if (item === '...') {
            return (
                <span
                key={`ellipsis-${index}`}
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-slate-500 text-sm font-medium select-none"
                >
                …
                </span>
            );
            }

            const pageNum = item as number;
            const isActive = pageNum === page;

            return (
            <button
                key={pageNum}
                type="button"
                onClick={() => onChange(pageNum)}
                aria-current={isActive ? 'page' : undefined}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer backdrop-blur-md ${
                isActive
                    ? 'bg-pink-500/20 text-pink-600 dark:text-pink-300 border border-pink-500/50 shadow-sm shadow-pink-500/20'
                    : 'border border-slate-200/60 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 hover:border-pink-500/40 hover:text-pink-500 dark:hover:text-pink-300 hover:bg-pink-500/10'
                }`}
            >
                {pageNum}
            </button>
            );
        })}

        {/* Next button */}
        <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onChange(page + 1)}
            className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-slate-200/60 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md text-slate-600 dark:text-slate-400 disabled:opacity-20 disabled:cursor-not-allowed hover:border-pink-500/40 hover:text-pink-500 dark:hover:text-pink-400 hover:bg-pink-500/10 transition-all duration-200 cursor-pointer"
            aria-label="Next page"
        >
            <ChevronRight className="w-4 h-4" />
        </button>
        </nav>
    );
}