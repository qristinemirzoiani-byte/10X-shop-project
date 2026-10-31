    import React from 'react';
    import { Link } from 'react-router';
    import { Trash2 } from 'lucide-react';
    import type { Order } from '../types/order';
    import { formatPrice } from '../utils/format';

    export interface OrderCardProps {
    order: Order;
    status: {
        label: string;
        icon: React.ReactNode;
        badgeClass: string;
    };
    onCancel?: (orderId: number) => void;
    }

    export function OrderCard({ order, status, onCancel }: OrderCardProps) {
    const totalItems = order.items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-sm hover:border-pink-500/40 transition space-y-4">
        {/* Order Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/60 pb-4">
            <div className="flex items-center gap-3">
            <Link
                to={`/orders/${order.id}`}
                className="font-mono font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:text-pink-600 dark:hover:text-pink-400 transition"
            >
                #{order.number}
            </Link>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${status.badgeClass}`}>
                {status.icon}
                {status.label}
            </span>
            </div>

            {/* Right side: Date and Cancel button */}
            <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 dark:text-slate-400">
                {new Date(order.placedAt).toLocaleDateString()} {new Date(order.placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>

            {onCancel && (
                <button
                type="button"
                onClick={() => onCancel(order.id)}
                title="Cancel this order"
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-900/60 border border-rose-800/60 rounded-xl transition cursor-pointer"
                >
                <Trash2 className="w-3 h-3" />
                <span>Cancel</span>
                </button>
            )}
            </div>
        </div>

        {/* Items Preview */}
        <div className="space-y-2">
            {order.items.map((item, idx) => {
            const itemKey = (item as any).productId || (item as any).id || idx;
            return (
                <div key={itemKey} className="flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-3">
                    <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-10 h-10 object-cover rounded-lg bg-slate-800 border border-slate-700/60"
                    />
                    <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{item.title}</p>
                    <p className="text-slate-400 text-xs">Qty: {item.quantity}</p>
                    </div>
                </div>
                <span className="font-semibold text-slate-900 dark:text-white">
                    {formatPrice(item.price * item.quantity)}
                </span>
                </div>
            );
            })}
        </div>

        {/* Order Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/60 text-xs sm:text-sm">
            <span className="text-slate-500 dark:text-slate-400">
            Total ({totalItems} {totalItems === 1 ? 'item' : 'items'}):
            </span>
            <div className="flex items-center gap-3">
            <span className="text-base font-black text-pink-500">
                {formatPrice(order.total)}
            </span>
            <Link
                to={`/orders/${order.id}`}
                className="text-xs font-bold text-pink-600 dark:text-pink-400 hover:underline"
            >
                View Details →
            </Link>
            </div>
        </div>
        </div>
    );
}

export default OrderCard;