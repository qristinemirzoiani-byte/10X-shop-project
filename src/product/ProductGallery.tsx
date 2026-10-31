interface ProductGalleryProps {
    images: string[];
    selectedImage: string;
    onSelectImage: (img: string) => void;
    title: string;
}

export function ProductGallery({ images, selectedImage, onSelectImage, title }: ProductGalleryProps) {
    return (
        <div className="space-y-4">
        {/* big lmage*/}
        <div className="max-w-md mx-auto aspect-square max-h-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden p-6 flex items-center justify-center shadow-sm">
            <img
                src={selectedImage}
                alt={title}
                width={400}
                height={400}
                className="object-contain w-full h-full max-h-68 transition-all duration-300"
            />
            </div>

    {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {images.map((img, idx) => (
                <button
                key={idx}
                type="button"
                onClick={() => onSelectImage(img)}
                className={`w-16 h-16 rounded-xl border-2 p-1 bg-white dark:bg-slate-900 overflow-hidden shrink-0 transition cursor-pointer ${
                    selectedImage === img
                    ? 'border-pink-500 ring-2 ring-pink-500/20'
                    : 'border-slate-200 dark:border-slate-800 opacity-70 hover:opacity-100'
                }`}
                >
                <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-contain" />
                </button>
            ))}
            </div>
        )}
        </div>
    );
}

export default ProductGallery;