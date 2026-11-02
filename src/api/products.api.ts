    import { api } from './ApiClient';
    import { ApiError } from './ApiError';
    import { isProduct, isProductsResponse } from '../types/products';
    import type { Product, ProductsResponse, Category, CatalogParams } from '../types/products';
    import { buildProductsUrl } from '../utils/url';

    export async function fetchProducts(
    params: CatalogParams = {},
    signal?: AbortSignal
    ): Promise<ProductsResponse> {
    const path = buildProductsUrl(params);
    const response = await api.get<unknown>(path, signal);
    if (!isProductsResponse(response)) {
        throw new ApiError(502, 'The products service returned invalid data.');
    }

    // Fallback client-side sort if API didn't sort correctly for some endpoints
    if (params.sort) {
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
    const product: unknown = await api.get<unknown>(`/products/${id}`, signal);
    if (!isProduct(product)) {
        throw new ApiError(502, 'The product service returned invalid data.');
    }
    return product;
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
        const res = await fetchProducts({ category, limit: 5 }, signal);
        return res.products.filter((p) => p.id !== currentProductId).slice(0, 4);
    } catch {
        return [];
    }
}