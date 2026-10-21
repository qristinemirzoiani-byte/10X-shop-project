import React from 'react';

import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';

export default function App() {
  return (
    // Wrap entire app in AuthProvider so login state works everywhere
    <AuthProvider>
      <LoginPage />
    </AuthProvider>
  );
}