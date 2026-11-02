    import React, { createContext, useContext, useState, useEffect } from 'react';
    import { userStorage } from '../models/StorageService';
    import { isAuthUser } from '../types/user';
    import type { AuthUser } from '../types/user';

    interface AuthContextType {
    user: AuthUser;
    login: (username: string) => void;
    logout: () => void;
    updateProfile: (details: Partial<AuthUser>) => void; 
    }

    const defaultGuestUser: AuthUser = {
    username: '',
    isLoggedIn: false,
    firstName: '',
    lastName: '',
    email: '',
    phone: '', 
    };

    // 4. Context
    const AuthContext = createContext<AuthContextType | undefined>(undefined);
    // 5. Provider component
    export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser>(() => {
        const saved = userStorage.get();
        if (isAuthUser(saved) && saved.isLoggedIn) return saved;
        return defaultGuestUser;
    });

    useEffect(() => {
        if (user.isLoggedIn) {
            userStorage.set(user);
        } else {
            userStorage.remove();
        }
    }, [user]);

    // login
    const login = (username: string) => {
        const cleanUsername = username.trim();
        setUser({
        username: cleanUsername,
        isLoggedIn: true,
        firstName: cleanUsername,
        lastName: '',
        email: `${cleanUsername.toLowerCase()}@example.com`,
        phone: '',
        });
    };

    // logout
    const logout = () => {
        setUser(defaultGuestUser);
        userStorage.remove();
    };

    // profile 
    const updateProfile = (details: Partial<AuthUser>) => {
        setUser((prev) => ({
        ...prev,
        ...details,
        }));
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateProfile }}>
        {children}
        </AuthContext.Provider>
    );
    }

    // 6. Custom hook
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}