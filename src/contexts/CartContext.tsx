
import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import { cartReducer } from './cart.reducer';
import type { CartItem, CartState } from '../types/cart';
import type { Product } from '../types/products';
import { Cart } from '../types/cart';
import { STORAGE_KEYS } from '../models/StorageService';
import { useToast } from './ToastContext';

interface CartContextType {
    state: CartState;
    cart: Cart;
    addItem: (product: Product, qty?: number) => boolean;
    addItems: (items: Array<{ product: Product; qty: number }>) => boolean;
    setQuantity: (productId: number, qty: number) => void;
    removeItem: (productId: number) => void;
    clearCart: () => void;
    applyPromo: (code: string) => boolean;
    removePromo: () => void;
}

const initialCartState: CartState = {
    items: [],
    promoCode: null,
};

function initCartState(): CartState {
    try {
    const raw = localStorage.getItem(STORAGE_KEYS.cart);
    if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed?.items)) {
        const items = (parsed.items as CartItem[])
            .filter((item) => Number.isInteger(item.stock) && item.stock > 0)
            .map((item) => ({
                ...item,
                quantity: Math.min(item.stock, Math.max(1, Math.floor(item.quantity))),
            }));
        return {
            items,
            promoCode: typeof parsed.promoCode === 'string' ? parsed.promoCode : null,
        };
    }
    }
} catch (err) {
    console.warn('Failed to parse cart from localStorage:', err);
    }
    return initialCartState;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
const [state, dispatch] = useReducer(cartReducer, initialCartState, initCartState);
const { showToast } = useToast();

useEffect(() => {
    try {
            localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(state));
        } catch (err) {
            console.warn('Failed to save cart to localStorage:', err);
    }
}, [state]);

const cart = useMemo(() => new Cart(state.items, state.promoCode), [state.items, state.promoCode]);

const addItem = (product: Product, qty: number = 1): boolean => {
    if (product.stock <= 0) {
        showToast('This product is out of stock', 'error');
        return false;
    }

    const currentItem = state.items.find((i) => i.productId === product.id);
    const currentQty = currentItem ? currentItem.quantity : 0;

    if (currentQty + qty > product.stock) {
        showToast(`Cannot add more than available stock (${product.stock})`, 'error');
        return false;
    }

    dispatch({ type: 'ADD_ITEM', product, qty });
    showToast('Added to cart ✓', 'success');
    return true;
};

const addItems = (items: Array<{ product: Product; qty: number }>): boolean => {
    const additions = new Map<number, { product: Product; qty: number }>();

    for (const { product, qty } of items) {
        if (!Number.isInteger(qty) || qty <= 0 || !Number.isInteger(product.stock) || product.stock <= 0) {
            showToast('Unable to reorder: one or more items are unavailable', 'error');
            return false;
        }

        const existingAddition = additions.get(product.id);
        additions.set(product.id, {
            product: existingAddition
                ? { ...product, stock: Math.min(product.stock, existingAddition.product.stock) }
                : product,
            qty: (existingAddition?.qty ?? 0) + qty,
        });
    }

    for (const { product, qty } of additions.values()) {
        const currentQty = state.items.find((item) => item.productId === product.id)?.quantity ?? 0;
        if (currentQty + qty > product.stock) {
            showToast(`Unable to reorder: available stock for ${product.title} is insufficient`, 'error');
            return false;
        }
    }

    for (const { product, qty } of additions.values()) {
        dispatch({ type: 'ADD_ITEM', product, qty });
    }
    showToast('Items added to cart ✓', 'success');
    return true;
};

const setQuantity = (productId: number, qty: number) => {
    const currentItem = state.items.find((i) => i.productId === productId);
    if (currentItem && currentItem.stock <= 0) {
        dispatch({ type: 'REMOVE_ITEM', productId });
        showToast('Out-of-stock item removed from cart', 'info');
        return;
    }

    if (currentItem && qty > currentItem.stock) {
        showToast(`Cannot exceed available stock (${currentItem.stock})`, 'error');
        dispatch({ type: 'SET_QTY', productId, qty: currentItem.stock });
        return;
    }
    dispatch({ type: 'SET_QTY', productId, qty });
};

const removeItem = (productId: number) => {
    dispatch({ type: 'REMOVE_ITEM', productId });
    showToast('Removed from cart', 'info');
};

const clearCart = () => {
    dispatch({ type: 'CLEAR' });
};

const applyPromo = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === '10X10') {
        dispatch({ type: 'APPLY_PROMO', code: clean });
        showToast('Promo code 10X10 applied! (10% off)', 'success');
        return true;
        } else {
        showToast('Invalid promo code', 'error');
        return false;
        }
};

const removePromo = () => {
    dispatch({ type: 'REMOVE_PROMO' });
    showToast('Promo code removed', 'info');
};

return (
    <CartContext.Provider
        value={{
        state,
        cart,
        addItem,
        addItems,
        setQuantity,
        removeItem,
        clearCart,
        applyPromo,
        removePromo,
        }}
    >
        {children}
    </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
}
