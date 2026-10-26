import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router';
import { Package, Clock, Truck, CheckCircle2, ShoppingBag, PlusCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { OrderCard } from '../components/OrderCard'; 

export interface OrderItem {
    id: number;
    title: string;
    price: number;
    quantity: number;
    thumbnail: string;
}

export interface Order {
    id: number;
    number: string;
    items: OrderItem[];
    total: number;
    placedAt: string;
}

export default function OrdersPage() {
    const { user } = useAuth();
    const isAuthenticated = user.isLoggedIn;
    const [orders, setOrders] = useState<Order[]>([]);
    const [currentTime, setCurrentTime] = useState<Date>(new Date());

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: '/orders' }} replace />;
    }

    const loadOrders = () => {
        try {
            const stored = localStorage.getItem('shop_orders');
            if (stored) {
                setOrders(JSON.parse(stored));
            }
        } catch (e) {
            console.error('Failed to load orders', e);
        }
    };

    useEffect(() => {
        loadOrders();
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const getOrderStatus = (placedAt: string) => {
        const elapsedMs = currentTime.getTime() - new Date(placedAt).getTime();
        const elapsedMinutes = elapsedMs / (1000 * 60);

        if (elapsedMinutes < 1) {
            return {
                label: 'Processing',
                icon: <Clock className="w-3.5 h-3.5 animate-spin text-amber-400" />,
                badgeClass: 'bg-amber-950/40 text-amber-400 border-amber-500/30',
            };
        } else if (elapsedMinutes < 3) {
            return {
                label: 'Shipped',
                icon: <Truck className="w-3.5 h-3.5 text-blue-400" />,
                badgeClass: 'bg-blue-950/40 text-blue-400 border-blue-500/30',
            };
        } else {
            return {
                label: 'Delivered',
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
            total: 129.99,
            items: [
                {
                    id: 1,
                    title: 'Wireless Noise-Canceling Headphones',
                    price: 99.99,
                    quantity: 1,
                    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&q=80',
                },
                {
                    id: 2,
                    title: 'Minimalist Leather Watch',
                    price: 30.00,
                    quantity: 1,
                    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&q=80',
                },
            ],
        };

        const updated = [mockOrder, ...orders];
        setOrders(updated);
        localStorage.setItem('shop_orders', JSON.stringify(updated));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 py-4">
            {/* Page Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        Orders History
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Track your previous purchases and real-time delivery status
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleCreateMockOrder}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl bg-pink-500/10 text-pink-500 hover:bg-pink-500/20 border border-pink-500/30 transition cursor-pointer"
                >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span> Add Mock Order</span>
                </button>
            </div>

            {/* Empty State */}
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
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-linear-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-sm shadow-md transition"
                        >
                            <ShoppingBag className="w-4 h-4" />
                            <span>Browse Catalog</span>
                        </Link>
                    </div>
                </div>
            ) : (
                /* Orders List */
                <div className="space-y-4">
                    {orders.map((order) => (
                        <OrderCard 
                            key={order.id} 
                            order={order} 
                            status={getOrderStatus(order.placedAt)} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
}