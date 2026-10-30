// pages/OrderDetailsPage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import {
    ArrowLeft,
    CheckCircle2,
    Clock,
    Truck,
    RotateCcw,
    MapPin,
    } from 'lucide-react';
    import type { Order, OrderStatus } from '../types/order';
    import { OrderModel } from '../models/Order';
    import { STORAGE_KEYS } from '../models/StorageService';
    import { formatPrice, formatDate, discountedPrice } from '../utils/format';
    import { useCart } from '../contexts/CartContext';
    import { useToast } from '../contexts/ToastContext';
    import NotFoundPage from '../pages/NotFoundPage';

    export default function OrderDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addItem } = useCart();
    const { showToast } = useToast();

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState<Date>(new Date());

    useEffect(() => {
        try {
        const stored = localStorage.getItem(STORAGE_KEYS.orders);
        if (stored) {
            const parsed: Order[] = JSON.parse(stored);
            const match = parsed.find((o) => String(o.id) === id);
            if (match) {
            setOrder(match);
            }
        }
        } catch (err) {
        console.warn('Failed to parse order details:', err);
        } finally {
        setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        const timer = setInterval(() => {
        setCurrentTime(new Date());
        }, 15000);
        return () => clearInterval(timer);
    }, []);

    if (loading) {
        return <div className="py-12 text-center text-slate-400">Loading order details...</div>;
    }

    if (!order) {
        return <NotFoundPage />;
    }

    const currentStatus: OrderStatus = OrderModel.getStatus(order, currentTime);

    const handleReorder = () => {
        order.items.forEach((item) => {
        addItem(
            {
            id: item.productId,
            title: item.title,
            description: '',
            category: '',
            price: item.price,
            discountPercentage: item.discountPercentage,
            rating: 5,
            stock: item.stock,
            thumbnail: item.thumbnail,
            images: [item.thumbnail],
            reviews: [],
            },
            item.quantity
        );
        });
        showToast('Items added to cart ✓', 'success');
        navigate('/cart');
    };

    const steps: OrderStatus[] = ['Processing', 'Shipped', 'Delivered'];
    const currentStepIndex = steps.indexOf(currentStatus);

    return (
        <div className="space-y-8">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
            <button
                type="button"
                onClick={() => navigate('/orders')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition mb-2"
            >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Orders
            </button>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                <span>Order #{order.number}</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
                Placed on {formatDate(order.placedAt)}
            </p>
            </div>

            <button
            type="button"
            onClick={handleReorder}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition active:scale-95"
            >
            <RotateCcw className="w-4 h-4" />
            Reorder Items
            </button>
        </div>

        {/* Status Timeline */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-6">
            Delivery Timeline
            </h3>

            <div className="grid grid-cols-3 gap-2 relative">
            {/* Progress bar background line */}
            <div className="absolute top-5 left-1/6 right-1/6 h-1 bg-slate-200 dark:bg-slate-800 z-0" />
            <div
                className="absolute top-5 left-1/6 h-1 bg-indigo-600 transition-all duration-500 z-0"
                style={{
                width: currentStepIndex === 0 ? '0%' : currentStepIndex === 1 ? '50%' : '100%',
                }}
            />

            {steps.map((step, idx) => {
                const isCompleted = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                <div key={step} className="flex flex-col items-center text-center z-10">
                    <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                        isCompleted
                        ? 'bg-indigo-600 text-white ring-4 ring-indigo-50 dark:ring-indigo-950/60'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-300 dark:border-slate-700'
                    }`}
                    >
                    {idx === 0 && <Clock className="w-5 h-5" />}
                    {idx === 1 && <Truck className="w-5 h-5" />}
                    {idx === 2 && <CheckCircle2 className="w-5 h-5" />}
                    </div>
                    <span
                    className={`mt-2 text-xs font-semibold ${
                        isCurrent
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : isCompleted
                        ? 'text-slate-800 dark:text-slate-200'
                        : 'text-slate-400'
                    }`}
                    >
                    {step}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                    {idx === 0 && '< 1 min'}
                    {idx === 1 && '1–3 mins'}
                    {idx === 2 && '> 3 mins'}
                    </span>
                </div>
                );
            })}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column: Items Table */}
            <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 font-bold text-sm text-slate-900 dark:text-white">
                Ordered Products ({order.items.length})
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {order.items.map((item) => {
                    const itemPrice = discountedPrice(item.price, item.discountPercentage);
                    const lineTotal = itemPrice * item.quantity;

                    return (
                    <div key={item.productId} className="p-4 sm:p-6 flex items-center gap-4">
                        <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 object-contain p-1.5 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                        <Link
                            to={`/products/${item.productId}`}
                            className="font-bold text-sm text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition truncate block"
                        >
                            {item.title}
                        </Link>
                        <div className="text-xs text-slate-500 mt-0.5">
                            {item.quantity} × {formatPrice(itemPrice)}
                        </div>
                        </div>
                        <div className="text-right shrink-0 font-bold text-sm text-slate-900 dark:text-white">
                        {formatPrice(lineTotal)}
                        </div>
                    </div>
                    );
                })}
                </div>
            </div>
            </div>

            {/* Right Column: Shipping & Summary */}
            <div className="space-y-6">
            {/* Shipping Info */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Delivery Details
                </h3>
                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1 leading-relaxed">
                <p className="font-semibold text-slate-900 dark:text-white">
                    {order.shipping.fullName}
                </p>
                <p>{order.shipping.address}</p>
                <p>
                    {order.shipping.city}
                    {order.shipping.postalCode ? `, ${order.shipping.postalCode}` : ''}
                </p>
                <p>{order.shipping.country || 'Georgia'}</p>
                <p className="pt-2 text-slate-500">Contact: {order.shipping.phone}</p>
                <p className="text-slate-500">Email: {order.shipping.email}</p>
                </div>
            </div>

            {/* Totals Breakdown */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
                Payment Summary
                </h3>
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                    {formatPrice(order.subtotal)}
                </span>
                </div>
                {order.discount > 0 && (
                <div className="flex justify-between text-xs text-emerald-600 font-medium">
                    <span>Discount</span>
                    <span>−{formatPrice(order.discount)}</span>
                </div>
                )}
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                <span>Shipping</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                    {order.shippingCost === 0 ? 'Free' : formatPrice(order.shippingCost)}
                </span>
                </div>
                <div className="flex justify-between text-base font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Total</span>
                <span className="text-indigo-600 dark:text-indigo-400">
                    {formatPrice(order.total)}
                </span>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
}
