import { useCallback, useEffect, useState } from 'react';
import type { AsyncState } from '../types/api';

interface FetchResult<T> {
    key: string;
    attempt: number;
    state: AsyncState<T>;
}

export function useFetch<T>(
    key: string,
    fetcher: (signal: AbortSignal) => Promise<T>,
): { state: AsyncState<T>; retry: () => void } {
    const [attempt, setAttempt] = useState(0);
    const [result, setResult] = useState<FetchResult<T>>({
        key,
        attempt,
        state: { status: 'loading' },
    });

    useEffect(() => {
        const controller = new AbortController();

        fetcher(controller.signal).then(
            (data) => {
                if (!controller.signal.aborted) {
                    setResult({ key, attempt, state: { status: 'success', data } });
                }
            },
            (error: unknown) => {
                if (controller.signal.aborted) return;
                const message = error instanceof Error ? error.message : 'Request failed';
                setResult({ key, attempt, state: { status: 'error', message } });
            },
        );

        return () => controller.abort();
    }, [attempt, fetcher, key]);

    const retry = useCallback(() => setAttempt((current) => current + 1), []);
    const state = result.key === key && result.attempt === attempt
        ? result.state
        : { status: 'loading' as const };

    return { state, retry };
}
