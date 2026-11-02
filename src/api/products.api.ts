    import { api } from './ApiClient';
    import type { Product, ProductsResponse, Category, CatalogParams } from '../types/products';

    export async function fetchProducts(
    params: CatalogParams = {},
    signal?: AbortSignal
    ): Promise<ProductsResponse> {
    const limit = params.limit ?? 12;
    const page = typeof params.page === 'number' && !Number.isNaN(params.page) && params.page > 0 ? params.page : 1;
    const skip = (page - 1) * limit;

    const searchParams = new URLSearchParams();
    searchParams.set('limit', String(limit));
    searchParams.set('skip', String(skip));

    if (params.sort) {
        if (params.sort === 'price-asc') {
        searchParams.set('sortBy', 'price');
        searchParams.set('order', 'asc');
        } else if (params.sort === 'price-desc') {
        searchParams.set('sortBy', 'price');
        searchParams.set('order', 'desc');
        } else if (params.sort === 'rating-desc') {
        searchParams.set('sortBy', 'rating');
        searchParams.set('order', 'desc');
        } else if (params.sort === 'title-asc') {
        searchParams.set('sortBy', 'title');
        searchParams.set('order', 'asc');
        }
    }

    if (params.q?.trim()) {
        searchParams.set('q', params.q.trim());
    }

    const endpoint = params.q?.trim()
        ? '/products/search'
        : params.category?.trim()
        ? `/products/category/${encodeURIComponent(params.category.trim())}`
        : '/products';

    const path = `${endpoint}?${searchParams.toString()}`;

    const response = await api.get<ProductsResponse>(path, signal);

    // Fallback client-side sort if API didn't sort correctly for some endpoints
    if (params.sort && response.products) {
        const sorted = [...response.products];
        if (params.sort === 'price-asc') {
        sorted.sort((a, b) => a.price - b.price);
        } else if (params.sort === 'price-desc') {
        sorted.sort((a, b) => b.price - a.price);
        } else if (params.sort === 'rating-desc') {
        sorted.sort((a, b) => b.rating - a.rating);
        } else if (params.sort === 'title-asc') {
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        }
        return { ...response, products: sorted };
    }

    return response;
    }

    export async function fetchProductById(id: number, signal?: AbortSignal): Promise<Product> {
    return api.get<Product>(`/products/${id}`, signal);
    }

    export async function fetchCategories(signal?: AbortSignal): Promise<Category[]> {
    const data = await api.get<Array<Category | string>>('/products/categories', signal);
    return data.map((item) => {
        if (typeof item === 'string') {
        return {
            slug: item,
            name: item.charAt(0).toUpperCase() + item.slice(1).replace(/-/g, ' '),
            url: `https://dummyjson.com/products/category/${item}`,
        };
        }
        return item;
    });
    }

    export async function fetchRelatedProducts(
    category: string,
    currentProductId: number,
    signal?: AbortSignal
    ): Promise<Product[]> {
    try {
        const res = await api.get<ProductsResponse>(
        `/products/category/${encodeURIComponent(category)}?limit=5`,
        signal
        );
        return res.products.filter((p) => p.id !== currentProductId).slice(0, 4);
    } catch {
        return [];
    }
}