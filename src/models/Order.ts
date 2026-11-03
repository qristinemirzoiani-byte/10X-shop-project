import { Cart } from '../types/cart';
import type { Order as OrderData, OrderStatus, ShippingInfo } from '../types/order';

export class Order implements OrderData {
    id: number;
    number: string;
    items: OrderData['items'];
    shipping: ShippingInfo;
    subtotal: number;
    discount: number;
    shippingCost: number;
    total: number;
    placedAt: string;

    constructor(order: OrderData) {
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

    toJSON(): OrderData {
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

    static create(cart: Cart, shipping: ShippingInfo, orderCount = 0): Order {
        return new Order({
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

    getStatus(now: Date = new Date()): OrderStatus {
        const elapsedMs = now.getTime() - new Date(this.placedAt).getTime();

        if (elapsedMs < 60 * 1000) return 'Processing';
        if (elapsedMs < 3 * 60 * 1000) return 'Shipped';
        return 'Delivered';
    }
}
