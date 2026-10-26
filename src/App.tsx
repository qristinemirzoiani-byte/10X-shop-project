import { BrowserRouter, Routes, Route } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/Layout';
import LoginPage from './pages/LoginPage';
import { ToastProvider } from './contexts/ToastContext';
import OrdersPage from './pages/OrdersPage';

// Catalog view (sidebar is already handled by Layout)
function CatalogView() {
  return (
    <section className="w-full">
      <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 rounded-3xl p-12 text-center min-h-112.5 flex flex-col items-center justify-center shadow-xs">
        <h2 className="text-2xl font-black mb-2 text-slate-900 dark:text-white">
          🛍️ 10X Products Catalog
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md">
          Product cards from DummyJSON API will be fetched and rendered here!
        </p>
      </div>
    </section>
  );
}

// Temporary Cart view
function CartView() {
  return (
    <div className="text-center p-12 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 rounded-3xl">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">🛒 Your Shopping Cart</h2>
      <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">No items in cart yet.</p>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <ToastProvider>
          <Routes>
            {/* Main Layout routes with Header & Sidebar */}
            <Route path="/" element={<Layout />}>
              <Route index element={<CatalogView />} />
              <Route path="cart" element={<CartView />} />
              <Route path="orders" element={<OrdersPage />} />
              
              {/* <Route path="/profile" element={<ProfilePage />} /> */}
            </Route>
            

            {/* Standalone Login route */}
            <Route path="/login" element={<LoginPage />} />
          </Routes>
          </ToastProvider>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}