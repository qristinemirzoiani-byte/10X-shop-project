    import React, { createContext, useContext, useState } from 'react';

    // 1. User type definition
    export interface AuthUser {
    username: string;
    isLoggedIn: boolean;
    }

    // 2. What the Context shares across the entire app
    interface AuthContextType {
    user: AuthUser;
    login: (username: string) => void;
    logout: () => void;
    }

    // 3. Initial guest state (when not logged in)
    const defaultGuestUser: AuthUser = {
    username: '',
    isLoggedIn: false,
    };

    // 4. Create the context
    const AuthContext = createContext<AuthContextType | undefined>(undefined);

    // 5. Provider component that wraps the application
    export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser>(defaultGuestUser);

    // Login handler: sets user as logged in
    const login = (username: string) => {
        setUser({
        username: username.trim(),
        isLoggedIn: true,
        });
    };

    // Logout handler: resets back to guest
    const logout = () => {
        setUser(defaultGuestUser);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
        {children}
        </AuthContext.Provider>
    );
    }

    // 6. Custom hook to consume the auth context in any component
    export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}