export type Theme = 'dark' | 'light';

export function isTheme(value: unknown): value is Theme {
    return value === 'dark' || value === 'light';
}
