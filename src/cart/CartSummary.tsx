// components/cart/CartSummary.tsx
import { useState } from 'react';
import { Tag, ArrowRight, Check, X, ShieldCheck } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../utils/format';

interface CartSummaryProps {
    onCheckout: () => void;
    showCheckoutButton?: boolean;
    }

export function CartSummary({ onCheckout, showCheckoutButton = true }: CartSummaryProps) {
const { cart, applyPromo, removePromo } = useCart();
const [promoInput, setPromoInput] = useState('');
const [promoError, setPromoError] = useState<string | null>(null);

const subtotal = cart.subtotal();
const discount = cart.discount();
const shipping = cart.shipping();
const total = cart.total();
const activePromo = cart.getPromoCode();

const handleApplyPromo = (e: React.FormEvent) => {
        e.preventDefault();
        setPromoError(null);
        if (!promoInput.trim()) return;

    const success = applyPromo(promoInput);
        if (success) {
        setPromoInput('');
        } else {
        setPromoError('Invalid promo code');
        }
    };

const handleRemovePromo = () => {
        removePromo();
        setPromoError(null);
    };

return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">
            Order Summary
        </h3>

        {/* Pricing Lines */}
        <div className="space-y-3 text-sm border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Subtotal</span>
            <span className="font-semibold text-slate-900 dark:text-white">
                {formatPrice(subtotal)}
            </span>
            </div>

            {discount > 0 && (
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                Discount ({activePromo} −10%)
                </span>
                <div className="flex items-center gap-2">
                <span>−{formatPrice(discount)}</span>
                <button
                    type="button"
                    onClick={handleRemovePromo}
                    title="Remove promo code"
                    className="text-slate-400 hover:text-rose-500 transition"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
                </div>
            </div>
            )}

            <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Shipping</span>
            <span className="font-semibold text-slate-900 dark:text-white">
                {shipping === 0 ? (
                <span className="text-emerald-600 dark:text-emerald-400">Free</span>
                ) : (
                formatPrice(shipping)
                )}
            </span>
            </div>

            {shipping > 0 && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Add {formatPrice(100 - subtotal)} more for free shipping!
            </p>
            )}
        </div>

        {/* Total */}
        <div className="flex justify-between items-center py-4 text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800">
            <span>Total</span>
            <span className="text-xl text-indigo-600 dark:text-indigo-400">
            {formatPrice(total)}
            </span>
        </div>

        {/* Promo Code Input */}
        <div className="mt-4">
            {!activePromo ? (
            <form onSubmit={handleApplyPromo} className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Promo code (e.g. 10X10)
                </label>
                <div className="flex gap-2">
                <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => {
                    setPromoInput(e.target.value);
                    if (promoError) setPromoError(null);
                    }}
                    placeholder="Enter 10X10"
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white uppercase placeholder:normal-case focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
                <button
                    type="submit"
                    disabled={!promoInput.trim()}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white text-xs font-semibold disabled:opacity-40 transition"
                >
                    Apply
                </button>
                </div>
                {promoError && (
                <p className="text-xs text-rose-600 dark:text-rose-400">{promoError}</p>
                )}
            </form>
            ) : (
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-medium">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Code {activePromo} applied!
                </div>
                <button
                onClick={handleRemovePromo}
                className="text-xs text-emerald-700 dark:text-emerald-300 underline hover:no-underline font-semibold"
                >
                Remove
                </button>
            </div>
            )}
        </div>

        {/* Checkout Action Button */}
        {showCheckoutButton && (
            <button
            type="button"
            onClick={onCheckout}
            disabled={cart.itemCount === 0}
            className="w-full mt-6 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition active:scale-[0.99]"
            >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
            </button>
        )}

        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Guaranteed 256-bit safe checkout</span>
        </div>
        </div>
    );
}
