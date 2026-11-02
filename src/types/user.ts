
export interface AuthUser {
    username: string;
    isLoggedIn: boolean;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
}

export function isAuthUser(value: unknown): value is AuthUser {
    if (typeof value !== 'object' || value === null) return false;
    const user = value as Record<string, unknown>;

    return typeof user.username === 'string'
        && typeof user.isLoggedIn === 'boolean'
        && (user.firstName === undefined || typeof user.firstName === 'string')
        && (user.lastName === undefined || typeof user.lastName === 'string')
        && (user.email === undefined || typeof user.email === 'string')
        && (user.phone === undefined || typeof user.phone === 'string');
}

export interface LoginFormValues {
    username: string;
    password: string;
}

export type ProfileFormValues = Pick<AuthUser, 'firstName' | 'lastName' | 'email' | 'phone'>;