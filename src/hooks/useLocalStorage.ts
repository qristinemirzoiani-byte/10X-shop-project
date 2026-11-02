import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';

export function useLocalStorage<T>(
    key: string,
    initialValue: T,
): [T, Dispatch<SetStateAction<T>>] {
    const [value, setValue] = useState<T>(() => {
        try {
            const stored = localStorage.getItem(key);
            return stored === null ? initialValue : JSON.parse(stored) as T;
        } catch (error: unknown) {
            console.warn(`Failed to read localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error: unknown) {
            console.warn(`Failed to write localStorage key "${key}":`, error);
        }
    }, [key, value]);

    return [value, setValue];
}
