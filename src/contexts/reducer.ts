    // context/cart.reducer.ts
    import type { CartState } from '../types/cart';
    import type { Product } from '../types/products';

    export type CartAction =
    | { type: 'ADD_ITEM'; product: Product; qty: number }
    | { type: 'SET_QTY'; productId: number; qty: number }
    | { type: 'REMOVE_ITEM'; productId: number }
    | { type: 'CLEAR' }
    | { type: 'APPLY_PROMO'; code: string }
    | { type: 'REMOVE_PROMO' };

    export function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case 'ADD_ITEM': {
        const { product, qty } = action;
        if (qty <= 0) return state;

        const existingIndex = state.items.findIndex((item) => item.productId === product.id);

        if (existingIndex > -1) {
            const existing = state.items[existingIndex];
            const newQty = existing.quantity + qty;
            // Don't exceed stock limit if stock is known
            const finalQty = Math.min(newQty, product.stock);

            const updatedItems = [...state.items];
            updatedItems[existingIndex] = {
            ...existing,
            quantity: finalQty,
            };

            return { ...state, items: updatedItems };
        } else {
            const finalQty = Math.min(qty, product.stock);
            const newItem = {
            productId: product.id,
            title: product.title,
            thumbnail: product.thumbnail,
            price: product.price,
            discountPercentage: product.discountPercentage,
            stock: product.stock,
            quantity: finalQty,
            };

            return {
            ...state,
            items: [...state.items, newItem],
            };
        }
        }

        case 'SET_QTY': {
        const { productId, qty } = action;
        if (qty <= 0) {
            return {
            ...state,
            items: state.items.filter((i) => i.productId !== productId),
            };
        }

        const updated = state.items.map((item) => {
            if (item.productId === productId) {
            const clamped = Math.min(qty, item.stock);
            return { ...item, quantity: clamped };
            }
            return item;
        });

        return { ...state, items: updated };
        }

        case 'REMOVE_ITEM': {
        return {
            ...state,
            items: state.items.filter((i) => i.productId !== action.productId),
        };
        }

        case 'CLEAR': {
        return {
            items: [],
            promoCode: null,
        };
        }

        case 'APPLY_PROMO': {
        return {
            ...state,
            promoCode: action.code.trim().toUpperCase(),
        };
        }

        case 'REMOVE_PROMO': {
        return {
            ...state,
            promoCode: null,
        };
        }

        default: {
        const _exhaustive: never = action;
        return state;
        }
    }
}
