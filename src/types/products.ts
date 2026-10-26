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
    sort?: string;
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