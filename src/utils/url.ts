import type { CatalogParams } from '../types/products';

export function buildProductsUrl(params: CatalogParams = {}): string {
    const limit = params.limit ?? 12;
    const page = typeof params.page === 'number' && Number.isInteger(params.page) && params.page > 0
        ? params.page
        : 1;
    const searchParams = new URLSearchParams({
        limit: String(limit),
        skip: String((page - 1) * limit),
    });

    switch (params.sort) {
        case 'price-asc':
            searchParams.set('sortBy', 'price');
            searchParams.set('order', 'asc');
            break;
        case 'price-desc':
            searchParams.set('sortBy', 'price');
            searchParams.set('order', 'desc');
            break;
        case 'rating-desc':
            searchParams.set('sortBy', 'rating');
            searchParams.set('order', 'desc');
            break;
        case 'title-asc':
            searchParams.set('sortBy', 'title');
            searchParams.set('order', 'asc');
            break;
    }

    const query = params.q?.trim();
    const category = params.category?.trim();
    const endpoint = query
        ? '/products/search'
        : category
            ? `/products/category/${encodeURIComponent(category)}`
            : '/products';

    if (query) searchParams.set('q', query);
    return `${endpoint}?${searchParams.toString()}`;
}
