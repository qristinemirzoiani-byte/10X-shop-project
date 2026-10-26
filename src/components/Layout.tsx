    import { Outlet } from 'react-router';
    import { Header } from './Header';
    import { Sidebar } from './Sidebar';

    export function Layout() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
        {/* Sticky top navigation header */}
        <Header />

        {/* Main body area: full height stretch eliminating any bottom sidebar gap */}
        <div className="flex-1 flex w-full">
            {/* Left categories sidebar stretches down seamlessly to footer */}
            <Sidebar className="hidden md:flex self-stretch" />

            {/* Dynamic routed page content */}
            <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 overflow-x-hidden">
            <Outlet />
            </main>
        </div>

        {/* Global footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800/80 py-4 text-center text-xs text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 transition-colors">
                © 2026 10X Shop. Built for Front-end Diploma Defense.
        </footer>
        </div>
    );
}