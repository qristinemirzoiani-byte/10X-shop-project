    import React from 'react';

    // Reusable 10X Shop Brand Logo
    export function Logo() {
    return (
        <div className="flex items-center gap-1 select-none">
        <div className="px-2.5 py-1 bg-black border border-slate-800 rounded-lg">
            <span className="text-white font-black text-xl tracking-tight">10</span>
            <span className="text-pink-500 font-black text-xl">X</span>
        </div>
        <span className="text-lg font-black text-white tracking-tight ml-1">
            Shop
        </span>
        </div>
    );
}