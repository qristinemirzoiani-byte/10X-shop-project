    // pages/CatalogPage.tsx
    import { useState, useEffect } from 'react';
    import { useSearchParams } from 'react-router';
    import type { Product, SortOption } from '../types/products';
    import { fetchProducts } from '../api/products.api';
    import { ProductGrid } from '../product/ProductGrid';
    import { Pagination } from '../components/Pagination';
    import { SkeletonCard } from '../product/CatalogSkeleton';
    import { CustomSortDropdown } from '../components/CustomSortDropdown';
    import { CategoryFilter } from '../product/CategoryFilter';
    import { CatalogEmpty } from '../product/CatalogEmpty';
    import { CatalogError } from '../product/CatalogError';
    import { useTheme } from '../contexts/ThemeContext';

    export default function CatalogPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    // Read state directly from URL
    const queryParam = searchParams.get('q') || '';
    const categoryParam = searchParams.get('category') || '';
    const sortParam = (searchParams.get('sort') as SortOption) || '';
    const rawPage = parseInt(searchParams.get('page') || '1', 10);
    const pageParam = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;

    // API Data state
    const [products, setProducts] = useState<Product[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [retryKey, setRetryKey] = useState(0);

    // Sync loading state during render when URL params change (prevents react-hooks/set-state-in-effect lint error)
    const currentParamsKey = `${queryParam}|${categoryParam}|${sortParam}|${pageParam}|${retryKey}`;
    const [prevParamsKey, setPrevParamsKey] = useState(currentParamsKey);

    if (prevParamsKey !== currentParamsKey) {
        setPrevParamsKey(currentParamsKey);
    setLoading(true);
        setError(null);
    }

    const limit = 12;
    const { theme } = useTheme();

    useEffect(() => {
        let ignore = false;
        const controller = new AbortController();

        fetchProducts(
        {
            q: queryParam,
            category: categoryParam,
            sort: sortParam,
            page: pageParam,
            limit,
        },
        controller.signal
        )
        .then((data) => {
            if (!ignore) {
            setProducts(data.products || []);
            setTotal(data.total || 0);
            setError(null);
            setLoading(false);
            }
        })
        .catch((err) => {
            if (!ignore && err.name !== 'AbortError') {
            setError(err.message || 'Failed to load products');
            setLoading(false);
            }
        });

        return () => {
        ignore = true;
        controller.abort();
        };
    }, [queryParam, categoryParam, sortParam, pageParam, retryKey]);

    const handlePageChange = (newPage: number) => {
        setLoading(true);
        const nextParams = new URLSearchParams(searchParams);
        nextParams.set('page', String(newPage));
        setSearchParams(nextParams);
    };

    const handleClearFilters = () => {
        setLoading(true);
        setSearchParams({});
    };

    const totalPages = Math.ceil(total / limit);
    const startItem = total === 0 ? 0 : (pageParam - 1) * limit + 1;
    const endItem = Math.min(pageParam * limit, total);

    // Category thematic backgrounds
    const categoryBackgrounds: Record<string, string> = {
        smartphones: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1600&auto=format&fit=crop',
        laptops: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1600&auto=format&fit=crop',
        beauty: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop',
        'beauty-and-makeup': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop',
        fragrances: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1600&auto=format&fit=crop',
        furniture: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1600&auto=format&fit=crop',
        groceries: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1600&auto=format&fit=crop',
    };

    const catBgUrl = categoryParam ? categoryBackgrounds[categoryParam.toLowerCase()] : null;
    const isDark = theme === 'dark';
    const containerBgStyle = catBgUrl
        ? {
            backgroundImage: isDark
            ? `linear-gradient(to bottom, rgba(11, 16, 29, 0.88), rgba(11, 16, 29, 0.94)), url("${catBgUrl}")`
            : `linear-gradient(to bottom, rgba(254, 238, 245, 0.68), rgba(246, 218, 232, 0.78)), url("${catBgUrl}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
        }
        : !isDark
        ? {
            backgroundImage: `linear-gradient(to bottom, rgba(255, 241, 247, 0.88), rgba(250, 226, 238, 0.92))`,
        }
        : undefined;

    const handleSortSelect = (val: string) => {
        setLoading(true);
        const nextParams = new URLSearchParams(searchParams);
        if (val) {
        nextParams.set('sort', val);
        } else {
        nextParams.delete('sort');
        }
        nextParams.set('page', '1');
        setSearchParams(nextParams);
    };

    return (
        <div
        className="space-y-6 max-w-7xl mx-auto py-6 sm:py-8 px-5 sm:px-8 rounded-[28px] transition-all duration-300 backdrop-blur-xl bg-pink-50/75 dark:bg-[#0B101D]/90 border border-pink-200/60 dark:border-slate-800/80 shadow-2xl"
        style={containerBgStyle}
        >
        {/* Catalog Header, Count & Custom Styled Sort Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pink-200/60 dark:border-slate-800/80 pb-5">
            <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {categoryParam ? `Category: ${categoryParam.toUpperCase()}` : 'Products Catalog'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Browse our wide selection of premium products
            </p>

            {/* Active Search / Filter Indicator */}
            {queryParam && (
                <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-xs text-pink-600 dark:text-pink-400 font-medium">
                <span>Search: <strong>"{queryParam}"</strong></span>
                <button
                    type="button"
                    onClick={handleClearFilters}
                    className="hover:text-pink-700 dark:hover:text-pink-300 font-bold ml-1 cursor-pointer"
                    title="Clear search"
                >
                    ✕
                </button>
                </div>
            )}
            </div>

            {/* Right side: Count & Pink Styled Custom Sort Dropdown */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 self-end sm:self-center">
            {!loading && total > 0 && (
                <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                Showing <span className="font-bold text-slate-800 dark:text-slate-200">{startItem}–{endItem}</span> of{' '}
                <span className="font-bold text-pink-600 dark:text-pink-500">{total}</span> products
                </div>
            )}

            <CustomSortDropdown value={sortParam} onChange={handleSortSelect} />
            </div>
        </div>

        {/* Category Filter Component */}
        <CategoryFilter activeCategory={categoryParam} className="pb-1" />

        {/* Main Content Area */}
        {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
            </div>
        ) : error ? (
            <CatalogError
            error={error}
            onRetry={() => {
                setLoading(true);
                setRetryKey((k) => k + 1);
            }}
            />
        ) : products.length === 0 ? (
            <CatalogEmpty onClear={handleClearFilters} />
        ) : (
            <>
            <ProductGrid products={products} />
            <Pagination
                page={pageParam}
                totalPages={totalPages}
                onChange={handlePageChange}
            />
            </>
        )}
        </div>
    );
}

export { CatalogPage };