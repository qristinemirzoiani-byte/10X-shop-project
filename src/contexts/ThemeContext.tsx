import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
    type Theme = 'dark' | 'light';

    interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    }

    const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

    export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>(() => {
        return (localStorage.getItem('shop_theme') as Theme) || 'dark';
    });

    // Save to localStorage when theme changes
    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
            root.setAttribute('data-theme', 'dark');
        } else {
            root.classList.remove('dark');
            root.setAttribute('data-theme', 'light');
        }
        localStorage.setItem('shop_theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
        {children}
        </ThemeContext.Provider>
    );
    }

    // Custom hook to consume theme anywhere in the app
    export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}