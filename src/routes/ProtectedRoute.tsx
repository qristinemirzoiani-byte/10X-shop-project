import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
    children: ReactNode;
    }

    export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user } = useAuth();
    const location = useLocation();

    if (!user.isLoggedIn) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    return <>{children}</>;
}
