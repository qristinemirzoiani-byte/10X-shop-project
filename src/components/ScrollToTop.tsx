import { useEffect } from 'react';
import { useLocation } from 'react-router';

export function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // 1. Reset standard window scroll
        window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant',
        });

        // 2. Reset scroll on Layout's scrollable <main> container
        const mainEl = document.getElementById('main-content') || document.querySelector('main');
        if (mainEl) {
        mainEl.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant',
        });
        mainEl.scrollTop = 0;
        }

        // 3. Fallback for document scrolling
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }, [pathname]);

    return null;
}