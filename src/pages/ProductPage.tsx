import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { AlertCircle, ArrowLeft, Minus, Plus, ShoppingCart, Star } from 'lucide-react';
import { ApiError } from '../api/ApiError';
import { fetchProductById, fetchRelatedProducts } from '../api/products.api';
import { LoadingSpinner } from '../components/LoadingSpinner';
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

    useEffect(() => {
        const productId = Number(id);
        const controller = new AbortController();
        setProduct(null);
        setRelated([]);
        setError(null);
        setNotFound(false);
        setLoading(true);

        if (!id || !Number.isInteger(productId) || productId <= 0) {
            setNotFound(true);
            setLoading(false);
            return () => controller.abort();
        }

        async function load() {
            try {
                const result = await fetchProductById(productId, controller.signal);
                if (controller.signal.aborted) return;
                setProduct(result);
                setImage(result.images?.[0] || result.thumbnail);
                setQuantity(1);
                setReviews([...(result.reviews ?? []), ...(reviewStorage.get()?.[String(productId)] ?? [])]);
                const recommendations = await fetchRelatedProducts(result.category, result.id, controller.signal);
                if (!controller.signal.aborted) setRelated(recommendations);
            } catch (cause) {
                if (controller.signal.aborted) return;
                if (cause instanceof ApiError && cause.status === 404) setNotFound(true);
                else setError(cause instanceof Error ? cause.message : 'Failed to load product.');
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }

        void load();
        return () => controller.abort();
    }, [id, retry]);

    const submitReview = (event: FormEvent) => {
        event.preventDefault();
        const text = comment.trim();
        const errors = {
            ...(rating < 1 || rating > 5 ? { rating: 'Choose a rating from 1 to 5.' } : {}),
            ...(text.length < 10 ? { comment: 'Your comment must be at least 10 characters.' } : {}),
        };
        setReviewErrors(errors);
        if (Object.keys(errors).length) return;
        if (!user.isLoggedIn) {
            showToast('Please log in to submit a review.', 'info');
            navigate('/login');
            return;
        }
        if (!product) return;

        const review: Review = { rating, comment: text, date: new Date().toISOString(), reviewerName: user.username };
        const stored = reviewStorage.get() ?? {};
        const key = String(product.id);
        reviewStorage.set({ ...stored, [key]: [...(stored[key] ?? []), review] });
        setReviews((current) => [...current, review]);
        setComment('');
        setRating(5);
        setReviewErrors({});
        showToast('Your review has been added.', 'success');
    };

    if (loading) return <LoadingSpinner text="Loading product..." />;
    if (notFound) return <NotFoundPage />;
    if (error || !product) {
        return (
            <div className="mx-auto max-w-lg py-16 text-center">
                <AlertCircle className="mx-auto mb-4 h-10 w-10 text-rose-500" />
                <h1 className="text-xl font-bold">Could not load product</h1>
                <p className="mt-2 text-sm text-slate-500">{error ?? 'The product is unavailable right now.'}</p>
                <button className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-white" onClick={() => setRetry((n) => n + 1)}>
                    Try again
                </button>
            </div>
        );
    }

    const images = product.images?.length ? product.images : [product.thumbnail];
    const price = discountedPrice(product.price, product.discountPercentage);

    return (
        <div className="space-y-10">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:underline">
                <ArrowLeft className="h-4 w-4" /> Back to catalog
            </Link>

            <div className="grid gap-8 md:grid-cols-2">
                <ProductGallery images={images} selectedImage={image || images[0]} onSelectImage={setImage} title={product.title} />
                <section className="space-y-4">
                    <p className="text-sm capitalize text-indigo-600">{product.category}{product.brand && ` · ${product.brand}`}</p>
                    <h1 className="text-3xl font-extrabold">{product.title}</h1>
                    <p className="flex items-center gap-2 text-sm"><Star className="h-4 w-4 fill-amber-400 text-amber-400" />{product.rating.toFixed(1)} ({reviews.length} reviews)</p>
                    <p className="text-2xl font-bold">{formatPrice(price)} {product.discountPercentage > 0 && <del className="text-sm text-slate-400">{formatPrice(product.price)}</del>}</p>
                    <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{product.description}</p>
                    <p className="text-sm">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>

                    <div className="flex items-center gap-3">
                        <button aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => setQuantity((n) => Math.max(1, n - 1))}><Minus className="h-4 w-4" /></button>
                        <span>{quantity}</span>
                        <button aria-label="Increase quantity" disabled={quantity >= product.stock} onClick={() => setQuantity((n) => Math.min(product.stock, n + 1))}><Plus className="h-4 w-4" /></button>
                        <button disabled={!product.stock} onClick={() => addItem(product, quantity)} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white disabled:opacity-50">
                            <ShoppingCart className="h-4 w-4" /> Add to cart
                        </button>
                    </div>
                </section>
            </div>

            <section className="rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex border-b border-slate-200 dark:border-slate-800">
                    <button className="p-4" onClick={() => setTab('description')}>Description</button>
                    <button className="p-4" onClick={() => setTab('reviews')}>Reviews ({reviews.length})</button>
                </div>
                <div className="space-y-8 p-6">
                    {tab === 'description' ? <p>{product.description}</p> : (
                        <>
                            <ReviewForm rating={rating} setRating={setRating} comment={comment} setComment={setComment} errors={reviewErrors} setErrors={setReviewErrors} onSubmit={submitReview} />
                            <ReviewsList reviews={reviews} />
                        </>
                    )}
                </div>
            </section>

            {related.length > 0 && <section className="space-y-4"><h2 className="text-2xl font-bold">Related products</h2><ProductGrid products={related} /></section>}
        </div>
    );
}
