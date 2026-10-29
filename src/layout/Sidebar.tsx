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
        className={`w-64 shrink-0 h-full bg-transparent border-none p-4 flex flex-col overflow-y-auto no-scrollbar z-20 transition-colors ${className}`}
        >
        {/* Sidebar Section Title */}
        <div className="mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] px-2.5">
            Categories
            </h2>
        </div>

        {/* Categories Navigation List */}
        <nav className="space-y-1.5 flex-1" aria-label="Sidebar categories">
            {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            // Match active state by stable unique ID instead of array index
            const isActive = activeCategoryId === cat.id;

            return (
                <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryClick(cat.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm transition-all text-left cursor-pointer border ${
                    isActive
                    ? 'bg-pink-500/25 hover:bg-pink-500/35 border-pink-400/50 text-white font-semibold backdrop-blur-md shadow-[0_4px_16px_rgba(244,63,94,0.22)]'
                    : 'text-slate-300 hover:text-white hover:bg-white/5 bg-transparent font-medium border-transparent'
                }`}
                >
                <Icon
                    className={`w-4 h-4 shrink-0 ${
                    isActive
                        ? 'text-pink-300'
                        : 'text-slate-400'
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
