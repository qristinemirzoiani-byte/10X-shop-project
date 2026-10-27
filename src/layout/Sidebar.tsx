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

    export const CATEGORIES = [
    { id: 'all', name: 'All Products', icon: Sparkles },
    { id: 'laptops', name: 'Laptops & Tech', icon: Laptop },
    { id: 'smartphones', name: 'Smartphones', icon: Smartphone },
    { id: 'beauty', name: 'Beauty & Makeup', icon: Sparkle },
    { id: 'fragrances', name: 'Fragrances', icon: Flower2 },
    { id: 'furniture', name: 'Furniture', icon: Armchair },
    { id: 'groceries', name: 'Groceries', icon: ShoppingBasket },
    ];

    export function Sidebar() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();

    const activeCategoryId = searchParams.get('category') || 'all';

    const handleCategoryClick = (categoryId: string) => {
        const nextParams = new URLSearchParams(searchParams);
        if (categoryId === 'all') {
        nextParams.delete('category');
        } else {
        nextParams.set('category', categoryId);
        nextParams.delete('q');
        }
        nextParams.set('page', '1');

        if (location.pathname !== '/') {
        navigate(`/?${nextParams.toString()}`);
        } else {
        setSearchParams(nextParams);
        }
    };

    return (
        <aside className="w-64 shrink-0 h-full bg-white/70 dark:bg-[#0B0F19]/70 backdrop-blur-xl border-r border-slate-200/80 dark:border-pink-500/15 p-4 flex flex-col overflow-y-auto no-scrollbar">
        <div className="mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2.5">
            Categories
            </h2>
        </div>

        <nav className="space-y-1 flex-1" aria-label="Sidebar categories">
            {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategoryId === cat.id;

            return (
                <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryClick(cat.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition text-left cursor-pointer ${
                    isActive
                    ? 'bg-pink-500/15 dark:bg-pink-500/20 text-pink-700 dark:text-white font-semibold border border-pink-500/30 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
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