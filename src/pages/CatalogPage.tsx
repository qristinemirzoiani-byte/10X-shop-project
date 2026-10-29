    // pages/CatalogPage.tsx
    import { useState, useEffect, useCallback, useMemo } from 'react';
    import { useSearchParams } from 'react-router';
    import { Search, RefreshCw, AlertCircle } from 'lucide-react';
    import type { Product, Category, SortOption } from '../types/products.ts';
    import { fetchProducts, fetchCategories } from '../api/products.api';
    import { ProductGrid } from '../product/ProductGrid';
    import { Pagination } from '../components/Pagination';
    import { SkeletonCard } from '../product/CatalogSkeleton.tsx';
    import { CustomSortDropdown } from '../components/CustomSortDropdown';
    import { useTheme } from '../contexts/ThemeContext';
    import { useDebounce } from '../hooks/useDebounce.ts';

    export default function CatalogPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    // Read state directly from URL
    const queryParam = searchParams.get('q') || '';
    const categoryParam = searchParams.get('category') || '';
    const sortParam = (searchParams.get('sort') as SortOption) || '';
    const pageParam = Math.max(1, parseInt(searchParams.get('page') || '1', 10));

    // Local state for instant typing in search field
    const [searchInput, setSearchInput] = useState(queryParam);
    const debouncedSearch = useDebounce(searchInput, 400);

    // API Data state
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const limit = 12;

    const { theme } = useTheme();

    // Sync debounced search to URL
    useEffect(() => {
        const currentQ = searchParams.get('q') || '';
        if (debouncedSearch !== currentQ) {
        const nextParams = new URLSearchParams(searchParams);
        if (debouncedSearch.trim()) {
            nextParams.set('q', debouncedSearch.trim());
            nextParams.delete('category'); // Search clears category according to PRD A1.6
        } else {
            nextParams.delete('q');
        }
        nextParams.set('page', '1');
        setSearchParams(nextParams);
        }
    }, [debouncedSearch, searchParams, setSearchParams]);

    // Keep input in sync if URL changes externally (e.g. back/forward navigation)
    useEffect(() => {
        setSearchInput(queryParam);
    }, [queryParam]);

    // Fetch categories on mount
    useEffect(() => {
        const controller = new AbortController();
        fetchCategories(controller.signal)
        .then((data) => setCategories(data))
        .catch((err) => {
            if (err.name !== 'AbortError') {
            console.warn('Failed to load categories:', err);
            }
        });
        return () => controller.abort();
    }, []);

    // Fetch products whenever URL parameters change
    const loadProducts = useCallback(() => {
        const controller = new AbortController();
        setLoading(true);
        setError(null);

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
            setProducts(data.products || []);
            setTotal(data.total || 0);
        })
        .catch((err) => {
            if (err.name !== 'AbortError') {
            setError(err.message || 'Failed to load products');
            }
        })
        .finally(() => {
            setLoading(false);
        });

        return () => controller.abort();
    }, [queryParam, categoryParam, sortParam, pageParam]);

    useEffect(() => {
        const cleanup = loadProducts();
        return cleanup;
    }, [loadProducts]);

    // Handlers for Toolbar
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        const nextParams = new URLSearchParams(searchParams);
        if (val) {
        nextParams.set('category', val);
        nextParams.delete('q'); // Category clears search according to PRD
        setSearchInput('');
        } else {
        nextParams.delete('category');
        }
        nextParams.set('page', '1');
        setSearchParams(nextParams);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        const nextParams = new URLSearchParams(searchParams);
        if (val) {
        nextParams.set('sort', val);
        } else {
        nextParams.delete('sort');
        }
        nextParams.set('page', '1');
        setSearchParams(nextParams);
    };

    const handlePageChange = (newPage: number) => {
        const nextParams = new URLSearchParams(searchParams);
        nextParams.set('page', String(newPage));
        setSearchParams(nextParams);
    };

    const handleClearFilters = () => {
        setSearchInput('');
        setSearchParams({});
    };

    const totalPages = Math.ceil(total / limit);
    const startItem = total === 0 ? 0 : (pageParam - 1) * limit + 1;
    const endItem = Math.min(pageParam * limit, total);

    const hasActiveFilters = Boolean(queryParam || categoryParam || sortParam);

    // Category-specific thematic backdrop images behind the products panel:
    // Smartphones, Laptops, Beauty, Fragrances, Furniture, Groceries
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

            {/* Custom Sort Dropdown with Rounded Corners, Pink Border, and Smooth Popover */}
            <CustomSortDropdown value={sortParam} onChange={handleSortSelect} />
            </div>
        </div>

        {/* Main Content Area */}
        {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
            </div>
        ) : error ? (
            <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl p-8 text-center max-w-lg mx-auto">
            <AlertCircle className="w-10 h-10 text-rose-600 dark:text-rose-400 mx-auto mb-3" />
            <h3 className="font-bold text-base text-rose-900 dark:text-rose-200 mb-1">
                Failed to load products
            </h3>
            <p className="text-xs text-rose-700 dark:text-rose-300 mb-4">{error}</p>
            <button
                type="button"
                onClick={loadProducts}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-sm transition"
            >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry
            </button>
            </div>
        ) : products.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center max-w-md mx-auto shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                No products found.
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                We couldn't find any products matching your criteria. Try adjusting your search or filters.
            </p>
            <button
                type="button"
                onClick={handleClearFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 shadow-sm transition"
            >
                Clear filters
            </button>
            </div>
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
