    import { useState, useRef, useEffect } from 'react';
    import { ArrowUpDown, Check } from 'lucide-react';

    export interface SortOptionItem {
    value: string;
    label: string;
    }

    export const SORT_OPTIONS: SortOptionItem[] = [
    { value: '', label: 'Default sorting' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating-desc', label: 'Rating: High to Low' },
    { value: 'title-asc', label: 'Name: A → Z' },
    ];

    interface CustomSortDropdownProps {
    value: string;
    onChange: (value: string) => void;
    }

    export function CustomSortDropdown({ value, onChange }: CustomSortDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = SORT_OPTIONS.find((opt) => opt.value === value) || SORT_OPTIONS[0];

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
        }
        function handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'Escape') setIsOpen(false);
        }

        if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);
        }
        return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    const handleSelect = (val: string) => {
        onChange(val);
        setIsOpen(false);
    };

    return (
        <div className="relative min-w-44 sm:min-w-48 z-30" ref={dropdownRef}>
        {/* მთავარი ღილაკი მოუმრგვალებული კუთხეებით */}
        <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            className={`w-full flex items-center justify-between gap-2.5 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-2xl border transition-all duration-200 cursor-pointer shadow-sm ${
            isOpen
                ? 'border-pink-500 ring-2 ring-pink-500/30 bg-white dark:bg-slate-900 text-pink-600 dark:text-pink-400 shadow-pink-500/10'
                : 'border-pink-500/40 hover:border-pink-500 bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 hover:shadow-md'
            }`}
        >
            <span className="truncate">{selectedOption.label}</span>
            <ArrowUpDown
            className={`w-4 h-4 shrink-0 transition-colors ${
                isOpen ? 'text-pink-500' : 'text-pink-500/80 dark:text-pink-400'
            }`}
            />
        </button>

        {/* ჩამოშლილი მენიუ: მოუმრგვალებული კუთხეებითა და ვარდისფერი აქცენტით */}
        {isOpen && (
            <div
            role="listbox"
            className="absolute right-0 top-full mt-2 w-full min-w-52 p-1.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-pink-500/40 dark:border-pink-500/40 shadow-2xl shadow-pink-500/20 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150"
            >
            {SORT_OPTIONS.map((option) => {
                const isSelected = option.value === value;
                return (
                <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(option.value)}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all cursor-pointer ${
                    isSelected
                        ? 'bg-pink-500/15 dark:bg-pink-500/25 text-pink-600 dark:text-pink-400 font-bold border border-pink-500/30 shadow-xs'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-pink-50 dark:hover:bg-slate-800/80 hover:text-pink-600 dark:hover:text-pink-300'
                    }`}
                >
                    <span>{option.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-pink-500 dark:text-pink-400 shrink-0 ml-2" />}
                </button>
                );
            })}
            </div>
        )}
        </div>
    );
}