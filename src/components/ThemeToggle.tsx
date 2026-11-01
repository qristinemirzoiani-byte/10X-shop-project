    import { Sun, Moon } from 'lucide-react';
    import { useTheme } from '../contexts/ThemeContext';

    interface ThemeToggleProps {
    className?: string;
    iconClassName?: string;
    }

    export function ThemeToggle({ className, iconClassName }: ThemeToggleProps) {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
        type="button"
        onClick={toggleTheme}
        aria-label="Toggle dark/light theme"
        title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        className={
            className ||
            'p-2.5 rounded-full border border-slate-700/50 bg-black/40 hover:bg-black/60 text-slate-200 hover:text-white transition cursor-pointer shadow-sm backdrop-blur-xs'
        }
        >
        {theme === 'dark' ? (
            <Sun className={iconClassName || 'w-4 h-4 text-pink-300'} />
        ) : (
            <Moon className={iconClassName || 'w-4 h-4 text-slate-200'} />
        )}
        </button>
    );
}

export default ThemeToggle;