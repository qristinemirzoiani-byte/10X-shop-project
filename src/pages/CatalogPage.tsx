    import { useState, useEffect, useCallback } from 'react';
    import { useSearchParams } from 'react-router';
    import type { Product } from '../types/products';
    import { fetchProducts } from '../api/products.api';
    import { ProductGrid } from '../product/ProductGrid';
    import { Pagination } from '../components/Pagination';
    import { CatalogSkeleton } from '../product/CatalogSkeleton';
    import { CatalogError } from '../product/CatalogError';
    import { CatalogEmpty } from '../product/CatalogEmpty';
    import { CustomSortDropdown } from '../components/CustomSortDropdown';
    import { useTheme } from '../contexts/ThemeContext';

    export default function CatalogPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { theme } = useTheme();

    // 1. URL parameters
    const queryParam = searchParams.get('q') || '';
    const categoryParam = searchParams.get('category') || '';
    const sortParam = searchParams.get('sort') || '';
    const pageParam = Math.max(1, parseInt(searchParams.get('page') || '1', 10));

    // 2. Server State
    const [products, setProducts] = useState<Product[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const limit = 12;

    // category backgrounds for dark mode
    const isDark = theme === 'dark';

    const categoryBackgroundsDark: Record<string, string> = {
        smartphones: 'linear-gradient(to bottom, rgba(10, 15, 30, 0.88), rgba(10, 15, 30, 0.95)), url("https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1600&auto=format&fit=crop")',
        laptops: 'linear-gradient(to bottom, rgba(10, 15, 30, 0.88), rgba(10, 15, 30, 0.95)), url("https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1600&auto=format&fit=crop")',
        fragrances: 'linear-gradient(to bottom, rgba(10, 15, 30, 0.88), rgba(10, 15, 30, 0.95)), url("https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1600&auto=format&fit=crop")',
        furniture: 'linear-gradient(to bottom, rgba(10, 15, 30, 0.88), rgba(10, 15, 30, 0.95)), url("https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1600&auto=format&fit=crop")',
        groceries: 'linear-gradient(to bottom, rgba(10, 15, 30, 0.88), rgba(10, 15, 30, 0.95)), url("https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1600&auto=format&fit=crop")',
    };

    const currentBackground = isDark
        ? (categoryParam && categoryBackgroundsDark[categoryParam] 
            ? categoryBackgroundsDark[categoryParam] 
            : 'linear-gradient(to bottom, rgba(10, 15, 30, 0.95), rgba(10, 15, 30, 0.95))')
        : 'linear-gradient(to bottom, rgba(255, 240, 245, 0.95), rgba(255, 228, 238, 0.95))';

    // 3. Data Fetching
    const loadProducts = useCallback(() => {
        const controller = new AbortController();
        setLoading(true);
        setError(null);

        fetchProducts(
        { q: queryParam, category: categoryParam, sort: sortParam, page: pageParam, limit },
        controller.signal
        )
        .then((data) => {
            setProducts(data.products || []);
            setTotal(data.total || 0);
        })
        .catch((err) => {
            if (err.name !== 'AbortError') setError(err.message || 'Failed to load products');
        })
        .finally(() => setLoading(false));

        return () => controller.abort();
    }, [queryParam, categoryParam, sortParam, pageParam]);

    useEffect(() => {
        const cleanup = loadProducts();
        return cleanup;
    }, [loadProducts]);

    // 4. Handlers
    const handleSortSelect = (val: string) => {
        const next = new URLSearchParams(searchParams);
        if (val) next.set('sort', val);
        else next.delete('sort');
        next.set('page', '1');
        setSearchParams(next);
    };

    const handlePageChange = (newPage: number) => {
        const next = new URLSearchParams(searchParams);
        next.set('page', String(newPage));
        setSearchParams(next);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const totalPages = Math.ceil(total / limit);
    const startItem = total === 0 ? 0 : (pageParam - 1) * limit + 1;
    const endItem = Math.min(pageParam * limit, total);

    return (
        <div 
        className="space-y-6 max-w-7xl mx-auto py-6 px-4 rounded-3xl transition-all duration-500 shadow-2xl border border-pink-200/60 dark:border-pink-500/20"
        style={{ 
            backgroundImage: currentBackground,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
        }}
        >
        {/* Header, Count და გალამაზებული Custom Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pink-200/60 dark:border-slate-800 pb-4">
            <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {categoryParam ? `Category: ${categoryParam.toUpperCase()}` : 'Products Catalog'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Browse our wide selection of premium products
            </p>

            {/* ძებნის ინდიკატორი */}
            {queryParam && (
                <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-xs text-pink-600 dark:text-pink-400 font-medium">
                <span>ძებნა: <strong>"{queryParam}"</strong></span>
                <button
                    type="button"
                    onClick={() => {
                    const next = new URLSearchParams(searchParams);
                    next.delete('q');
                    setSearchParams(next);
                    }}
                    className="hover:text-pink-800 dark:hover:text-pink-200 ml-1 cursor-pointer font-bold"
                    title="გასუფთავება"
                >
                    ✕
                </button>
                </div>
            )}
            </div>

            {/* რაოდენობა + ახალი Custom Sort Dropdown */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 self-end sm:self-center">
            {!loading && total > 0 && (
                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium hidden md:block">
                Showing <span className="font-bold text-slate-800 dark:text-slate-200">{startItem}–{endItem}</span> of{' '}
                <span className="font-bold text-pink-600 dark:text-pink-500">{total}</span> products
                </div>
            )}

            {/* მოუმრგვალებული, ვარდისფერი ჩამოსაშლელი ფანჯარა */}
            <CustomSortDropdown value={sortParam} onChange={handleSortSelect} />
            </div>
        </div>

        {/* Dynamic Content */}
        {loading ? (
            <CatalogSkeleton />
        ) : error ? (
            <CatalogError error={error} onRetry={loadProducts} />
        ) : products.length === 0 ? (
            <CatalogEmpty onClear={() => setSearchParams({})} />
        ) : (
            <ProductGrid products={products} />
        )}

        {/* Pagination */}
        {!loading && (
            <Pagination
            page={pageParam}
            totalPages={totalPages}
            onChange={handlePageChange}
            />
        )}
        </div>
    );
    }