import { BrowserRouter } from 'react-router';
// import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { AppRoutes } from './routes/AppRoutes';

export default function App() {
  return (
    // <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <CartProvider>
                <AppRoutes />
              </CartProvider>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </BrowserRouter>
  //   </ErrorBoundary>
  );
}
