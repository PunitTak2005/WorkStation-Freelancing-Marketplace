import React, { useState } from 'react';
import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/utils/cn';

const StarRating = ({
  rating = 0,
  maxStars = 5,
  size = 'md',
  interactive = false,
  onChange,
  showValue = false,
  className
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const handleMouseEnter = (index) => {
    if (interactive) setHoverRating(index);
  };

  const handleMouseLeave = () => {
    if (interactive) setHoverRating(0);
  };

  const handleClick = (index) => {
    if (interactive && onChange) onChange(index);
  };

  const currentRating = hoverRating || rating;

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div 
        className="flex items-center"
        onMouseLeave={handleMouseLeave}
      >
        {[...Array(maxStars)].map((_, i) => {
          const starValue = i + 1;
          const isFull = starValue <= Math.floor(currentRating);
          const isHalf = !isFull && starValue - 0.5 <= currentRating && !interactive;

          return (
            <button
              key={i}
              type={interactive ? 'button' : undefined}
              className={cn(
                'focus:outline-none transition-colors duration-150',
                interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
              )}
              onMouseEnter={() => handleMouseEnter(starValue)}
              onClick={() => handleClick(starValue)}
              disabled={!interactive}
            >
              {isHalf ? (
                <div className="relative">
                  <Star className={cn('text-slate-300 dark:text-slate-600', sizes[size])} />
                  <div className="absolute inset-0 overflow-hidden w-1/2">
                    <Star className={cn('fill-orange-500 text-orange-500', sizes[size])} />
                  </div>
                </div>
              ) : (
                <Star
                  className={cn(
                    sizes[size],
                    isFull
                      ? 'fill-orange-500 text-orange-500'
                      : 'fill-transparent text-slate-300 dark:text-slate-600'
                  )}
                />
              )}
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="ml-1 text-sm font-medium text-slate-700 dark:text-slate-300">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
