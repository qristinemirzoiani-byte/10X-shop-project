    import { lazy, Suspense, useRef, useEffect } from 'react';
    import { Outlet, useLocation, useSearchParams } from 'react-router';
    import { Header } from './Header';
    import { Footer } from './Footer';
    import { ScrollToTop } from '../components/ScrollToTop';
    const Sidebar = lazy(async () => {
        const module = await import('./Sidebar');
        return { default: module.Sidebar };
    });

    import beautyLocal from '../assets/beauty-bg.webp';
    import cityLocal from '../assets/city.webp';

    export function Layout() {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const mainRef = useRef<HTMLElement>(null);
    const isCatalog = location.pathname === '/';
    const isLogin = location.pathname === '/login';
    const category = (searchParams.get('category') || '').toLowerCase();

    // Reset scroll to top on route change
    useEffect(() => {
        if (mainRef.current) {
        mainRef.current.scrollTop = 0;
        }
    }, [location.pathname]);

    // Category determination for active background styling:
  // Floral background: beauty, fragrances, skin-care, groceries, and all women's categories
  // City/cyber background: tech, laptops, smartphones, vehicle, motorcycle, men's, furniture, all
    const floralCategories = [
        'beauty',
        'fragrances',
        'groceries',
        'beauty-and-makeup',
        'skin-care',
        'womens-dresses',
        'womens-shoes',
        'womens-watches',
        'womens-bags',
        'womens-jewellery',
        'tops',
    ];
    const isBeautyOrGroceries = floralCategories.some(
        (c) => category === c || category.startsWith('womens')
    );
    const isTechOrAll = !isBeautyOrGroceries;

    // Asset paths (direct bundled imports first, then public fallbacks, and reliable online fallback)
    const cityImage = cityLocal || '/city.jpg';
    const beautyImage = beautyLocal || '/beauty-bg.jpg';
    // Guaranteed dark neon cyber city
    const onlineCityFallback = 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1920&auto=format&fit=crop';
    // Fantasy floral fallback
    const onlineBeautyFallback = 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=1920&auto=format&fit=crop';

    return (
        <div className="h-screen flex flex-col bg-brand-dark text-slate-100 overflow-hidden relative">
        <ScrollToTop />

        {/* ========================================================
            1. Dynamic Background Layer (Neon City for Tech/All/Furniture)
            Wallpaper background stays constant dark and vivid in both themes!
            ======================================================== */}
        {isTechOrAll && (
            <div
            className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
            aria-hidden="true"
            >
            {/* Main Neon City background image */}
            <img
                src={cityImage}
                onError={(e) => {
                const target = e.currentTarget;
                if (target.src !== onlineCityFallback) {
                    target.src = onlineCityFallback;
                }
                }}
                alt="City Background"
                className="absolute inset-0 w-full h-full object-cover object-bottom md:object-center transition-opacity duration-500 opacity-90"
            />

            {/* Constant dark glass tint: header and sidebar stay pristine on wallpaper */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
            </div>
        )}

        {/* ========================================================
            2. Fantasy Blossom Background (Beauty, Fragrances & Groceries)
            ======================================================== */}
        {isBeautyOrGroceries && (
            <div
            className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
            aria-hidden="true"
            >
            {/* Main Fantasy Blossom background image */}
            <img
                src={beautyImage}
                onError={(e) => {
                const target = e.currentTarget;
                if (target.src !== onlineBeautyFallback) {
                    target.src = onlineBeautyFallback;
                }
                }}
                alt="Beauty Fantasy Flower Background"
                className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 opacity-90"
            />

            {/* Constant dark glass tint: header and sidebar stay pristine on wallpaper */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
            </div>
        )}

        {/* Header with transparent glass effect over wallpaper */}
        {!isLogin && <Header />}

        {/* Main body layout container */}
        <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden relative z-10">
            {/* Stationary Left Sidebar */}
            {isCatalog && (
                <Suspense fallback={null}>
                    <Sidebar />
                </Suspense>
            )}

            {/* Right scrollable catalog content area. Footer is inside scroll flow at bottom */}
            <main
            ref={mainRef}
            id="main-content"
            className="flex-1 min-w-0 min-h-0 lg:h-full overflow-y-auto no-scrollbar overflow-x-hidden px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col justify-between"
            >
            <div className="flex-1 pb-8">
                <Outlet />
            </div>
            {/* Footer naturally appears when user scrolls to bottom */}
            <Footer />
            </main>
        </div>
        </div>
    );
}