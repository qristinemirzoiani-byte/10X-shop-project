    import React, { createContext, useContext, useState, useEffect } from 'react';
    import { STORAGE_KEYS } from '../models/StorageService';


    export interface AuthUser {
    username: string;
    isLoggedIn: boolean;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    }

    
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
        try {
        const saved = localStorage.getItem(STORAGE_KEYS.user);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed && parsed.isLoggedIn) return parsed;
        }
        } catch {
        // fallback
        }
        return defaultGuestUser;
    });

    // save  person localStorage
    useEffect(() => {
        try {
        if (user.isLoggedIn) {
            localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
        } else {
            localStorage.removeItem(STORAGE_KEYS.user);
        }
        } catch {
        // ignore
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
        localStorage.removeItem(STORAGE_KEYS.user);
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