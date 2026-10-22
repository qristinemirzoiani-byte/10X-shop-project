import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/Header';
import LoginPage from './pages/LoginPage';

function AppContent() {
  const { user } = useAuth();

  // Current view: default is 'catalog' (the main storefront)
  const [currentView, setCurrentView] = useState<'catalog' | 'login' | 'cart'>('catalog');

  // If user navigated to Login page, show clean LoginPage without header
  if (currentView === 'login') {
    return (
      <div className="relative">
        {/* Back to store button */}
        <button
          type="button"
          onClick={() => setCurrentView('catalog')}
          className="absolute top-6 left-6 z-20 text-xs font-bold text-slate-400 hover:text-pink-400 transition cursor-pointer"
        >
          ← Back to Shop
        </button>

        <LoginPage />
      </div>
    );
  }

  // Main Shop View: Header + Sidebar + Products
  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col font-sans">
      
      {/* 1. Header is ONLY shown on shop pages */}
      <Header
        cartCount={0}
        onNavigateLogin={() => setCurrentView('login')}
        onNavigateCatalog={() => setCurrentView('catalog')}
        onNavigateCart={() => setCurrentView('cart')}
      />

      {/* 2. Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {currentView === 'catalog' && (
          <div className="flex flex-col md:flex-row gap-8">
            
            {/* Sidebar (საიდბარი - კატეგორიები და ფილტრები) */}
            <aside className="w-full md:w-64 shrink-0 space-y-6">
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                  Categories
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  <li className="px-3 py-2 bg-pink-600/20 text-pink-400 font-bold rounded-xl border border-pink-500/30 cursor-pointer">
                    ✨ All Products
                  </li>
                  <li className="px-3 py-2 hover:bg-slate-800/60 hover:text-white rounded-xl transition cursor-pointer">
                    💄 Beauty & Makeup
                  </li>
                  <li className="px-3 py-2 hover:bg-slate-800/60 hover:text-white rounded-xl transition cursor-pointer">
                    🛋️ Furniture & Home
                  </li>
                  <li className="px-3 py-2 hover:bg-slate-800/60 hover:text-white rounded-xl transition cursor-pointer">
                    📱 Tech & Gadgets
                  </li>
                </ul>
              </div>
            </aside>

            {/* Products Grid Area */}
            <section className="flex-1">
              <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
                <h2 className="text-2xl font-black mb-2">🛍️ 10X Products Catalog</h2>
                <p className="text-slate-400 text-sm max-w-md">
                  Here we will fetch and display real products from DummyJSON API!
                </p>
              </div>
            </section>

          </div>
        )}

        {currentView === 'cart' && (
          <div className="text-center p-12">
            <h2 className="text-2xl font-bold">🛒 Cart Page</h2>
          </div>
        )}
      </main>

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}