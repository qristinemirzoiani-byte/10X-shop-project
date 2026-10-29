// pages/CheckoutPage.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import {
  ShieldCheck,
  CheckCircle2,
  PackageCheck,
  ShoppingBag,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { OrderModel } from '../models/Order';
import { STORAGE_KEYS } from '../models/StorageService';
import { isValidEmail, isValidPhone } from '../utils/validation';
import { formatPrice, discountedPrice } from '../utils/format';
import { ShippingInfo, Order } from '../types/order';

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

export default function CheckoutPage() {
  const { user } = useAuth();
  const { state, cart, clearCart } = useCart();
  const navigate = useNavigate();

  // Controlled form inputs
  const [formData, setFormData] = useState<ShippingInfo>({
    fullName: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username || '',
    email: user.email || '',
    phone: user.phone || '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Georgia',
    paymentMethod: 'Cash on delivery',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const countries = ['Georgia', 'United States', 'Germany', 'United Kingdom', 'France', 'Poland'];

  const validate = (): boolean => {
    const errs: FormErrors = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      errs.fullName = 'Full name must be at least 3 characters';
    }

    if (!formData.email.trim() || !isValidEmail(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }

    if (!formData.phone?.trim() || !isValidPhone(formData.phone)) {
      errs.phone = 'Please enter a valid phone number';
    }

    if (!formData.address.trim() || formData.address.trim().length < 5) {
      errs.address = 'Address must be at least 5 characters';
    }

    if (!formData.city.trim()) {
      errs.city = 'City is required';
    }

        const postalClean = formData.postalCode?.trim() || '';
        if (!postalClean || postalClean.length < 4 || postalClean.length > 10) {
        errs.postalCode = 'Postal code must be 4-10 digits';
        }

        if (!formData.country?.trim()) {
        errs.country = 'Please select a country';
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleInputChange = (field: keyof ShippingInfo, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);

        // Simulate order placement
        setTimeout(() => {
        let currentOrderCount = 0;
        let existingOrders: Order[] = [];
        try {
            const stored = localStorage.getItem(STORAGE_KEYS.orders);
            if (stored) {
            existingOrders = JSON.parse(stored);
            if (Array.isArray(existingOrders)) {
                currentOrderCount = existingOrders.length;
            }
            }
        } catch {
            existingOrders = [];
        }

        const newOrder = OrderModel.create(cart, formData, currentOrderCount);

        // Save to localStorage
        try {
            const updatedOrders = [newOrder, ...existingOrders];
            localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(updatedOrders));
        } catch (err) {
            console.warn('Failed to save order to localStorage:', err);
        }

        // Clear cart
        clearCart();
        setPlacedOrder(newOrder);
        setIsSubmitting(false);
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

            {/* Order Brief Summary Box */}
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

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
                to="/orders"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition"
            >
                <PackageCheck className="w-4 h-4" />
                Track in My Orders
            </Link>
            <Link
                to="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm transition"
            >
                <ShoppingBag className="w-4 h-4" />
                Back to Catalog
            </Link>
            </div>
        </div>
        );
    }

    // If cart is empty and no order placed, return user to cart
    if (state.items.length === 0) {
        return (
        <div className="max-w-md mx-auto py-16 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Your cart is empty
            </h2>
            <p className="text-xs text-slate-500">
            You cannot checkout without items. Please add some products to your cart first.
            </p>
            <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
            >
            Go to catalog
            </Link>
        </div>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left 2 Cols: Shipping Form */}
            <div className="lg:col-span-2">
            <form
                onSubmit={handleSubmit}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6"
            >
                <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Shipping & Contact Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Full Name *
                    </label>
                    <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="e.g. John Doe"
                    className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                        errors.fullName
                        ? 'border-rose-500 focus:border-rose-500'
                        : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
                    }`}
                    />
                    {errors.fullName && (
                    <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.fullName}</p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Email Address *
                    </label>
                    <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="e.g. john@example.com"
                    className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                        errors.email
                        ? 'border-rose-500 focus:border-rose-500'
                        : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
                    }`}
                    />
                    {errors.email && (
                    <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.email}</p>
                    )}
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Phone Number * (9-15 digits)
                    </label>
                    <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="e.g. +995555123456"
                    className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                        errors.phone
                        ? 'border-rose-500 focus:border-rose-500'
                        : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
                    }`}
                    />
                    {errors.phone && (
                    <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.phone}</p>
                    )}
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Delivery Address *
                    </label>
                    <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Street name, building, apartment"
                    className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                        errors.address
                        ? 'border-rose-500 focus:border-rose-500'
                        : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
                    }`}
                    />
                    {errors.address && (
                    <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.address}</p>
                    )}
                </div>

                {/* City */}
                <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    City *
                    </label>
                    <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="e.g. Tbilisi"
                    className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                        errors.city
                        ? 'border-rose-500 focus:border-rose-500'
                        : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
                    }`}
                    />
                    {errors.city && (
                    <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.city}</p>
                    )}
                </div>

                {/* Postal Code */}
                <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Postal Code * (4-10 digits)
                    </label>
                    <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    placeholder="e.g. 0179"
                    className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                        errors.postalCode
                        ? 'border-rose-500 focus:border-rose-500'
                        : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
                    }`}
                    />
                    {errors.postalCode && (
                    <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">
                        {errors.postalCode}
                    </p>
                    )}
                </div>

                {/* Country */}
                <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Country *
                    </label>
                    <select
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    >
                    {countries.map((c) => (
                        <option key={c} value={c}>
                        {c}
                        </option>
                    ))}
                    </select>
                    {errors.country && (
                    <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.country}</p>
                    )}
                </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition active:scale-[0.99]"
                >
                    {isSubmitting ? (
                    <span>Processing Order...</span>
                    ) : (
                    <>
                        <span>Place Order · {formatPrice(cart.total())}</span>
                        <ArrowRight className="w-4 h-4" />
                    </>
                    )}
                </button>
                </div>
            </form>
            </div>

            {/* Right Col: Order Items Review & Summary */}
            <div className="lg:col-span-1 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4">
                Order Items ({cart.itemCount})
                </h3>

                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 pr-1 space-y-2">
                {state.items.map((item) => {
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

                {/* Price Calculations */}
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
        </div>
        </div>
    );
}
