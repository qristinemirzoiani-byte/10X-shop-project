    import { ChevronLeft, ChevronRight } from 'lucide-react';

    interface PaginationProps {
    page: number;
    totalPages: number;
    onChange: (page: number) => void;
    }

    export function Pagination({ page, totalPages, onChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];

        if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
        pages.push(1);
        if (page > 3) pages.push('...');

        const start = Math.max(2, page - 1);
        const end = Math.min(totalPages - 1, page + 1);
        for (let i = start; i <= end; i++) pages.push(i);

        if (page < totalPages - 2) pages.push('...');
        pages.push(totalPages);
        }
        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-2 pt-8">
        {/* წინა გვერდის ისარი - შუშის ეფექტით */}
        <button
            type="button"
            disabled={page <= 1}
            onClick={() => onChange(page - 1)}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-pink-500/5 dark:bg-pink-500/10 border border-pink-500/15 dark:border-pink-500/20 backdrop-blur-md text-pink-400 hover:bg-pink-500/15 dark:hover:bg-pink-500/25 hover:text-pink-300 disabled:opacity-20 disabled:cursor-not-allowed transition cursor-pointer"
            aria-label="Previous Page"
        >
            <ChevronLeft className="w-4 h-4" />
        </button>

        {/* ციფრები და სამი წერტილი */}
        {getPageNumbers().map((item, index) => {
            if (item === '...') {
            return (
                <span key={`dots-${index}`} className="px-1.5 text-xs font-bold text-pink-400/50 select-none">
                •••
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
                className={`w-9 h-9 rounded-xl text-xs font-bold backdrop-blur-md transition-all cursor-pointer ${
                isActive
                    ? 'bg-pink-500/25 dark:bg-pink-500/30 border border-pink-500/50 text-white font-extrabold shadow-lg shadow-pink-500/20 scale-105'
                    : 'bg-pink-500/5 dark:bg-pink-500/10 border border-pink-500/15 dark:border-pink-500/20 text-slate-700 dark:text-slate-300 hover:bg-pink-500/15 dark:hover:bg-pink-500/20 hover:border-pink-500/30 hover:text-pink-600 dark:hover:text-pink-300'
                }`}
            >
                {pageNum}
            </button>
            );
        })}

        {/* შემდეგი გვერდის ისარი - შუშის ეფექტით */}
        <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onChange(page + 1)}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-pink-500/5 dark:bg-pink-500/10 border border-pink-500/15 dark:border-pink-500/20 backdrop-blur-md text-pink-400 hover:bg-pink-500/15 dark:hover:bg-pink-500/25 hover:text-pink-300 disabled:opacity-20 disabled:cursor-not-allowed transition cursor-pointer"
            aria-label="Next Page"
        >
            <ChevronRight className="w-4 h-4" />
        </button>
        </div>
    );
}