    import React, { createContext, useContext, useState, useCallback } from 'react';
    import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

    export type ToastType = 'success' | 'error' | 'info';

    export interface ToastItem {
    id: string;
    type: ToastType;
    message: string;
    }

    interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
    removeToast: (id: string) => void;
    }

    const ToastContext = createContext<ToastContextType | undefined>(undefined);

    export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const showToast = useCallback(
        (message: string, type: ToastType = 'success') => {
        const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        setToasts((prev) => [...prev, { id, type, message }]);

        setTimeout(() => {
            removeToast(id);
        }, 3500);
        },
        [removeToast]
    );

    return (
        <ToastContext.Provider value={{ showToast, removeToast }}>
        {children}
        {/* ეკრანის ქვედა მარჯვენა კუთხეში შეტყობინებების კონტეინერი */}
        <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4">
            {toasts.map((toast) => (
            <div
                key={toast.id}
                className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 ${
                toast.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/90 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
                    : toast.type === 'error'
                    ? 'bg-rose-50 dark:bg-rose-950/90 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-100'
                    : 'bg-indigo-50 dark:bg-indigo-950/90 border-indigo-300 dark:border-indigo-800 text-indigo-900 dark:text-indigo-100'
                }`}
            >
                <div className="flex items-center gap-3">
                {toast.type === 'success' && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                )}
                {toast.type === 'error' && (
                    <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                )}
                {toast.type === 'info' && (
                    <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                )}
                <span className="text-sm font-medium leading-snug">{toast.message}</span>
                </div>
                <button
                onClick={() => removeToast(toast.id)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition shrink-0 ml-2"
                aria-label="Close"
                >
                <X className="w-4 h-4" />
                </button>
            </div>
            ))}
        </div>
        </ToastContext.Provider>
    );
    }

    export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
}