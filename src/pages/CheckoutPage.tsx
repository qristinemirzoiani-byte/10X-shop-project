    import { useState } from 'react';
    import { Link, Navigate } from 'react-router';
    import { AlertCircle, CheckCircle2, PackageCheck, ShoppingBag } from 'lucide-react';
    import { useAuth } from '../contexts/AuthContext';
    import { useCart } from '../contexts/CartContext';
    import { OrderModel } from '../models/Order';
    import { STORAGE_KEYS } from '../models/StorageService';
    import { formatPrice } from '../utils/format';
    import type { ShippingInfo, Order } from '../types/order';
    import { CheckoutForm } from '../checkout/CheckoutForm';
    import { CheckoutSummary } from '../checkout/CheckoutSummary';

    export default function CheckoutPage() {
    const { user } = useAuth();
    const { state, cart, clearCart } = useCart();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderError, setOrderError] = useState<string | null>(null);
    const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

    const initialShipping: ShippingInfo = {
        fullName: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        address: '',
        city: '',
        postalCode: '',
        country: 'Georgia',
        paymentMethod: 'Cash on delivery',
    };

    const handlePlaceOrder = (formData: ShippingInfo) => {
        setIsSubmitting(true);
        setOrderError(null);

        setTimeout(() => {
        try {
            let existingOrders: unknown[] = [];
            const stored = localStorage.getItem(STORAGE_KEYS.orders);
            if (stored) {
                const parsed: unknown = JSON.parse(stored);
                if (!Array.isArray(parsed)) {
                    throw new Error('Stored order history is invalid');
                }
                existingOrders = parsed;
            }

            const newOrder = OrderModel.create(cart, formData, existingOrders.length);
            localStorage.setItem(
                STORAGE_KEYS.orders,
                JSON.stringify([newOrder, ...existingOrders]),
            );

            clearCart();
            setPlacedOrder(newOrder);
        } catch (err) {
            console.error('Failed to place order:', err);
            setOrderError(
                'We could not place your order. Please try again. Your form details and cart have been kept.',
            );
        } finally {
            setIsSubmitting(false);
        }
        }, 600);
    };

    // If order was just placed, display Thank you confirmation view
    if (placedOrder) {
        return (
        <div className="max-w-xl mx-auto py-12 text-center space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest font-bold text-emerald-600 dark:text-emerald-400">
                Order Confirmation
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Thank you! Your order has been placed.
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
                We received your order and are preparing it for delivery.
            </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-left shadow-sm space-y-3">
            <div className="flex justify-between text-xs pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Order Number:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                #{placedOrder.number}
                </span>
            </div>
            <div className="flex justify-between text-xs pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Total Paid:</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                {formatPrice(placedOrder.total)}
                </span>
            </div>
            <div className="flex justify-between text-xs pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Delivering to:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 text-right">
                {placedOrder.shipping.fullName}, {placedOrder.shipping.address}, {placedOrder.shipping.city}
                </span>
            </div>
            <div className="flex justify-between text-xs">
                <span className="text-slate-500">Initial Status:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                Processing
                </span>
            </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
                to={`/orders/${placedOrder.id}`}
                state={{ justPlaced: true }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition cursor-pointer"
            >
                <PackageCheck className="w-4 h-4" />
                View Order Details
            </Link>
            <Link
                to="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm transition cursor-pointer"
            >
                <ShoppingBag className="w-4 h-4" />
                Back to Catalog
            </Link>
            </div>
        </div>
        );
    }

    // If cart is empty
    if (state.items.length === 0) {
    return (
        <Navigate
            to="/cart"
            replace
            state={{ message: 'Your cart is empty. Add products before checking out.' }}
        />
    );
}

    return (
        <div className="space-y-8">
        {/* Page Title */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Checkout
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Provide your shipping details to complete your order
            </p>
        </div>

        {orderError && (
            <div
                role="alert"
                className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
            >
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <p>{orderError}</p>
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column: Modular Shipping Form */}
            <div className="lg:col-span-2">
            <CheckoutForm
                initialData={initialShipping}
                totalPrice={cart.total()}
                isSubmitting={isSubmitting}
                onSubmit={handlePlaceOrder}
            />
            </div>

            {/* Right Column: Modular Summary Card */}
            <div className="lg:col-span-1">
            <CheckoutSummary items={state.items} cart={cart} />
            </div>
        </div>
        </div>
    );
}

export { CheckoutPage };