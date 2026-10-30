
import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import { cartReducer } from './cart.reducer';
import type { CartState } from '../types/cart';
import type { Product } from '../types/products';
import { Cart } from '../types/cart';
import { STORAGE_KEYS } from '../models/StorageService';
import { useToast } from './ToastContext';

interface CartContextType {
    state: CartState;
    cart: Cart;
    addItem: (product: Product, qty?: number) => boolean;
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
        return parsed as CartState;
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

const setQuantity = (productId: number, qty: number) => {
    const currentItem = state.items.find((i) => i.productId === productId);
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
