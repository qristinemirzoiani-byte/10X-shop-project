import { Cart } from '../types/cart';
import type { Order, OrderStatus, ShippingInfo } from '../types/order';

export class OrderModel {
    static create(cart: Cart, shipping: ShippingInfo, orderCount = 0): Order {
        return {
            id: Date.now(),
            number: `10X-${String(orderCount + 1).padStart(5, '0')}`,
            items: cart.getItems(),
            shipping,
            subtotal: cart.subtotal(),
            discount: cart.discount(),
            shippingCost: cart.shipping(),
            total: cart.total(),
            placedAt: new Date().toISOString(),
        };
    }

    static getStatus(order: Order, now: Date = new Date()): OrderStatus {
        const elapsedMs = now.getTime() - new Date(order.placedAt).getTime();

        if (elapsedMs < 60 * 1000) return 'Processing';
        if (elapsedMs < 3 * 60 * 1000) return 'Shipped';
        return 'Delivered';
    }
}
