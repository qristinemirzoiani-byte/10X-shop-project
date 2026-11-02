import { useEffect, useState, useMemo, type SyntheticEvent } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import { AlertCircle, ArrowLeft, Minus, Plus, ShoppingCart, Star } from 'lucide-react';
import { ApiError } from '../api/ApiError';
import { fetchProductById, fetchRelatedProducts } from '../api/products.api';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import { STORAGE_KEYS, StorageService } from '../models/StorageService';
import { ProductGallery } from '../product/ProductGallery';
import { ProductGrid } from '../product/ProductGrid';
import { ReviewForm } from '../product/ReviewForm';
import { ReviewsList } from '../product/ReviewsList';
import type { Product, Review } from '../types/products';
import { discountedPrice, formatPrice } from '../utils/format';
import NotFoundPage from './NotFoundPage';

const reviewStorage = new StorageService<Record<string, Review[]>>(STORAGE_KEYS.reviews);

function ProductSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="h-5 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            <div className="grid gap-8 md:grid-cols-2 items-start">
                <div className="space-y-4">
                    <div className="aspect-square w-full rounded-2xl bg-slate-200 dark:bg-slate-800/80" />
                    <div className="flex gap-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-16 w-16 rounded-xl bg-slate-200 dark:bg-slate-800/80" />
                        ))}
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800/80 rounded-md" />
                    <div className="h-8 w-3/4 bg-slate-200 dark:bg-slate-800/80 rounded-lg" />
                    <div className="h-4 w-36 bg-slate-200 dark:bg-slate-800/80 rounded-md" />
                    <div className="h-8 w-44 bg-slate-200 dark:bg-slate-800/80 rounded-lg" />
                    <div className="space-y-2 pt-2">
                        <div className="h-4 w-full bg-slate-200 dark:bg-slate-800/80 rounded-md" />
                        <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800/80 rounded-md" />
                        <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-800/80 rounded-md" />
                    </div>
                    <div className="h-5 w-24 bg-slate-200 dark:bg-slate-800/80 rounded-md" />
                    <div className="flex gap-4 pt-4">
                        <div className="h-11 w-28 bg-slate-200 dark:bg-slate-800/80 rounded-xl" />
                        <div className="h-11 w-40 bg-slate-200 dark:bg-slate-800/80 rounded-xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ProductPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addItem } = useCart();
    const { user } = useAuth();
    const { showToast } = useToast();
    const [product, setProduct] = useState<Product | null>(null);
    const [related, setRelated] = useState<Product[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [image, setImage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [tab, setTab] = useState<'description' | 'reviews'>('description');
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [reviewErrors, setReviewErrors] = useState<{ rating?: string; comment?: string }>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [retry, setRetry] = useState(0);

    const productId = Number(id);
    const isInvalidId = !id || !Number.isInteger(productId) || productId <= 0;

    // ID change effect: reset state when navigating to a different product ID
    const [prevProductId, setPrevProductId] = useState(productId);
    if (prevProductId !== productId) {
        setPrevProductId(productId);
        setLoading(true);
        setProduct(null);
        setError(null);
        setNotFound(false);
    }

    useEffect(() => {
        if (isInvalidId) return;

        const controller = new AbortController();

        async function load() {
            try {
                const result = await fetchProductById(productId, controller.signal);
                if (controller.signal.aborted) return;
                setProduct(result);
                setImage(result.images?.[0] || result.thumbnail);
                setQuantity(1);

                // ლოკალური review-ები API review-ების წინ დგას
                const localReviews = reviewStorage.get()?.[String(productId)] ?? [];
                setReviews([...localReviews, ...(result.reviews ?? [])]);

                const recommendations = await fetchRelatedProducts(result.category, result.id, controller.signal);
                if (!controller.signal.aborted) setRelated(recommendations);
                setError(null);
                setNotFound(false);
            } catch (cause) {
                if (controller.signal.aborted) return;
                if (cause instanceof ApiError && cause.status === 404) {
                    setNotFound(true);
                } else {
                    setError(cause instanceof Error ? cause.message : 'Failed to load product.');
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        void load();
        return () => controller.abort();
    }, [productId, isInvalidId, retry]);

    const submitReview = (event: SyntheticEvent) => {
        event.preventDefault();
        const text = comment.trim();
        const errors = {
            ...(rating < 1 || rating > 5 ? { rating: 'Choose a rating from 1 to 5.' } : {}),
            ...(text.length < 10 ? { comment: 'Your comment must be at least 10 characters.' } : {}),
        };
        setReviewErrors(errors);
        if (Object.keys(errors).length) return;
        if (!product) return;

        // avtor: user and reviewerName
        const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
        const reviewerName = user.isLoggedIn
            ? (fullName || user.username || 'Guest')
            : 'Guest';

        const review: Review = { rating, comment: text, date: new Date().toISOString(), reviewerName };
        const stored = reviewStorage.get() ?? {};
        const key = String(product.id);

        // new reviews are added to the beginning of the list, so they appear first
        reviewStorage.set({ ...stored, [key]: [review, ...(stored[key] ?? [])] });
        setReviews((current) => [review, ...current]);
        setComment('');
        setRating(5);
        setReviewErrors({});
        showToast('Your review has been added.', 'success');
    };

    const averageRating = useMemo(() => {
        if (reviews.length === 0) return product?.rating || 0;
        return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    }, [reviews, product?.rating]);

    if (isInvalidId || notFound) return <NotFoundPage />;
    if (loading) return <ProductSkeleton />;
    if (error || !product) {
        return (
            <div className="mx-auto max-w-lg py-16 text-center">
                <AlertCircle className="mx-auto mb-4 h-10 w-10 text-rose-500" />
                <h1 className="text-xl font-bold">Could not load product</h1>
                <p className="mt-2 text-sm text-slate-500">{error ?? 'The product is unavailable right now.'}</p>
                <button className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-white cursor-pointer" onClick={() => { setLoading(true); setError(null); setRetry((n) => n + 1); }}>
                    Try again
                </button>
            </div>
        );
    }

    const images = product.images?.length ? product.images : [product.thumbnail];
    const price = discountedPrice(product.price, product.discountPercentage);

    return (
        <div className="space-y-6">
            <div>
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-400 hover:text-pink-500 dark:text-slate-400 dark:hover:text-pink-400 transition cursor-pointer group"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                    <span>Back to catalog</span>
                </button>
            </div>

            <div className="grid gap-8 md:grid-cols-2 items-start">
                <ProductGallery images={images} selectedImage={image || images[0]} onSelectImage={setImage} title={product.title} />
                <section className="space-y-4">
                    <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold">
                        <Link
                            to={`/?category=${encodeURIComponent(product.category)}`}
                            className="text-pink-600 dark:text-pink-400 hover:underline cursor-pointer"
                        >
                            {product.category}
                        </Link>
                        {product.brand && <span className="text-slate-400">· {product.brand}</span>}
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{product.title}</h1>

                    <p className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        {averageRating.toFixed(1)} ({reviews.length} reviews)
                    </p>

                    <p className="text-2xl font-black text-slate-900 dark:text-white">
                        {formatPrice(price)} {product.discountPercentage > 0 && <del className="text-sm text-slate-400 font-normal ml-2">{formatPrice(product.price)}</del>}
                    </p>
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{product.description}</p>

                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        {product.stock <= 0 ? (
                            <span className="text-rose-500 font-bold">Out of stock</span>
                        ) : product.stock <= 5 ? (
                            <span className="text-amber-500 dark:text-amber-400 font-bold">Only {product.stock} left!</span>
                        ) : (
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓ {product.stock} in stock</span>
                        )}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-3">
                        <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 p-1">
                            <button aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => setQuantity((n) => Math.max(1, n - 1))} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-pink-50 dark:hover:bg-slate-800 disabled:opacity-30 transition cursor-pointer">
                                <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-10 text-center font-bold text-slate-900 dark:text-white text-sm">{quantity}</span>
                            <button aria-label="Increase quantity" disabled={quantity >= product.stock} onClick={() => setQuantity((n) => Math.min(product.stock, n + 1))} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-pink-50 dark:hover:bg-slate-800 disabled:opacity-30 transition cursor-pointer">
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>
                        <button
                            disabled={!product.stock}
                            onClick={() => addItem(product, quantity)}
                            className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-sm px-6 py-3 shadow-lg shadow-pink-600/30 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            <ShoppingCart className="h-4 w-4" />
                            <span>{product.stock ? 'Add to cart' : 'Out of stock'}</span>
                        </button>
                    </div>
                </section>
            </div>

            <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md overflow-hidden">
                <div className="flex border-b border-slate-200 dark:border-slate-800">
                    <button className={`p-4 text-sm font-bold border-b-2 cursor-pointer transition ${tab === 'description' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`} onClick={() => setTab('description')}>
                        Description
                    </button>
                    <button className={`p-4 text-sm font-bold border-b-2 cursor-pointer transition ${tab === 'reviews' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`} onClick={() => setTab('reviews')}>
                        Reviews ({reviews.length})
                    </button>
                </div>
                <div className="space-y-8 p-6">
                    {tab === 'description' ? (
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{product.description}</p>
                    ) : (
                        <>
                            <ReviewForm rating={rating} setRating={setRating} comment={comment} setComment={setComment} errors={reviewErrors} setErrors={setReviewErrors} onSubmit={submitReview} />
                            <ReviewsList reviews={reviews} />
                        </>
                    )}
                </div>
            </section>

            {related.length > 0 && (
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Related products</h2>
                    <ProductGrid products={related} onAdd={(p) => addItem(p, 1)} />
                </section>
            )}
        </div>
    );
}

export { ProductPage };