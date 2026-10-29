    // components/product/Pagination.tsx
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
        <nav className="flex items-center justify-center gap-1.5 mt-8" aria-label="Pagination">
        {/* Previous button */}
        <button
            type="button"
            disabled={page <= 1}
            onClick={() => onChange(page - 1)}
            className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition"
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
                className="w-9 h-9 flex items-center justify-center text-slate-400 text-sm"
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
                className={`w-9 h-9 rounded-xl text-sm font-semibold transition ${
                isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
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
            className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            aria-label="Next page"
        >
            <ChevronRight className="w-4 h-4" />
        </button>
        </nav>
    );
}
