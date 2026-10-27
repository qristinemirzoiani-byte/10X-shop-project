    import type { Product } from '../types/products';
    import { ProductCard } from './ProductCard';

    interface ProductGridProps {
    products: Product[];
    }

    export function ProductGrid({ products }: ProductGridProps) {
    return (
        // xl:grid-cols
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => (
            <ProductCard key={product.id} product={product} />
        ))}
        </div>
    );
}