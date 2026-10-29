
export function SkeletonCard() {
    return (
        <div className="bg-[#fbf7f9] dark:bg-[#0e1424] border border-pink-100/90 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm animate-pulse flex flex-col h-full">
        <div className="w-full aspect-square bg-pink-100/40 dark:bg-slate-800" />
        <div className="p-4 flex flex-col flex-1 gap-3">
            <div className="h-3 w-1/3 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-5 w-4/5 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="mt-auto pt-3 flex items-center justify-between">
            <div className="h-6 w-1/3 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-9 w-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            </div>
        </div>
        </div>
    );
}
