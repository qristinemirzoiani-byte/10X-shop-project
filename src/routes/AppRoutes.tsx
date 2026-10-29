// routes/AppRoutes.tsx
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router';
import { Layout } from '../layout/Layout';
import { ProtectedRoute } from './ProtectedRoute';
import { LoadingSpinner } from '../components/LoadingSpinner';

// Route-level code splitting using React.lazy (PRD O1 requirement)
const CatalogPage = lazy(() => import('../pages/CatalogPage'));
const ProductPage = lazy(() => import('../pages/ProductPage'));
const CartPage = lazy(() => import('../pages/CartPage'));
const CheckoutPage = lazy(() => import('../pages/CheckoutPage'));
const OrdersPage = lazy(() => import('../pages/OrdersPage'));
const OrderDetailsPage = lazy(() => import('../pages/OrderDetailsPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

export function AppRoutes() {
    return (
        <Suspense fallback={<LoadingSpinner text="Loading page..." />}>
        <Routes>
            <Route element={<Layout />}>
            {/* Public routes */}
            <Route path="/" element={<CatalogPage />} />
            <Route path="/products/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected routes */}
            <Route
                path="/checkout"
                element={
                <ProtectedRoute>
                    <CheckoutPage />
                </ProtectedRoute>
                }
            />
            <Route
                path="/orders"
                element={
                <ProtectedRoute>
                    <OrdersPage />
                </ProtectedRoute>
                }
            />
            <Route
                path="/orders/:id"
                element={
                <ProtectedRoute>
                    <OrderDetailsPage />
                </ProtectedRoute>
                }
            />
            <Route
                path="/profile"
                element={
                <ProtectedRoute>
                    <ProfilePage />
                </ProtectedRoute>
                }
            />

            {/* 404 Catch-all route */}
            <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
        </Suspense>
    );
}
