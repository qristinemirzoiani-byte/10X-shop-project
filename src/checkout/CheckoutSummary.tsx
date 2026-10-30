    import { ShieldCheck } from 'lucide-react';
    import type { CartItem } from '../types/cart';
    import type { Cart } from '../types/cart';
    import { formatPrice, discountedPrice } from '../utils/format';

    interface CheckoutSummaryProps {
    items: CartItem[];
    cart: Cart;
    }

    export function CheckoutSummary({ items, cart }: CheckoutSummaryProps) {
    return (
        <div className="space-y-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4">
            Order Items ({cart.itemCount})
            </h3>

            <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 pr-1 space-y-2">
            {items.map((item) => {
                const itemPrice = discountedPrice(item.price, item.discountPercentage);
                return (
                <div key={item.productId} className="py-2.5 flex items-center gap-3">
                    <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 object-contain p-1 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {item.title}
                    </p>
                    <p className="text-[11px] text-slate-500">
                        {item.quantity} × {formatPrice(itemPrice)}
                    </p>
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white shrink-0">
                    {formatPrice(itemPrice * item.quantity)}
                    </span>
                </div>
                );
            })}
            </div>

            {/* Calculations */}
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal</span>
                <span>{formatPrice(cart.subtotal())}</span>
            </div>
            {cart.discount() > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                <span>Discount ({cart.getPromoCode()})</span>
                <span>−{formatPrice(cart.discount())}</span>
                </div>
            )}
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Shipping</span>
                <span>
                {cart.shipping() === 0 ? 'Free' : formatPrice(cart.shipping())}
                </span>
            </div>
            <div className="flex justify-between font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800 text-sm">
                <span>Total</span>
                <span className="text-indigo-600 dark:text-indigo-400">
                {formatPrice(cart.total())}
                </span>
            </div>
            </div>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-xs text-indigo-900 dark:text-indigo-200">
            <span className="font-semibold block mb-0.5">Secure Transaction</span>
            Your data is processed safely in client state. No actual card charged.
            </div>
        </div>
        </div>
    );
}

export default CheckoutSummary;