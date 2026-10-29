import { ApiError } from './ApiError';

export class ApiClient {
    // 1. Явно объявляем свойство класса (оно сотрется в JS)
    private readonly baseUrl: string;

    // 2. Убираем private readonly из аргументов конструктора
    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...((init.headers as Record<string, string>) || {}),
        };

        let res: Response;
        try {
            res = await fetch(this.baseUrl + path, { ...init, headers });
        } catch (err: unknown) {
            if ((err as Error)?.name === 'AbortError') {
                throw err;
            }
            const msg = err instanceof Error ? err.message : 'Network connection failed';
            throw new ApiError(0, msg);
        }

        if (!res.ok) {
            const errText = await res.text().catch(() => 'Request failed');
            throw new ApiError(res.status, errText || `HTTP Error ${res.status}`);
        }

        return (await res.json()) as T;
    }

    get<T>(path: string, signal?: AbortSignal): Promise<T> {
        return this.request<T>(path, { method: 'GET', signal });
    }

    post<T, B>(path: string, body: B, signal?: AbortSignal): Promise<T> {
        return this.request<T>(path, {
            method: 'POST',
            body: JSON.stringify(body),
            signal,
        });
    }
}

export const api = new ApiClient('https://dummyjson.com');
