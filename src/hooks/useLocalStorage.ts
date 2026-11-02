import { useCallback, useEffect, useMemo, useState } from 'react';
import { StorageService } from '../models/StorageService';

export function useLocalStorage<T>(
    key: string,
    initialValue: T,
    isValue: (value: unknown) => value is T,
): [T, (value: T) => void] {
    const storage = useMemo(() => new StorageService(key, isValue), [key, isValue]);
    const [value, setValue] = useState<T>(() => {
        return storage.get() ?? initialValue;
    });

    useEffect(() => {
        storage.set(value);
    }, [storage, value]);

    const updateValue = useCallback((nextValue: T) => {
        setValue(nextValue);
    }, []);

    return [value, updateValue];
}
