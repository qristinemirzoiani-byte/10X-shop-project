import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import type { StorageService } from '../models/StorageService';

export function useLocalStorage<T>(
    storage: StorageService<T>,
    initialValue: T,
): [T, Dispatch<SetStateAction<T>>] {
    const [value, setValue] = useState<T>(() => {
        return storage.get() ?? initialValue;
    });

    useEffect(() => {
        storage.set(value);
    }, [storage, value]);

    return [value, setValue];
}
