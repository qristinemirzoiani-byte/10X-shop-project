    import { Star } from 'lucide-react';
    import type { Review } from '../types/products';
    import { formatDate } from '../utils/format';

    export interface ReviewsListProps {
    reviews: Review[];
    }

    export function ReviewsList({ reviews }: ReviewsListProps) {
    return (
        <div className="space-y-4">
        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
            Customer Reviews ({reviews.length})
        </h4>

        {reviews.length === 0 ? (
            <p className="text-xs text-slate-500">No reviews yet. Be the first to review!</p>
        ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {reviews.map((rev, index) => (
                <div key={index} className="py-4 space-y-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 flex items-center justify-center text-xs font-bold uppercase">
                        {rev.reviewerName ? rev.reviewerName.charAt(0) : 'U'}
                    </div>
                    <span className="font-semibold text-xs text-slate-900 dark:text-white">
                        {rev.reviewerName || 'Anonymous'}
                    </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                    {rev.date ? formatDate(rev.date) : 'Recently'}
                    </span>
                </div>

                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                        star <= rev.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                    />
                    ))}
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {rev.comment}
                </p>
                </div>
            ))}
            </div>
        )}
        </div>
    );
}

export default ReviewsList;