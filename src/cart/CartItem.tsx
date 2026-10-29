import { Link } from 'react-router';
import { Trash2, Minus, Plus } from 'lucide-react';
import { discountedPrice, formatPrice } from '../utils/format';

export interface CartItemData {
    productId: string | number;
    title: string;
    price: number;
    discountPercentage: number;
    thumbnail: string;
    quantity: number;
    stock: number;
}

interface CartItemProps {
    item: CartItemData;
    onUpdateQuantity: (productId: number, quantity: number) => void;
    onRemove: (productId: number) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
const numericId = Number(item.productId);
const unitPrice = discountedPrice(item.price, item.discountPercentage);
const lineTotal = unitPrice * item.quantity;

return (
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 transition hover:bg-white/60 dark:hover:bg-slate-800/50">
        <Link
            to={`/products/${item.productId}`}
            className="w-20 h-20 rounded-xl bg-white dark:bg-slate-800 p-2 shrink-0 flex items-center justify-center overflow-hidden border border-pink-100/80"
        >
            <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-full object-contain"
            />
        </Link>

        <div className="flex-1 min-w-0 text-center sm:text-left">
            <Link
            to={`/products/${item.productId}`}
            className="font-bold text-sm text-slate-900 dark:text-white hover:text-pink-600 dark:hover:text-pink-400 transition line-clamp-1"
            >
            {item.title}
            </Link>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Unit price: {formatPrice(unitPrice)}
            {item.discountPercentage >= 1 && (
                <span className="text-emerald-600 dark:text-emerald-400 ml-1 font-medium">
                (−{Math.round(item.discountPercentage)}%)
                </span>
            )}
            </div>
        </div>

        <div className="flex items-center border border-pink-200/60 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 p-1 shrink-0">
            <button
            type="button"
            disabled={item.quantity <= 1}
            onClick={() => onUpdateQuantity(numericId, item.quantity - 1)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-pink-50 dark:hover:bg-slate-700 disabled:opacity-30 transition cursor-pointer"
            >
            <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-xs font-bold text-slate-900 dark:text-white">
            {item.quantity}
            </span>
            <button
            type="button"
            disabled={item.quantity >= item.stock}
            onClick={() => onUpdateQuantity(numericId, item.quantity + 1)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-pink-50 dark:hover:bg-slate-700 disabled:opacity-30 transition cursor-pointer"
            >
            <Plus className="w-3.5 h-3.5" />
            </button>
        </div>

        <div className="text-right shrink-0 min-w-20">
            <div className="font-bold text-sm text-slate-900 dark:text-white">
            {formatPrice(lineTotal)}
            </div>
        </div>

        <button
            type="button"
            onClick={() => onRemove(numericId)}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition cursor-pointer"
        >
            <Trash2 className="w-4 h-4" />
        </button>
        </div>
    );
}