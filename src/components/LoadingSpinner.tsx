export function LoadingSpinner({ text = 'Loading...' }: { text?: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="w-10 h-10 border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{text}</p>
        </div>
    );
}