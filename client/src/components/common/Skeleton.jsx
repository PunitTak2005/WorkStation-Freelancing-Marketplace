import React from 'react';
import { cn } from '@/utils/cn';

const Skeleton = ({ variant = 'text', width, height, count = 1, className }) => {
  const baseClasses = 'animate-pulse bg-slate-200 dark:bg-slate-700';

  const variants = {
    text: 'rounded-md h-4 w-full',
    avatar: 'rounded-full h-12 w-12',
    card: 'rounded-2xl h-48 w-full',
    thumbnail: 'rounded-lg h-24 w-24',
  };

  const elements = Array.from({ length: count }).map((_, i) => (
    <div
      key={i}
      className={cn(
        baseClasses,
        variants[variant],
        className
      )}
      style={{
        width: width || (variant === 'text' && count > 1 && i === count - 1 ? '60%' : undefined),
        height,
      }}
    />
  ));

  if (count > 1) {
    return <div className="space-y-3">{elements}</div>;
  }

  return elements[0];
};

export const CardSkeleton = () => (
  <div className="rounded-2xl p-6 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 animate-pulse">
    <div className="flex items-center space-x-4 mb-4">
      <Skeleton variant="avatar" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" className="w-1/3" />
        <Skeleton variant="text" className="w-1/4 h-3" />
      </div>
    </div>
    <div className="space-y-2 mt-4">
      <Skeleton variant="text" />
      <Skeleton variant="text" />
      <Skeleton variant="text" className="w-5/6" />
    </div>
  </div>
);

export default Skeleton;
