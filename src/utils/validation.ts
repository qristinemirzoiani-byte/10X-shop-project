export function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidPhone(phone: string): boolean {
    const digitsOnly = phone.replace(/[\s+-]/g, '');
        return digitsOnly.length >= 9 && digitsOnly.length <= 15;
}