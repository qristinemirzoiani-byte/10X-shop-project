
export function discountedPrice(price: number, discountPercentage: number): number {
    return price * (1 - discountPercentage / 100);
}

export function formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(price);
}

export function formatDate(isoDate: string): string {
    try {
        return new Date(isoDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    } catch {
        return isoDate;
    }
}