import React, { useState } from 'react';
import { cn } from '@/utils/cn';

const Avatar = ({ src, name, size = 'md', online = false, ring = true, className }) => {
  const [hasError, setHasError] = useState(false);

  // Exact sizes adhering to WorkStation specifications:
  // xs: 24px (h-6 w-6), sm: 32px (h-8 w-8), navbar/default md: 40px (h-10 w-10),
  // dashboard: 48px (h-12 w-12), lg/freelancer: 72px (h-[72px] w-[72px]),
  // home card / xl: 96px (h-20 w-20 sm:h-24 sm:w-24), profile / 2xl: 140px (h-28 w-28 sm:h-[140px] sm:w-[140px])
  const sizeMap = {
    xs: 'h-6 w-6 text-[10px]',
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    dashboard: 'h-12 w-12 text-sm',
    lg: 'h-[72px] w-[72px] text-lg',
    xl: 'h-20 w-20 sm:h-24 sm:w-24 text-xl',
    '2xl': 'h-28 w-28 sm:h-[140px] sm:w-[140px] text-2xl',
  };

  const getInitials = (userName) => {
    if (!userName) return 'WS';
    const parts = userName.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const ringPadding = {
    xs: 'p-[1.5px]',
    sm: 'p-[2px]',
    md: 'p-[2px]',
    dashboard: 'p-[2.5px]',
    lg: 'p-[2.5px]',
    xl: 'p-[3px]',
    '2xl': 'p-[3.5px]',
  };

  const statusDotSize = {
    xs: 'h-1.5 w-1.5',
    sm: 'h-2.5 w-2.5',
    md: 'h-3 w-3',
    dashboard: 'h-3.5 w-3.5',
    lg: 'h-4 w-4',
    xl: 'h-5 w-5',
    '2xl': 'h-6 w-6',
  };

  const imageSrc = name === 'Mayank Joshi'
    ? '/freelancers/mayank-joshi.png'
    : name === 'Abhishek Nayak'
    ? '/freelancers/abhishek-nayak.png'
    : name === 'Sakshi Rawat'
    ? '/freelancers/sakshi-rawat.png'
    : name === 'Nisha Banerjee'
    ? '/freelancers/nisha-banerjee.png'
    : (src?.url || (typeof src === 'string' ? src : null));

  return (
    <div className={cn('relative inline-flex items-center justify-center flex-shrink-0', sizeMap[size] || sizeMap.md, className)}>
      {/* Outer WorkStation Brand Gradient Circular Ring */}
      <div
        className={cn(
          'w-full h-full rounded-full transition-transform duration-300',
          ring
            ? cn(
                'bg-gradient-to-br from-[#002366] via-[#0A84FF] to-[#2FA8FF] shadow-sm shadow-[#0A84FF]/20',
                ringPadding[size] || ringPadding.md
              )
            : 'p-0'
        )}
      >
        {imageSrc && !hasError ? (
          <img
            src={imageSrc}
            alt={name || 'WorkStation Member'}
            loading="lazy"
            onError={() => setHasError(true)}
            className="h-full w-full rounded-full object-cover object-center bg-white dark:bg-[#101826]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-[#002366] to-[#0A84FF] text-white font-bold tracking-tight shadow-inner select-none">
            {getInitials(name)}
          </div>
        )}
      </div>

      {online && (
        <span
          className={cn(
            'absolute bottom-0 right-0 block rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#101826] shadow-sm',
            statusDotSize[size] || statusDotSize.md
          )}
          title="Online & Available"
        />
      )}
    </div>
  );
};

export default Avatar;
