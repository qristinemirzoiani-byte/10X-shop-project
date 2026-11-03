import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router';
import {
    ChevronDown,
    Menu,
    Sparkles,
    Laptop,
    Smartphone,
    Tablet,
    Sparkle,
    Flower2,
    Armchair,
    Home,
    ShoppingBasket,
    ShoppingBag,
    Tag,
    Car,
    Bike,
    Utensils,
    Shirt,
    Footprints,
    Watch,
    Gem,
    Glasses,
    Trophy,
    Headphones,
    Droplets,
} from 'lucide-react';
    import { fetchCategories } from '../api/products.api';

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

function getCategoryIcon(id: string): CategoryItem['icon'] {
    switch (id.toLowerCase()) {
        case 'all':
        return Sparkles;
        case 'laptops':
        return Laptop;
        case 'tablets':
        return Tablet;
        case 'smartphones':
        return Smartphone;
        case 'mobile-accessories':
        return Headphones;
        case 'vehicle':
        return Car;
        case 'motorcycle':
        return Bike;
        case 'beauty':
        return Sparkle;
        case 'skin-care':
        return Droplets;
        case 'fragrances':
        return Flower2;
        case 'furniture':
        return Armchair;
        case 'home-decoration':
        return Home;
        case 'kitchen-accessories':
        return Utensils;
        case 'groceries':
        return ShoppingBasket;
        case 'mens-shirts':
        case 'tops':
        return Shirt;
        case 'mens-shoes':
        case 'womens-shoes':
        return Footprints;
        case 'mens-watches':
        case 'womens-watches':
        return Watch;
        case 'womens-dresses':
        return Sparkles;
        case 'womens-bags':
        return ShoppingBag;
        case 'womens-jewellery':
        return Gem;
        case 'sunglasses':
        return Glasses;
        case 'sports-accessories':
        return Trophy;
        default:
        return Tag;
    }
}
    interface SidebarProps {
    className?: string;
    onSelectCategory?: (categoryId: string) => void;
    }

    export function Sidebar({ className = '', onSelectCategory }: SidebarProps) {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
        const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
        const sidebarRef = useRef<HTMLElement>(null);
        const categoryMenuButtonRef = useRef<HTMLButtonElement>(null);
        const [categories, setCategories] = useState<CategoryItem[]>(CATEGORIES);

        // Active category derived from URL query params (default to 'all' if omitted)
        const activeCategoryId = searchParams.get('category') || 'all';
        const activeCategory = categories.find((category) => category.id === activeCategoryId) ?? categories[0];

        useEffect(() => {
            const controller = new AbortController();
            let ignore = false;

            fetchCategories(controller.signal)
                .then((data) => {
                    if (!ignore && data.length > 0) {
                        setCategories([
                            { id: 'all', name: 'All Products', icon: Sparkles },
                            ...data.map((category) => ({
                                id: category.slug,
                                name: category.name,
                                icon: getCategoryIcon(category.slug),
                            })),
                        ]);
                    }
                })
                .catch((error: unknown) => {
                    if (!ignore && !(error instanceof Error && error.name === 'AbortError')) {
                        console.warn('Failed to load sidebar categories; using defaults:', error);
                    }
                });

            return () => {
                ignore = true;
                controller.abort();
            };
        }, []);

        useEffect(() => {
            if (!isCategoryMenuOpen) {
                return;
            }

            const closeOnOutsideClick = (event: MouseEvent) => {
                if (event.target instanceof Node && !sidebarRef.current?.contains(event.target)) {
                    setIsCategoryMenuOpen(false);
                }
            };
            const closeOnEscape = (event: KeyboardEvent) => {
                if (event.key === 'Escape') {
                    setIsCategoryMenuOpen(false);
                    categoryMenuButtonRef.current?.focus();
                }
            };

            document.addEventListener('mousedown', closeOnOutsideClick);
            document.addEventListener('keydown', closeOnEscape);
            return () => {
                document.removeEventListener('mousedown', closeOnOutsideClick);
                document.removeEventListener('keydown', closeOnEscape);
            };
        }, [isCategoryMenuOpen]);

    const handleCategoryClick = (categoryId: string) => {
        setIsCategoryMenuOpen(false);

        if (onSelectCategory) {
        onSelectCategory(categoryId);
        return;
        }

        // Sync selected category with URL query parameters
        const nextParams = new URLSearchParams(searchParams);
        nextParams.delete('q');
        if (categoryId === 'all') {
        nextParams.delete('category');
        } else {
        nextParams.set('category', categoryId);
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
        ref={sidebarRef}
        className={`relative w-full lg:w-64 shrink-0 h-auto lg:h-full bg-transparent border-none p-4 flex flex-col overflow-visible lg:overflow-y-auto no-scrollbar z-20 transition-colors ${className}`}
        >
        {/* Sidebar Section Title */}
        <div className="mb-2 hidden lg:mb-3 lg:block">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] px-2.5">
            Categories
            </h2>
        </div>

        <button
            ref={categoryMenuButtonRef}
            type="button"
            aria-label={`Browse categories. Current category: ${activeCategory.name}`}
            aria-expanded={isCategoryMenuOpen}
            aria-controls="sidebar-category-list"
            onClick={() => setIsCategoryMenuOpen((isOpen) => !isOpen)}
            className="lg:hidden w-full min-h-11 flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl border border-pink-400/40 bg-slate-950/80 text-white shadow-lg backdrop-blur-xl"
        >
            <span className="flex min-w-0 items-center gap-3">
                <Menu className="w-4 h-4 shrink-0 text-pink-300" />
                <span className="truncate text-sm font-semibold">{activeCategory.name}</span>
            </span>
            <ChevronDown className={`w-4 h-4 shrink-0 text-slate-300 transition-transform ${isCategoryMenuOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Categories Navigation List */}
        <nav
            id="sidebar-category-list"
            aria-label="Sidebar categories"
            className={`${isCategoryMenuOpen ? 'flex' : 'hidden'} no-scrollbar absolute inset-x-4 top-[calc(100%-1rem)] z-30 max-h-[60vh] flex-col gap-1 overflow-y-auto overflow-x-hidden rounded-2xl border border-slate-700/80 bg-slate-950/95 p-2 shadow-2xl backdrop-blur-xl lg:static lg:mt-0 lg:flex lg:max-h-none lg:flex-1 lg:space-y-1.5 lg:overflow-x-hidden lg:overflow-y-auto lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none`}
        >
            {categories.map((cat) => {
            const Icon = cat.icon;
            // Match active state by stable unique ID instead of array index
            const isActive = activeCategoryId === cat.id;

            return (
                <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryClick(cat.id)}
                className={`w-full min-h-11 flex items-center gap-3 px-4 py-2.5 rounded-xl lg:rounded-2xl text-sm transition-all text-left cursor-pointer border ${
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
