    // pages/CatalogPage.tsx
    import { useCallback, useMemo } from 'react';
    import { useSearchParams } from 'react-router';
    import { isSortOption } from '../types/products';
    import type { ProductsResponse, SortOption } from '../types/products';
    import { fetchProducts } from '../api/products.api';
    import { useFetch } from '../hooks/useFetch';
    import { ProductGrid } from '../product/ProductGrid';
    import { Pagination } from '../components/Pagination';
    import { SkeletonCard } from '../product/CatalogSkeleton';
    import { CustomSortDropdown } from '../components/CustomSortDropdown';
    import { CatalogEmpty } from '../product/CatalogEmpty';
    import { CatalogError } from '../product/CatalogError';
    import { useTheme } from '../contexts/ThemeContext';
    import { useCart } from '../contexts/CartContext';
    import { buildProductsUrl } from '../utils/url';

    export default function CatalogPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    // Read state directly from URL
    const queryParam = searchParams.get('q') || '';
    const categoryParam = searchParams.get('category') || '';
    const rawSortParam = searchParams.get('sort');
    const sortParam: SortOption = isSortOption(rawSortParam) ? rawSortParam : '';
    const rawPage = parseInt(searchParams.get('page') || '1', 10);
    const pageParam = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;

    const limit = 12;
    const { theme } = useTheme();
    const { addItem } = useCart();
    const requestParams = useMemo(() => ({
        q: queryParam,
        category: categoryParam,
        sort: sortParam,
        page: pageParam,
        limit,
    }), [queryParam, categoryParam, sortParam, pageParam, limit]);
    const requestUrl = buildProductsUrl(requestParams);
    const loadProducts = useCallback(
        (signal: AbortSignal) => fetchProducts(requestParams, signal),
        [requestParams],
    );
    const { state: productsState, retry } = useFetch<ProductsResponse>(requestUrl, loadProducts);
    const loading = productsState.status === 'loading' || productsState.status === 'idle';
    const error = productsState.status === 'error' ? productsState.message : null;
    const products = productsState.status === 'success' ? productsState.data.products : [];
    const total = productsState.status === 'success' ? productsState.data.total : 0;

    const handlePageChange = (newPage: number) => {
        const nextParams = new URLSearchParams(searchParams);
        nextParams.set('page', String(newPage));
        setSearchParams(nextParams);
    };

    const handleClearFilters = () => {
        setSearchParams({});
    };

    const totalPages = Math.ceil(total / limit);
    const startItem = total === 0 ? 0 : (pageParam - 1) * limit + 1;
    const endItem = Math.min(pageParam * limit, total);

    // Category thematic backgrounds
    // Category-specific thematic backdrop images behind the products panel:
    const categoryBackgrounds: Record<string, string> = {
    // tech & electronics 💻 📱
    smartphones: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1600&auto=format&fit=crop',
    laptops: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1600&auto=format&fit=crop',
    tablets: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1600&auto=format&fit=crop',
    'mobile-accessories': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1600&auto=format&fit=crop',

    // cars and motorcycles 🏎️ 🏍️
    vehicle: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop',
    motorcycle: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1600&auto=format&fit=crop',

    // parfum and beauty🌸
    beauty: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop',
    'beauty-and-makeup': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop',
    'skin-care': 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1600&auto=format&fit=crop',
    fragrances: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1600&auto=format&fit=crop',

    // furniture & home decoration 🛋️
    furniture: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1600&auto=format&fit=crop',
    'home-decoration': 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1600&auto=format&fit=crop',
    'kitchen-accessories': 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1600&auto=format&fit=crop',
    groceries: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1600&auto=format&fit=crop',

    // women's fashion & accessories 👗 👠
    'womens-dresses': 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop',
    'womens-shoes': 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1600&auto=format&fit=crop',
    'womens-watches': 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1600&auto=format&fit=crop',
    'womens-bags': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1600&auto=format&fit=crop',
    'womens-jewellery': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1600&auto=format&fit=crop',
    tops: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=1600&auto=format&fit=crop',

    // men's fashion & accessories 👔
    'mens-shirts': 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1600&auto=format&fit=crop',
    'mens-shoes': 'https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?q=80&w=1600&auto=format&fit=crop',
'mens-watches': 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1600&auto=format&fit=crop',
    // sports & eyewear 🕶️ 🏋️
    'sports-accessories': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1600&auto=format&fit=crop',
    sunglasses: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1600&auto=format&fit=crop',
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

    const handleSortSelect = (val: SortOption) => {
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
            onRetry={retry}
            />
        ) : products.length === 0 ? (
            <CatalogEmpty />
        ) : (
            <>
            <ProductGrid products={products} onAdd={addItem} />
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