    import { Outlet } from 'react-router';
    import { Header } from './Header';
    import { Sidebar } from './Sidebar';

    export function Layout() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
        {/* Sticky top header with full fluid width */}
        <Header />

        {/* Main layout container with full-height sidebar and content */}
        <div className="flex-1 flex w-full">
            {/* Left sidebar: aligned directly under 10X logo, full viewport height */}
            <Sidebar className="hidden md:flex self-stretch" />

            {/* Dynamic page outlet area */}
            <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 overflow-x-hidden">
            <Outlet />
            </main>
        </div>

        {/* Simple Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800 py-3 text-center text-xs text-slate-500 dark:text-slate-400">
            <p>© 2026 10X Shop. Built for Front-end Diploma Defense.</p>
        </footer>
        </div>
    );
}