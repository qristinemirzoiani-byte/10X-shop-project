    import React, { createContext, useContext, useState, useEffect } from 'react';
    import type { Product } from '../types/products';
    import { useToast } from './ToastContext';

    export interface CartItem {
    product: Product;
    quantity: number;
    }

    interface CartContextType {
    items: CartItem[];
    cart: {
        items: CartItem[];
        itemCount: number;
        total: number;
    };
    totalItems: number;
    totalPrice: number;
    addItem: (product: Product, quantity?: number) => void;
    removeItem: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    }

    const CartContext = createContext<CartContextType | undefined>(undefined);

    export function CartProvider({ children }: { children: React.ReactNode }) {
    const { showToast } = useToast();

    // 1. cart state initialization with localStorage fallback
    const [items, setItems] = useState<CartItem[]>(() => {
        try {
        const saved = localStorage.getItem('shop_cart');
        return saved ? JSON.parse(saved) : [];
        } catch {
        return [];
        }
    });

    // 2. save to localStorage whenever items change
    useEffect(() => {
        try {
        localStorage.setItem('shop_cart', JSON.stringify(items));
        } catch (e) {
        console.error('Failed to save cart to localStorage', e);
        }
    }, [items]);

    // 3. item adding logic with stock check and toast notifications
    const addItem = (product: Product, quantity: number = 1) => {
        if (product.stock <= 0) {
        showToast('This product is out of stock', 'error');
        return;
        }

        setItems((prevItems) => {
        const existing = prevItems.find((item) => item.product.id === product.id);

        if (existing) {
            // if the item already exists, check if adding more exceeds stock
            const newQty = existing.quantity + quantity;
            if (newQty > product.stock) {
            showToast(`Cannot add more than available stock (${product.stock})`, 'error');
            return prevItems;
            }
            showToast('Added to cart ✓', 'success');
            return prevItems.map((item) =>
            item.product.id === product.id ? { ...item, quantity: newQty } : item
            );
        }

        // new item, check stock
        showToast('Added to cart ✓', 'success');
        return [...prevItems, { product, quantity }];
        });
    };

    // 4. delete an item from the cart 
    const removeItem = (productId: number) => {
        setItems((prev) => prev.filter((item) => item.product.id !== productId));
        showToast('Removed from cart', 'info');
    };

    // 5. change quantity (+/-)
    const updateQuantity = (productId: number, quantity: number) => {
        if (quantity <= 0) {
        removeItem(productId);
        return;
        }
        setItems((prev) =>
        prev.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
        )
        );
    };

    // 6. clear the entire cart
    const clearCart = () => {
        setItems([]);
    };

    // having total items and total price for convenience
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => {
        const finalPrice = item.product.discountPercentage > 0
        ? item.product.price * (1 - item.product.discountPercentage / 100)
        : item.product.price;
        return sum + finalPrice * item.quantity;
    }, 0);

    const cart = {
        items,
        itemCount: totalItems,
        total: totalPrice,
    };

    return (
        <CartContext.Provider
        value={{
            items,
            cart,
            totalItems,
            totalPrice,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
        }}
        >
        {children}
        </CartContext.Provider>
    );
    }

    export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}