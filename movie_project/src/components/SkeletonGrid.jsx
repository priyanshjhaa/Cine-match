import React from 'react';
import SkeletonCard from './SkeletonCard';

const SkeletonGrid = ({ count = 10, variant = 'default' }) => {
  if (variant === 'trending') {
    return (
      <div className="scroll-container-trending overflow-x-auto scrollbar-thin pb-4">
        <div className="flex gap-2 px-4 min-w-max">
          {[...Array(count)].map((_, index) => (
            <SkeletonCard key={index} variant="trending" />
          ))}
        </div>
      </div>
    );
  }

  // Default grid layout
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 px-4">
      {[...Array(count)].map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

export default SkeletonGrid;
