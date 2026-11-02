import { isCartItem, type CartItem } from './cart';

export interface ShippingInfo {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode?: string;
    country: string;
    paymentMethod?: string;
}

export interface Order {
    id: number;
    number: string;
    items: CartItem[];
    shipping: ShippingInfo;
    subtotal: number;
    discount: number;
    shippingCost: number;
    total: number;
    placedAt: string;
}

export function isOrder(value: unknown): value is Order {
    if (typeof value !== 'object' || value === null) return false;
    const order = value as Record<string, unknown>;
    const shipping = order.shipping;
    if (typeof shipping !== 'object' || shipping === null) return false;
    const shippingInfo = shipping as Record<string, unknown>;

    return Number.isInteger(order.id)
        && typeof order.number === 'string'
        && Array.isArray(order.items)
        && order.items.every(isCartItem)
        && typeof shippingInfo.fullName === 'string'
        && typeof shippingInfo.email === 'string'
        && typeof shippingInfo.phone === 'string'
        && typeof shippingInfo.address === 'string'
        && typeof shippingInfo.city === 'string'
        && typeof shippingInfo.country === 'string'
        && (shippingInfo.postalCode === undefined || typeof shippingInfo.postalCode === 'string')
        && (shippingInfo.paymentMethod === undefined || typeof shippingInfo.paymentMethod === 'string')
        && typeof order.subtotal === 'number'
        && typeof order.discount === 'number'
        && typeof order.shippingCost === 'number'
        && typeof order.total === 'number'
        && typeof order.placedAt === 'string';
}

export function isOrderArray(value: unknown): value is Order[] {
    return Array.isArray(value) && value.every(isOrder);
}

export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered';
