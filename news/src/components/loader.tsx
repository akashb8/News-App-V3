import React from 'react';

const Loader: React.FC = () => {
  // Renders a grid of 6 skeleton cards that matches the responsive news card grid.
  const skeletonCards = Array(6).fill(0);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Grid of skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {skeletonCards.map((_, idx) => (
          <div 
            key={idx} 
            className="flex flex-col bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm overflow-hidden"
          >
            {/* Image Skeleton */}
            <div className="shimmer-bg aspect-[16/10] w-full rounded-xl mb-5" />

            {/* Badge & Date Row Skeleton */}
            <div className="flex justify-between items-center mb-4">
              <div className="shimmer-bg h-5 w-24 rounded-full" />
              <div className="shimmer-bg h-4 w-16 rounded" />
            </div>

            {/* Title Skeleton (2 lines) */}
            <div className="space-y-2.5 mb-4">
              <div className="shimmer-bg h-6 w-full rounded-lg" />
              <div className="shimmer-bg h-6 w-5/6 rounded-lg" />
            </div>

            {/* Description Skeleton (3 lines) */}
            <div className="space-y-2 mb-6">
              <div className="shimmer-bg h-4 w-full rounded" />
              <div className="shimmer-bg h-4 w-full rounded" />
              <div className="shimmer-bg h-4 w-3/4 rounded" />
            </div>

            {/* Button Skeleton */}
            <div className="mt-auto pt-4 border-t border-slate-50 dark:border-slate-800/60 flex justify-between items-center">
              <div className="shimmer-bg h-4 w-28 rounded" />
              <div className="shimmer-bg h-6 w-6 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loader;