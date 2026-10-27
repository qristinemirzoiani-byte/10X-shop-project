
    import { useNavigate } from 'react-router';
    import { Star, ShoppingCart } from 'lucide-react';
    import type { Product } from '../types/products';
    import { useCart } from '../contexts/CartContext';

    interface ProductCardProps {
    product: Product;
    }

    export function ProductCard({ product }: ProductCardProps) {
    const navigate = useNavigate();
    const { addItem } = useCart();

    const hasDiscount = product.discountPercentage > 0;
    const finalPrice = hasDiscount
        ? product.price * (1 - product.discountPercentage / 100)
        : product.price;

    const isOutOfStock = product.stock <= 0;
    const isLowStock = product.stock > 0 && product.stock <= 5;

    return (
        <div
        onClick={() => navigate(`/products/${product.id}`)}
        className="group bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-pink-500/20 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg dark:hover:shadow-pink-500/10 hover:border-pink-500/50 transition-all duration-300 flex flex-col cursor-pointer relative"
        >
        {/* Thumbnail: h-36 is small */}
        <div className="relative h-36 w-full bg-slate-100 dark:bg-slate-950/40 overflow-hidden flex items-center justify-center p-2.5">
            <img
            src={product.thumbnail}
            alt={product.title}
            loading="lazy"
            className="object-contain w-full h-full max-h-32 group-hover:scale-105 transition-transform duration-300"
            />

            {hasDiscount && (
            <span className="absolute top-2 left-2 bg-pink-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-xs">
                −{Math.round(product.discountPercentage)}%
            </span>
            )}

            <div className="absolute top-2 right-2">
            {isOutOfStock ? (
                <span className="bg-rose-500 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-md">
                Out
                </span>
            ) : isLowStock ? (
                <span className="bg-amber-500 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-md">
                Low
                </span>
            ) : null}
            </div>
        </div>

        {/* Content */}
        <div className="p-3 flex flex-col flex-1 bg-white dark:bg-slate-900/40">
            <div className="text-[10px] text-pink-600 dark:text-pink-400 font-medium mb-0.5 truncate capitalize">
            {product.category}
            </div>

            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-xs line-clamp-1 mb-1.5 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
            {product.title}
            </h3>

            <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mb-2">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="font-bold text-slate-700 dark:text-slate-200">
                {product.rating.toFixed(1)}
            </span>
            <span className="text-[10px]">({product.reviews?.length ?? 0})</span>
            </div>

            <div className="mt-auto pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1.5">
            <div>
                <div className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                ${finalPrice.toFixed(2)}
                </div>
                {hasDiscount && (
                <div className="text-[10px] text-slate-400 line-through">
                    ${product.price.toFixed(2)}
                </div>
                )}
            </div>

            <button
                type="button"
                disabled={isOutOfStock}
                onClick={(e) => {
                e.stopPropagation();
                if (!isOutOfStock) addItem(product, 1);
                }}
                className={`inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer ${
                isOutOfStock
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    : 'bg-linear-to-r from-pink-600 to-rose-600 hover:from-pink-500 text-white shadow-xs'
                }`}
            >
                <ShoppingCart className="w-3 h-3" />
                <span>{isOutOfStock ? 'Out' : 'Add'}</span>
            </button>
            </div>
        </div>
        </div>
    );
}