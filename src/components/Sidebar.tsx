    import { useSearchParams, useNavigate, useLocation } from 'react-router';
    import {
    Sparkles,
    Laptop,
    Smartphone,
    Sparkle,
    Flower2,
    Armchair,
    ShoppingBasket,
    } from 'lucide-react';

    export interface CategoryItem {
    id: string;
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    }

    export const CATEGORIES: CategoryItem[] = [
    { id: 'all', name: 'All Products', icon: Sparkles },
    { id: 'laptops', name: 'Laptops & Tech', icon: Laptop },
    { id: 'smartphones', name: 'Smartphones', icon: Smartphone },
    { id: 'beauty', name: 'Beauty & Makeup', icon: Sparkle },
    { id: 'fragrances', name: 'Fragrances', icon: Flower2 },
    { id: 'furniture', name: 'Furniture', icon: Armchair },
    { id: 'groceries', name: 'Groceries', icon: ShoppingBasket },
    ];

    interface SidebarProps {
    className?: string;
    onSelectCategory?: (categoryId: string) => void;
    }

    export function Sidebar({ className = '', onSelectCategory }: SidebarProps) {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Active category derived from URL query params (default to 'all' if omitted)
    const activeCategoryId = searchParams.get('category') || 'all';

    const handleCategoryClick = (categoryId: string) => {
        if (onSelectCategory) {
        onSelectCategory(categoryId);
        return;
        }

        // Sync selected category with URL query parameters
        const nextParams = new URLSearchParams(searchParams);
        if (categoryId === 'all') {
        nextParams.delete('category');
        } else {
        nextParams.set('category', categoryId);
        nextParams.delete('q'); // Clear search query when filtering by category
        }
        nextParams.set('page', '1');

        // If navigated outside catalog route, redirect to root with search params
        if (location.pathname !== '/') {
        navigate(`/?${nextParams.toString()}`);
        } else {
        setSearchParams(nextParams);
        }
    };

    return (
        <aside
        className={`w-64 shrink-0 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-colors p-4 ${className}`}
        >
        {/* Sidebar Section Title */}
        <div className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2.5">
            Categories
            </h2>
        </div>

        {/* Categories Navigation List */}
        <nav className="flex-1 space-y-1.5" aria-label="Sidebar categories">
            {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            // Match active state by stable unique ID instead of array index
            const isActive = activeCategoryId === cat.id;

            return (
                <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryClick(cat.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition text-left cursor-pointer ${
                    isActive
                    ? 'bg-pink-500/15 dark:bg-pink-500/20 text-pink-700 dark:text-white font-semibold border border-pink-500/30 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
                >
                <Icon
                    className={`w-4 h-4 shrink-0 ${
                    isActive
                        ? 'text-pink-600 dark:text-pink-400'
                        : 'text-slate-400 dark:text-slate-400'
                    }`}
                />
                <span className="truncate">{cat.name}</span>
                </button>
            );
            })}
        </nav>
        </aside>
    );
}