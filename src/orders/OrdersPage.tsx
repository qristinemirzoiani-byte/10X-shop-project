import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router';
import { Package, Clock, Truck, CheckCircle2, ShoppingBag, PlusCircle, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { OrderCard } from '../orders/OrderCard';
import type { Order } from '../types/order';
import { OrderModel } from '../models/Order';
import { STORAGE_KEYS } from '../models/StorageService';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function OrdersPage() {
    const { user } = useAuth();
    const isAuthenticated = user.isLoggedIn;

    const [orders, setOrders] = useLocalStorage<Order[]>(STORAGE_KEYS.orders, []);

    const [currentTime, setCurrentTime] = useState<Date>(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: '/orders' }} replace />;
    }

    const getOrderStatus = (order: Order) => {
        const label = OrderModel.getStatus(order, currentTime);

        switch (label) {
            case 'Processing':
                return {
                    label,
                    icon: <Clock className="w-3.5 h-3.5 text-slate-400" />,
                    badgeClass: 'bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600',
                };
            case 'Shipped':
                return {
                    label,
                    icon: <Truck className="w-3.5 h-3.5 text-blue-400" />,
                    badgeClass: 'bg-blue-950/40 text-blue-400 border-blue-500/30',
                };
            case 'Delivered':
                return {
                    label,
                    icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
                    badgeClass: 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30',
                };
        }
    };

    const handleCreateMockOrder = () => {
        const mockOrder: Order = {
            id: Date.now(),
            number: `10X-${String(orders.length + 1).padStart(5, '0')}`,
            placedAt: new Date().toISOString(),
            subtotal: 129.99,
            discount: 0,
            shippingCost: 0,
            total: 129.99,
            shipping: {
                fullName: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username || 'Demo User',
                email: user.email || 'demo@example.com',
                phone: user.phone || '+995 555 12 34 56',
                address: 'Rustaveli Ave 12',
                city: 'Tbilisi',
                country: 'Georgia',
            },
            items: [
                {
                    productId: 1,
                    title: 'Wireless Noise-Canceling Headphones',
                    price: 99.99,
                    discountPercentage: 0,
                    quantity: 1,
                    stock: 10,
                    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&q=80',
                },
                {
                    productId: 2,
                    title: 'Minimalist Leather Watch',
                    price: 30.00,
                    discountPercentage: 0,
                    quantity: 1,
                    stock: 5,
                    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&q=80',
                },
            ],
        };

        const updated = [mockOrder, ...orders];
        setOrders(updated);
    };

    const handleCancelOrder = (orderId: number) => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            const updated = orders.filter((o) => o.id !== orderId);
            setOrders(updated);
        }
    };

    const handleClearAllOrders = () => {
        if (window.confirm('Clear all orders from history?')) {
            setOrders([]);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-5">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        Orders History
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Track your previous purchases and real-time delivery status
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {orders.length > 0 && (
                        <button
                            type="button"
                            onClick={handleClearAllOrders}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 transition cursor-pointer"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Clear All</span>
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={handleCreateMockOrder}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl bg-pink-500/10 text-pink-500 hover:bg-pink-500/20 border border-pink-500/30 transition cursor-pointer"
                    >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Add Mock Order</span>
                    </button>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-12 text-center space-y-4 shadow-sm">
                    <div className="w-16 h-16 rounded-2xl bg-pink-500/10 text-pink-500 mx-auto flex items-center justify-center">
                        <Package className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        You have no orders yet
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                        Once you place an order, it will appear here so you can track its simulated delivery timeline.
                    </p>
                    <div className="pt-2">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-linear-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-sm shadow-md transition cursor-pointer"
                        >
                            <ShoppingBag className="w-4 h-4" />
                            <span>Browse Catalog</span>
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <OrderCard 
                            key={order.id} 
                            order={order} 
                            status={getOrderStatus(order)} 
                            onCancel={handleCancelOrder}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}