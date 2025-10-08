import React from 'react';

const SkeletonCard = ({ variant = 'default' }) => {
  if (variant === 'trending') {
    return (
      <div className="relative flex items-end">
        {/* Number placeholder */}
        <div className="flex-shrink-0 mb-8 mr-4">
          <div className="w-20 h-32 bg-white/5 rounded-lg animate-pulse"></div>
        </div>
        
        {/* Card placeholder */}
        <div className="w-[220px] h-[330px] rounded-xl overflow-hidden bg-white/5 animate-pulse -ml-3">
          <div className="w-full h-full bg-gradient-to-br from-white/10 to-white/5"></div>
        </div>
      </div>
    );
  }

  // Default variant - for popular movies grid
  return (
    <div className="w-full aspect-[2/3] rounded-xl overflow-hidden bg-white/5 animate-pulse">
      <div className="w-full h-full bg-gradient-to-br from-white/10 to-white/5"></div>
    </div>
  );
};

export default SkeletonCard;
