import type { CartState } from '../types/cart';
import type { Order } from '../types/order';
import type { Review } from '../types/products';
import type { AuthUser } from '../types/user';
import type { Theme } from '../types/theme';

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

    set(value: T): boolean {
        try {
            localStorage.setItem(this.key, JSON.stringify(value));
            return true;
        } catch (err: unknown) {
            console.warn(`[StorageService] Failed to set item for key "${this.key}":`, err);
            return false;
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

export const cartStorage = new StorageService<CartState>(STORAGE_KEYS.cart);
export const ordersStorage = new StorageService<Order[]>(STORAGE_KEYS.orders);
export const reviewsStorage = new StorageService<Record<string, Review[]>>(STORAGE_KEYS.reviews);
export const userStorage = new StorageService<AuthUser>(STORAGE_KEYS.user);
export const themeStorage = new StorageService<Theme>(STORAGE_KEYS.theme);
