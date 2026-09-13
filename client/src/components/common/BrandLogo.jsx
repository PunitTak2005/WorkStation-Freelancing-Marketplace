import React from 'react';
import { cn } from '@/utils/cn';

/**
 * Reusable WorkStation BrandLogo component
 * Features a dedicated, pure white rounded container behind the logo everywhere.
 * Ensures the logo remains crisp, punchy, and readable across both Light and Dark mode.
 * Supports sizes: 'xs', 'sm', 'md', 'lg', 'xl', '2xl', or custom class overrides
 */
const BrandLogo = ({
  size = 'md',
  showText = true,
  stacked = false,
  className,
  containerClassName,
  imgClassName,
  textClassName,
  subtextClassName,
}) => {
  const sizeConfig = {
    xs: {
      container: 'rounded-lg p-1 shadow-sm',
      img: 'h-5 sm:h-6',
      text: 'text-sm font-bold',
      subtext: 'text-[8px]',
      gap: 'gap-2',
    },
    sm: {
      container: 'rounded-xl p-1.5 sm:p-2 shadow-md',
      img: 'h-6 sm:h-7 md:h-8',
      text: 'text-base sm:text-lg font-black',
      subtext: 'text-[9px]',
      gap: 'gap-2.5',
    },
    md: {
      container: 'rounded-2xl p-2 sm:p-2.5 shadow-lg',
      img: 'h-8 sm:h-9 md:h-10',
      text: 'text-xl sm:text-2xl font-black',
      subtext: 'text-[9px] sm:text-[10px]',
      gap: 'gap-3',
    },
    lg: {
      container: 'rounded-2xl p-2.5 sm:p-3 shadow-lg',
      img: 'h-10 sm:h-11 md:h-12',
      text: 'text-2xl sm:text-3xl font-black',
      subtext: 'text-[10px] sm:text-[11px]',
      gap: 'gap-3.5',
    },
    xl: {
      container: 'rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-xl',
      img: 'h-14 sm:h-16 md:h-20',
      text: 'text-2xl sm:text-3xl md:text-4xl font-black',
      subtext: 'text-[11px] sm:text-xs',
      gap: 'gap-4',
    },
    '2xl': {
      container: 'rounded-3xl p-3.5 sm:p-5 shadow-2xl',
      img: 'h-18 sm:h-20 md:h-24',
      text: 'text-3xl sm:text-4xl md:text-5xl font-black',
      subtext: 'text-xs sm:text-sm',
      gap: 'gap-5',
    },
  };

  const currentSize = sizeConfig[size] || sizeConfig.md;

  return (
    <div
      className={cn(
        'flex items-center min-w-0 select-none group',
        stacked ? 'flex-col justify-center text-center' : '',
        currentSize.gap,
        className
      )}
    >
      {/* Branded White Container Behind Logo (Always Pure White in Light & Dark Mode) */}
      <div
        className={cn(
          'relative flex-shrink-0 flex items-center justify-center bg-white ring-1 ring-slate-200/90 dark:ring-slate-700/80 transition-all duration-200 ease-out group-hover:-translate-y-0.5 group-hover:shadow-xl',
          currentSize.container,
          containerClassName
        )}
      >
        <img
          src="/logo/workstation-logo.png"
          alt="WorkStation Logo"
          loading="lazy"
          className={cn(
            'w-auto max-w-full object-contain pointer-events-none select-none',
            currentSize.img,
            imgClassName
          )}
          onError={(e) => {
            if (e.target.src.indexOf('/logo/workstation-logo.png') !== -1) {
              e.target.src = '/logo.png';
            }
          }}
        />
      </div>

      {showText && (
        <div className={cn('flex flex-col min-w-0', stacked ? 'items-center' : '')}>
          <span
            className={cn(
              'tracking-tight text-[#002366] dark:text-white font-display leading-none truncate',
              currentSize.text,
              textClassName
            )}
          >
            Work<span className="text-[#0A84FF]">Station</span>
          </span>
          <span
            className={cn(
              'font-bold text-[#0A84FF] dark:text-[#2FA8FF] tracking-widest uppercase mt-1 leading-none',
              currentSize.subtext,
              subtextClassName
            )}
          >
            Find. Hire. Build.
          </span>
        </div>
      )}
    </div>
  );
};

export default BrandLogo;
