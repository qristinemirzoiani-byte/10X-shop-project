    import React, { useState, useEffect } from 'react';
    import { useSearchParams } from 'react-router';
    import {
    Sparkles,
    Laptop,
    Smartphone,
    Sparkle,
    Flower2,
    Armchair,
    ShoppingBasket,
    Tag,
    } from 'lucide-react';
    import { fetchCategories } from '../api/products.api';

    export interface CategoryOption {
    id: string;
    name: string;
    icon?: React.ComponentType<{ className?: string }>;
    }

    export const DEFAULT_CATEGORY_OPTIONS: CategoryOption[] = [
    { id: 'all', name: 'All Products', icon: Sparkles },
    { id: 'laptops', name: 'Laptops & Tech', icon: Laptop },
    { id: 'smartphones', name: 'Smartphones', icon: Smartphone },
    { id: 'beauty', name: 'Beauty & Makeup', icon: Sparkle },
    { id: 'fragrances', name: 'Fragrances', icon: Flower2 },
    { id: 'furniture', name: 'Furniture', icon: Armchair },
    { id: 'groceries', name: 'Groceries', icon: ShoppingBasket },
    ];

    export const CATEGORY_OPTIONS = DEFAULT_CATEGORY_OPTIONS;

    const getCategoryIcon = (id: string): React.ComponentType<{ className?: string }> => {
    switch (id.toLowerCase()) {
        case 'all': return Sparkles;
        case 'laptops': return Laptop;
        case 'smartphones': return Smartphone;
        case 'beauty': case 'skin-care': return Sparkle;
        case 'fragrances': return Flower2;
        case 'furniture': case 'home-decoration': return Armchair;
        case 'groceries': return ShoppingBasket;
        default: return Tag;
    }
    };

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
    const [categories, setCategories] = useState<CategoryOption[]>(DEFAULT_CATEGORY_OPTIONS);

    useEffect(() => {
        let ignore = false;
        const controller = new AbortController();

        fetchCategories(controller.signal)
        .then((data) => {
            if (!ignore && data?.length) {
            const loaded: CategoryOption[] = data.map((c) => ({
                id: c.slug,
                name: c.name,
                icon: getCategoryIcon(c.slug),
            }));
            setCategories([
                { id: 'all', name: 'All Products', icon: Sparkles },
                ...loaded,
            ]);
            }
        })
        .catch((err) => {
            if (!ignore && err.name !== 'AbortError') {
            console.warn('Using default categories fallback:', err);
            }
        });

        return () => {
        ignore = true;
        controller.abort();
        };
    }, []);

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
        {categories.map((cat) => {
            const Icon = cat.icon || Tag;
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