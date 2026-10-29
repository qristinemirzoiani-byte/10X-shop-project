import { Link, useNavigate } from 'react-router';
import { ShoppingCart, Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { CartSummary } from '../cart/CartSummary';
import { CartItem } from '../cart/CartItem';

export default function CartPage() {
    const { state, setQuantity, removeItem, clearCart } = useCart();
    const navigate = useNavigate();

    const handleClearCart = () => {
        if (window.confirm('Clear the cart? This cannot be undone.')) {
            clearCart();
        }
    };

    const handleProceedToCheckout = () => {
        navigate('/checkout');
    };

    if (state.items.length === 0) {
        return (
            <div className="max-w-lg mx-auto py-16 text-center space-y-6">
                <div className="w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center shadow-inner">
                    <ShoppingCart className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                        Your cart is empty.
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                        Looks like you haven't added anything to your cart yet. Explore our catalog to find great deals!
                    </p>
                </div>
                <div>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition active:scale-95"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        Browse products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Shopping Cart
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Review your chosen items before proceeding to checkout
                    </p>
                </div>

                <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Continue Shopping
                </Link>
            </div>

            {/* Main Grid: Left Items List, Right Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Column: Items */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm divide-y divide-slate-100 dark:divide-slate-800">
                        {state.items.map((item) => (
                            <CartItem
                                key={item.productId}
                                item={item}
                                onUpdateQuantity={setQuantity}
                                onRemove={removeItem}
                            />
                        ))}
                    </div>

                    {/* Under List Actions: Clear Cart */}
                    <div className="flex justify-between items-center pt-2">
                        <button
                            type="button"
                            onClick={handleClearCart}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 transition cursor-pointer"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            Clear cart
                        </button>
                        <span className="text-xs text-slate-400">
                            {state.items.length} unique {state.items.length === 1 ? 'item' : 'items'} in cart
                        </span>
                    </div>
                </div>

                {/* Right Column: Summary Card */}
                <div className="lg:col-span-1">
                    <CartSummary onCheckout={handleProceedToCheckout} />
                </div>
            </div>
        </div>
    );
}