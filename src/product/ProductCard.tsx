    // components/product/ProductCard.tsx
    import React, { memo } from 'react';
    import { useNavigate } from 'react-router';
    import { Star, ShoppingCart } from 'lucide-react';
    import type { Product } from '../types/products';
    import { discountedPrice, formatPrice } from '../utils/format';
    import { useCart } from '../contexts/CartContext';

    export interface ProductCardProps {
    product: Product;
    onAdd?: (p: Product) => void;
    }

    export const ProductCard = memo(function ProductCard({ product, onAdd }: ProductCardProps) {
    const navigate = useNavigate();
    const { addItem } = useCart();

    const handleCardClick = () => {
        navigate(`/products/${product.id}`);
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onAdd) {
        onAdd(product);
        } else {
        addItem(product, 1);
        }
    };

    const finalPrice = discountedPrice(product.price, product.discountPercentage);
    const hasDiscount = product.discountPercentage >= 1;
    const isOutOfStock = product.stock <= 0;
    const isLowStock = product.stock > 0 && product.stock <= 5;

    return (
        <div
        onClick={handleCardClick}
        className="group bg-[#fbf7f9] dark:bg-[#0e1424] border border-pink-100/90 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-pink-400/50 dark:hover:border-pink-500/50 hover:shadow-pink-500/10 transition-all duration-300 flex flex-col cursor-pointer relative"
        >
        {/* Thumbnail Container */}
        <div className="relative h-48 w-full bg-white/60 dark:bg-[#080c16] overflow-hidden flex items-center justify-center p-3">
            <img
            src={product.thumbnail}
            alt={product.title}
            loading="lazy"
            width={300}
            height={300}
            className="object-contain w-full h-full max-h-40 group-hover:scale-105 transition-transform duration-300"
            />

            {/* Discount Badge */}
            {hasDiscount && (
            <span className="absolute top-3 left-3 bg-pink-500/40 backdrop-blur-md text-white text-xs font-bold px-2.5 py-0.5 rounded-full border border-pink-400/50 shadow-xs">
                −{Math.round(product.discountPercentage)}%
            </span>
            )}

            {/* Stock Badge */}
            <div className="absolute top-3 right-3">
            {isOutOfStock ? (
                <span className="bg-rose-500/90 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full shadow-sm backdrop-blur-xs">
                Out of stock
                </span>
            ) : isLowStock ? (
                <span className="bg-amber-500 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
                Only {product.stock} left!
                </span>
            ) : (
                <span className="bg-slate-900/60 text-white text-[11px] font-medium px-2 py-0.5 rounded-full shadow-sm backdrop-blur-xs">
                In stock
                </span>
            )}
            </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
            {/* Category & Brand */}
            <div className="text-xs text-pink-600 dark:text-pink-400 font-semibold mb-1 truncate">
            <span className="capitalize">{product.category}</span>
            {product.brand ? ` · ${product.brand}` : ''}
            </div>

            {/* Title */}
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm line-clamp-2 mb-2 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
            {product.title}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 mb-3">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">
                {product.rating.toFixed(1)}
            </span>
            <span className="text-slate-400 dark:text-slate-500">
                ({product.reviews?.length ?? 0})
            </span>
            </div>

            {/* Price & Action Row */}
            <div className="mt-auto pt-3 border-t border-pink-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
            <div>
                <div className="font-bold text-lg text-slate-900 dark:text-white leading-tight">
                {formatPrice(finalPrice)}
                </div>
                {hasDiscount && (
                <div className="text-xs text-slate-400 line-through">
                    {formatPrice(product.price)}
                </div>
                )}
            </div>

            <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                aria-label={`Add ${product.title} to cart`}
                className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all backdrop-blur-md cursor-pointer ${
                isOutOfStock
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-slate-700'
                    : 'bg-pink-500/25 hover:bg-pink-500/40 text-pink-700 dark:text-pink-100 border border-pink-400/50 shadow-xs active:scale-95'
                }`}
            >
                <ShoppingCart className="w-3.5 h-3.5" />
                {isOutOfStock ? 'Out of stock' : 'Add'}
            </button>
            </div>
        </div>
        </div>
    );
});
