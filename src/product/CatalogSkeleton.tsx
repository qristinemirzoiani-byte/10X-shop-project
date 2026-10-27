export function CatalogSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
            <div
            key={i}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 animate-pulse space-y-3"
            >
            <div className="aspect-square bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl mt-4" />
            </div>
        ))}
        </div>
    );
}