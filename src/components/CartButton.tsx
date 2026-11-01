    import { NavLink } from 'react-router';
    import { ShoppingCart } from 'lucide-react';
    import { useCart } from '../contexts/CartContext';

    interface CartButtonProps {
    onClick?: () => void;
    className?: string;
    isMobile?: boolean;
    }

    export function CartButton({ onClick, className, isMobile = false }: CartButtonProps) {
    const { cart } = useCart();
    const totalItems = cart.itemCount;

    if (isMobile) {
        return (
        <NavLink
            to="/cart"
            onClick={onClick}
            className={({ isActive }) =>
            className ||
            `relative p-2 rounded-xl transition ${
                isActive
                ? 'text-pink-400 bg-pink-500/20 border border-pink-500/30'
                : 'text-slate-700 dark:text-slate-300 hover:text-pink-500'
            }`
            }
            aria-label={`Cart with ${totalItems} items`}
        >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-linear-to-r from-pink-600 to-rose-600 text-white text-[10px] font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center">
                {totalItems}
            </span>
            )}
        </NavLink>
        );
    }

    return (
        <NavLink
        to="/cart"
        onClick={onClick}
        className={({ isActive }) =>
            className ||
            `relative p-2.5 rounded-full border transition cursor-pointer shadow-sm backdrop-blur-xs ${
            isActive
                ? 'text-pink-100 bg-pink-500/30 border-pink-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                : 'text-slate-200 hover:text-white border-slate-700/50 bg-black/40 hover:bg-black/60'
            }`
        }
        aria-label={`Cart with ${totalItems} items`}
        >
        <ShoppingCart className="w-4 h-4" />
        {totalItems > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-pink-500/80 backdrop-blur-xs text-white text-[10px] font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center border border-pink-400/50 shadow-md">
            {totalItems}
            </span>
        )}
        </NavLink>
    );
}
export default CartButton;