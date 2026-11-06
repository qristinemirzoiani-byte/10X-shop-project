    import React, { createContext, useContext, useState, useEffect } from 'react';
    import { userStorage } from '../models/StorageService';
    import { isAuthUser } from '../types/user';
    import type { AuthUser } from '../types/user';
    import { isValidEmail } from '../utils/validation';

    interface AuthContextType {
    user: AuthUser;
    login: (username: string, email?: string) => void;
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

    const getDisplayName = (value: string) =>
    value
        .split('@')[0]
        .replace(/[._-]+/g, ' ')
        .replace(/\b[a-z]/g, (letter) => letter.toUpperCase());

    const getInitialUser = (): AuthUser => {
    const saved = userStorage.get();
    if (!isAuthUser(saved) || !saved.isLoggedIn) return defaultGuestUser;

    if (
        isValidEmail(saved.username)
        && saved.email === `${saved.username}@example.com`
        && saved.firstName === saved.username
    ) {
        const displayName = getDisplayName(saved.username);
        return { ...saved, username: displayName, firstName: displayName, email: saved.username };
    }

    return saved;
    };

    // 5. Provider component
    export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser>(getInitialUser);

    useEffect(() => {
        if (user.isLoggedIn) {
            userStorage.set(user);
        } else {
            userStorage.remove();
        }
    }, [user]);

    // login
    const login = (username: string, email?: string) => {
        const cleanUsername = username.trim();
        const displayName = isValidEmail(cleanUsername) ? getDisplayName(cleanUsername) : cleanUsername;
        setUser({
        username: displayName,
        isLoggedIn: true,
        firstName: displayName,
        lastName: '',
        email: email?.trim() || (isValidEmail(cleanUsername) ? cleanUsername : ''),
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