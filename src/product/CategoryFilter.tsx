    import React from 'react';
    import { useSearchParams } from 'react-router';
    import {
    Sparkles,
    Laptop,
    Smartphone,
    Sparkle,
    Flower2,
    Armchair,
    ShoppingBasket,
    } from 'lucide-react';

    export interface CategoryOption {
    id: string;
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    }

    export const CATEGORY_OPTIONS: CategoryOption[] = [
    { id: 'all', name: 'All Products', icon: Sparkles },
    { id: 'laptops', name: 'Laptops & Tech', icon: Laptop },
    { id: 'smartphones', name: 'Smartphones', icon: Smartphone },
    { id: 'beauty', name: 'Beauty & Makeup', icon: Sparkle },
    { id: 'fragrances', name: 'Fragrances', icon: Flower2 },
    { id: 'furniture', name: 'Furniture', icon: Armchair },
    { id: 'groceries', name: 'Groceries', icon: ShoppingBasket },
    ];

    export interface CategoryFilterProps {
    activeCategory?: string;
    onSelectCategory?: (category: string) => void;
    className?: string;
    }

    export function CategoryFilter({
    activeCategory,
    onSelectCategory,
    className = '',
    }: CategoryFilterProps) {
    const [searchParams, setSearchParams] = useSearchParams();

    // Resolve category: if activeCategory is empty string, undefined or null, read from URL.
    // If still empty or 'all', default to 'all'.
    const rawCategory =
        activeCategory !== undefined && activeCategory !== null && activeCategory.trim() !== ''
        ? activeCategory
        : (searchParams.get('category') || 'all');

    const currentCategory =
        !rawCategory || rawCategory.trim() === '' || rawCategory.toLowerCase() === 'all'
        ? 'all'
        : rawCategory;

    const handleSelect = (id: string) => {
        if (onSelectCategory) {
        onSelectCategory(id);
        return;
        }

        const next = new URLSearchParams(searchParams);
        if (id === 'all') {
        next.delete('category');
        } else {
        next.set('category', id);
        next.delete('q');
        }
        next.set('page', '1');
        setSearchParams(next);
    };

    return (
        <div className={`flex flex-wrap gap-2 ${className}`}>
        {CATEGORY_OPTIONS.map((cat) => {
            const Icon = cat.icon;
            const isActive = currentCategory.toLowerCase() === cat.id.toLowerCase();

            return (
            <button
                key={cat.id}
                type="button"
                onClick={() => handleSelect(cat.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                isActive
                    ? 'bg-pink-600 border-pink-500 text-white shadow-md shadow-pink-600/30'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-pink-400 dark:hover:border-pink-500/50'
                }`}
            >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.name}</span>
            </button>
            );
        })}
        </div>
    );
}

export default CategoryFilter;