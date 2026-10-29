import React from 'react';
import { Sparkles, Star, Send } from 'lucide-react';

export interface ReviewFormProps {
    rating: number;
    setRating: (rating: number) => void;
    comment: string;
    setComment: (comment: string) => void;
    errors: { rating?: string; comment?: string };
    setErrors: React.Dispatch<React.SetStateAction<{ rating?: string; comment?: string }>>;
    onSubmit: (e: React.FormEvent) => void;
}

export function ReviewForm({
    rating,
    setRating,
    comment,
    setComment,
    errors,
    setErrors,
    onSubmit,
    }: ReviewFormProps) {
    return (
        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-6">
        <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-600 dark:text-pink-400" />
            Write a Customer Review
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Share your experience with this product with future buyers.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
            <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Rating
            </label>
            <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => {
                    setRating(star);
                    if (errors.rating) {
                        setErrors((prev) => ({ ...prev, rating: undefined }));
                    }
                    }}
                    className="p-1 focus:outline-none transition hover:scale-110 cursor-pointer"
                >
                    <Star
                    className={`w-6 h-6 ${
                        star <= rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300 dark:text-slate-600'
                    }`}
                    />
                </button>
                ))}
                <span className="text-xs text-slate-500 font-medium ml-2">
                {rating > 0 ? `${rating} out of 5 stars` : 'Select a rating'}
                </span>
            </div>
            {errors.rating && (
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.rating}</p>
            )}
            </div>

            <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Your Comment (min. 10 characters)
            </label>
            <textarea
                rows={3}
                value={comment}
                onChange={(e) => {
                setComment(e.target.value);
                if (errors.comment) {
                    setErrors((prev) => ({ ...prev, comment: undefined }));
                }
                }}
                placeholder="What did you like or dislike about this product?"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
            />
            {errors.comment && (
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errors.comment}</p>
            )}
            </div>

            <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-semibold text-xs shadow-sm shadow-pink-600/25 transition active:scale-95 cursor-pointer"
            >
            <Send className="w-3.5 h-3.5" />
            Submit Review
            </button>
        </form>
        </div>
    );
 }

export default ReviewForm;