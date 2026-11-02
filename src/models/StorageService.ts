import { isCartState, type CartState } from '../types/cart';
import { isOrderArray, type Order } from '../types/order';
import { isReviewsRecord, type Review } from '../types/products';
import { isAuthUser, type AuthUser } from '../types/user';
import { isTheme, type Theme } from '../types/theme';

export class StorageService<T> {
    private readonly key: string;
    private readonly isValue: (value: unknown) => value is T;

    constructor(key: string, isValue: (value: unknown) => value is T) {
        this.key = key;
        this.isValue = isValue;
    }

    get(): T | null {
        try {
            const raw = localStorage.getItem(this.key);
            if (!raw) return null;
            const parsed: unknown = JSON.parse(raw);
            if (!this.isValue(parsed)) {
                console.warn(`[StorageService] Invalid stored data for key "${this.key}".`);
                return null;
            }
            return parsed;
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

export const cartStorage = new StorageService<CartState>(STORAGE_KEYS.cart, isCartState);
export const ordersStorage = new StorageService<Order[]>(STORAGE_KEYS.orders, isOrderArray);
export const reviewsStorage = new StorageService<Record<string, Review[]>>(STORAGE_KEYS.reviews, isReviewsRecord);
export const userStorage = new StorageService<AuthUser>(STORAGE_KEYS.user, isAuthUser);
export const themeStorage = new StorageService<Theme>(STORAGE_KEYS.theme, isTheme);
