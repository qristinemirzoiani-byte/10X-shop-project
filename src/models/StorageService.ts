export class StorageService<T> {
    private readonly key: string;


    constructor(key: string) {
        this.key = key;
    }

    get(): T | null {
        try {
            const raw = localStorage.getItem(this.key);
            if (!raw) return null;
            return JSON.parse(raw) as T;
        } catch (err: unknown) {
            console.warn(`[StorageService] Failed to parse item for key "${this.key}":`, err);
            return null;
        }
    }

    set(value: T): void {
        try {
            localStorage.setItem(this.key, JSON.stringify(value));
        } catch (err: unknown) {
            console.warn(`[StorageService] Failed to set item for key "${this.key}":`, err);
        }
    }

    remove(): void {
        try {
            localStorage.removeItem(this.key);
        } catch (err: unknown) {
            console.warn(`[StorageService] Failed to remove item for key "${this.key}":`, err);
        }
    }
}

export const STORAGE_KEYS = {
    cart: 'shop_cart',
    orders: 'shop_orders',
    reviews: 'shop_reviews',
    theme: 'shop_theme',
    user: 'shop_user',
} as const;
