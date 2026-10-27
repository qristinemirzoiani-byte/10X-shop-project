    import { Outlet, useLocation, useSearchParams } from 'react-router';
    import { Header } from './Header';
    import { Sidebar } from './Sidebar';
    import { Footer } from './Footer';

    // Importing images directly from src/assets/ so Vite bundles them correctly
    import cityImage from '../assets/city.jpg';
    import floralImage from '../assets/floral.webp';

    export function Layout() {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const isCatalog = location.pathname === '/';
    const category = (searchParams.get('category') || '').toLowerCase();

    // Category classification for dynamic backgrounds:
    const isBeautyOrGroceries = ['beauty', 'fragrances', 'groceries', 'beauty-and-makeup'].includes(category);

    // Choose background based on category
    const currentBgImage = isBeautyOrGroceries ? floralImage : cityImage;

    return (
        <div className="h-screen flex flex-col bg-[#0B0F19] text-slate-100 overflow-hidden relative">

        {/* ========================================================
            1. Dynamic Background Image Layer (Using <img> for reliability)
            ======================================================== */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
            <img
            src={currentBgImage}
            alt="Background theme"
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                isBeautyOrGroceries ? 'opacity-35' : 'opacity-50 blur-xs'
            }`}
            />
            {/* Dark overlay for perfect UI text and card readability */}
            <div className="absolute inset-0 bg-[#0B0F19]/55" />
        </div>


        {/* ========================================================
            2. Main Layout Structure
            ======================================================== */}
        
        {/* Header component */}
        <Header />

        {/* Core container area */}
        <div className="flex-1 flex overflow-hidden relative z-10">
            {/* Sidebar component */}
            {isCatalog && <Sidebar />}

            {/* Central content and footer container */}
            <div className="flex-1 min-w-0 flex flex-col h-full overflow-y-auto no-scrollbar overflow-x-hidden relative">
            
            {/* Main catalog view */}
            <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <Outlet />
            </main>
            
            {/* Footer component */}
            <Footer />
            </div>
        </div>
        </div>
    );
    }