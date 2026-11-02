import { useCallback, useEffect, useState } from 'react';
import type { AsyncState } from '../types/api';

interface FetchResult<T> {
    key: string;
    attempt: number;
    state: AsyncState<T>;
}

export function useFetch<T>(
    url: string,
    fetcher: (signal: AbortSignal) => Promise<T>,
): { state: AsyncState<T>; retry: () => void } {
    const [attempt, setAttempt] = useState(0);
    const [result, setResult] = useState<FetchResult<T>>({
        key: url,
        attempt,
        state: { status: 'loading' },
    });

    useEffect(() => {
        const controller = new AbortController();

        fetcher(controller.signal).then(
            (data) => {
                if (!controller.signal.aborted) {
                    setResult({ key: url, attempt, state: { status: 'success', data } });
                }
            },
            (error: unknown) => {
                if (controller.signal.aborted) return;
                const message = error instanceof Error ? error.message : 'Request failed';
                setResult({ key: url, attempt, state: { status: 'error', message } });
            },
        );

        return () => controller.abort();
    }, [attempt, fetcher, url]);

    const retry = useCallback(() => setAttempt((current) => current + 1), []);
    const state = result.key === url && result.attempt === attempt
        ? result.state
        : { status: 'loading' as const };

    return { state, retry };
}
