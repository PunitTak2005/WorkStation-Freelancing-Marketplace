import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import BrandLogo from './BrandLogo';

const LoadingSpinner = ({ size = 'md', className, fullPage = false }) => {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  };

  const spinner = (
    <Loader2 className={cn('animate-spin text-[#0A84FF]', sizes[size], className)} />
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-white/90 dark:bg-[#080B12]/90 backdrop-blur-md">
        <BrandLogo size="lg" stacked />
        <div className="flex items-center gap-2 mt-2">
          {spinner}
          <span className="text-xs font-semibold text-slate-500 dark:text-[#A8C0D8]">Loading WorkStation...</span>
        </div>
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
