    // src/types/product.ts

    export interface Review {
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    }

    export interface Product {
    id: number;
    title: string;
    description: string;
    category: string;
    brand?: string;             // ? means optional
    price: number;              // start price (e.g., 549)
    discountPercentage: number; // discount percentage (e.g., 12.96)
    rating: number;             // rating 
    stock: number;              
    thumbnail: string;          
    images: string[];           
    reviews: Review[];          
    }

    export interface ProductsResponse {
    products: Product[];        // products array
    total: number;              // how many products are available in DummyJSON (194)
    skip: number;               // how many products we want to skip 
    limit: number;              // how many products we want to fetch per request (პაგინაციისთვის)
    }

    export interface Category {
    slug: string;               // category name for URL
    name: string;               // category names: 'Smartphones')
    url: string;
    }

    // search, category, sort, page, limit (P2 ① Search, P2 ② Category Filter, P2 ③ Sorting)
    export interface CatalogParams {
    q?: string;
    category?: string;
    sort?: SortOption;
    page?: number;
    limit?: number;
}

// PRD values for sorting options
    export type SortOption =
    | ''
    | 'price-asc'
    | 'price-desc'
    | 'rating-desc'
    | 'title-asc';

    export function isSortOption(value: string | null): value is SortOption {
    return value === ''
        || value === 'price-asc'
        || value === 'price-desc'
        || value === 'rating-desc'
        || value === 'title-asc';
}

    export function isProduct(value: unknown): value is Product {
    if (typeof value !== 'object' || value === null) return false;
    const product = value as Record<string, unknown>;

    return Number.isInteger(product.id)
        && typeof product.title === 'string'
        && typeof product.description === 'string'
        && typeof product.category === 'string'
        && (product.brand === undefined || typeof product.brand === 'string')
        && typeof product.price === 'number'
        && typeof product.discountPercentage === 'number'
        && typeof product.rating === 'number'
        && Number.isInteger(product.stock)
        && typeof product.thumbnail === 'string'
        && Array.isArray(product.images)
        && product.images.every((image) => typeof image === 'string')
        && Array.isArray(product.reviews)
        && product.reviews.every((review) => {
            if (typeof review !== 'object' || review === null) return false;
            const candidate = review as Record<string, unknown>;
            return typeof candidate.rating === 'number'
                && typeof candidate.comment === 'string'
                && typeof candidate.date === 'string'
                && typeof candidate.reviewerName === 'string';
        });
}

    export function isProductsResponse(value: unknown): value is ProductsResponse {
    if (typeof value !== 'object' || value === null) return false;
    const response = value as Record<string, unknown>;

    return Array.isArray(response.products)
        && response.products.every(isProduct)
        && typeof response.total === 'number'
        && typeof response.skip === 'number'
        && typeof response.limit === 'number';
}