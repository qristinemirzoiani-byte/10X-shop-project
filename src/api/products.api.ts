    import type { Product, ProductsResponse, CatalogParams } from '../types/products';

    const BASE_URL = 'https://dummyjson.com';

    export async function fetchProducts(
    params: CatalogParams = {},
    signal?: AbortSignal
    ): Promise<ProductsResponse> {
    const limit = params.limit ?? 12;
    const page = params.page ?? 1;
    const skip = (page - 1) * limit;

    let url = `${BASE_URL}/products`;

    // 1. if there's a search query (P2 ① Search)
    if (params.q && params.q.trim()) {
        url = `${BASE_URL}/products/search?q=${encodeURIComponent(params.q.trim())}&limit=${limit}&skip=${skip}`;
    } 
    // 2. if there's a category filter (P2 ② Category Filter)
    else if (params.category && params.category !== 'all') {
        url = `${BASE_URL}/products/category/${encodeURIComponent(params.category)}?limit=${limit}&skip=${skip}`;
    } 
    // standard fetch (no search, no category)
    else {
        url = `${BASE_URL}/products?limit=${limit}&skip=${skip}`;
    }

    // 4. Sorting (P2 ③ Sorting)
    if (params.sort) {
        const separator = url.includes('?') ? '&' : '?';
        if (params.sort === 'price-asc') {
        url += `${separator}sortBy=price&order=asc`;
        } else if (params.sort === 'price-desc') {
        url += `${separator}sortBy=price&order=desc`;
        } else if (params.sort === 'rating-desc') {
        url += `${separator}sortBy=rating&order=desc`;
        } else if (params.sort === 'title-asc') {
        url += `${separator}sortBy=title&order=asc`;
        }
    }

    const response = await fetch(url, { signal });

    if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const data: ProductsResponse = await response.json();

    // Client-side fallback sorting if API doesn't support sorting for some reason
    if (params.sort && data.products) {
        const sorted = [...data.products];
        if (params.sort === 'price-asc') {
        sorted.sort((a, b) => a.price - b.price);
        } else if (params.sort === 'price-desc') {
        sorted.sort((a, b) => b.price - a.price);
        } else if (params.sort === 'rating-desc') {
        sorted.sort((a, b) => b.rating - a.rating);
        } else if (params.sort === 'title-asc') {
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        }
        return { ...data, products: sorted };
    }

    return data;
    }

    // one product take (detail page /products/:id)
    export async function fetchProductById(id: number | string, signal?: AbortSignal): Promise<Product> {
    const response = await fetch(`${BASE_URL}/products/${id}`, { signal });
    if (!response.ok) {
        throw new Error(`Failed to fetch product #${id}`);
    }
    return response.json();
}