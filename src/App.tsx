import { BrowserRouter, Routes, Route } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { CartProvider } from './contexts/CartContext';
import { Layout } from './layout/Layout';

// Pages
import CatalogPage from './pages/CatalogPage';
import OrdersPage from './pages/OrdersPage';
import LoginPage from './pages/LoginPage';

// Standalone Cart View (to be connected later)
function CartView() {
  return (
    <div className="text-center p-12 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 rounded-3xl">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">🛒 Your Shopping Cart</h2>
      <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">Cart Page will be connected next!</p>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <ToastProvider>
            <CartProvider>
              <Routes>
                {/* Main Layout routes with Header & Sidebar */}
                <Route path="/" element={<Layout />}>
                  <Route index element={<CatalogPage />} />
                  <Route path="cart" element={<CartView />} />
                  <Route path="orders" element={<OrdersPage />} />
                  {/* <Route path="products/:id" element={<ProductPage />} /> */}
                  {/* <Route path="profile" element={<ProfilePage />} /> */}
                </Route>

                {/* Standalone Login route */}
                <Route path="/login" element={<LoginPage />} />
              </Routes>
            </CartProvider>
          </ToastProvider>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}