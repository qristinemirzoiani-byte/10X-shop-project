import { discountedPrice } from '../utils/format';

export interface CartItem {
    productId: number;
    title: string;
    price: number;
    discountPercentage: number;
    thumbnail: string;
    quantity: number;
    stock: number;
}

export interface CartState {
    items: CartItem[];
    promoCode: string | null;
}

export interface ICart {
    subtotal(): number;
    discount(): number;
    shipping(): number;
    total(): number;
}

export class Cart implements ICart {
    static readonly FREE_SHIPPING_FROM = 100;
    static readonly SHIPPING_COST = 10;
    static readonly PROMO_CODE_DISCOUNT_PERCENT = 10; // 10X10 code gives 10%


    private readonly items: CartItem[];
    private readonly promoCode: string | null;
    constructor(items: CartItem[], promoCode: string | null = null) {
        this.items = items;
        this.promoCode = promoCode;
    }

    get itemCount(): number {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    getItems(): CartItem[] {
        return [...this.items];
    }

    getPromoCode(): string | null {
        return this.promoCode;
    }

    /**
     * Sum of discounted item price * quantity for all cart items
     */
    subtotal(): number {
        const raw = this.items.reduce((sum, item) => {
            const unitPrice = discountedPrice(item.price, item.discountPercentage);
            return sum + unitPrice * item.quantity;
        }, 0);
        return Math.round(raw * 100) / 100;
    }

    /**
     * Discount from active promo code (10X10 = 10%)
     */
    discount(): number {
        if (!this.promoCode || this.promoCode.toUpperCase() !== '10X10') {
            return 0;
        }
        const raw = this.subtotal() * (Cart.PROMO_CODE_DISCOUNT_PERCENT / 100);
        return Math.round(raw * 100) / 100;
    }

    /**
     * Shipping cost: $0 if subtotal >= 100 or empty, otherwise $10
     */
    shipping(): number {
        if (this.items.length === 0) return 0;
        if (this.subtotal() >= Cart.FREE_SHIPPING_FROM) return 0;
        return Cart.SHIPPING_COST;
    }

    /**
     * Final total = subtotal - discount + shipping
     */
    total(): number {
        if (this.items.length === 0) return 0;
        const finalVal = Math.max(0, this.subtotal() - this.discount() + this.shipping());
        return Math.round(finalVal * 100) / 100;
    }
}
