import { Cart } from '../types/cart';
import type { Order, OrderStatus, ShippingInfo } from '../types/order';

export class OrderModel implements Order {
    id: number;
    number: string;
    items: Order['items'];
    shipping: ShippingInfo;
    subtotal: number;
    discount: number;
    shippingCost: number;
    total: number;
    placedAt: string;

    constructor(order: Order) {
        this.id = order.id;
        this.number = order.number;
        this.items = order.items;
        this.shipping = order.shipping;
        this.subtotal = order.subtotal;
        this.discount = order.discount;
        this.shippingCost = order.shippingCost;
        this.total = order.total;
        this.placedAt = order.placedAt;
    }

    toJSON(): Order {
        return {
            id: this.id,
            number: this.number,
            items: this.items.map((item) => ({ ...item })),
            shipping: { ...this.shipping },
            subtotal: this.subtotal,
            discount: this.discount,
            shippingCost: this.shippingCost,
            total: this.total,
            placedAt: this.placedAt,
        };
    }

    static create(cart: Cart, shipping: ShippingInfo, orderCount = 0): OrderModel {
        return new OrderModel({
            id: Date.now(),
            number: `10X-${String(orderCount + 1).padStart(5, '0')}`,
            items: cart.getItems(),
            shipping,
            subtotal: cart.subtotal(),
            discount: cart.discount(),
            shippingCost: cart.shipping(),
            total: cart.total(),
            placedAt: new Date().toISOString(),
        });
    }

    static getStatus(order: Order, now: Date = new Date()): OrderStatus {
        const elapsedMs = now.getTime() - new Date(order.placedAt).getTime();

        if (elapsedMs < 60 * 1000) return 'Processing';
        if (elapsedMs < 3 * 60 * 1000) return 'Shipped';
        return 'Delivered';
    }
}
