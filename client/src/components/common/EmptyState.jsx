import React from 'react';
import { cn } from '@/utils/cn';
import Button from './Button';
import BrandLogo from './BrandLogo';

const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className
}) => {
  return (
    <div className={cn('relative overflow-hidden flex flex-col items-center justify-center p-10 text-center rounded-2xl bg-[#F8FBFF] dark:bg-[#101826] border border-dashed border-[#D6EFFF] dark:border-[#22324A] shadow-workstation-card dark:shadow-workstation-dark', className)}>
      {/* Subtle blueprint accent ring */}
      <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full border border-[#0A84FF]/10 pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-36 h-36 rounded-full border border-[#2FA8FF]/10 pointer-events-none" />

      {Icon ? (
        <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#002366]/10 to-[#0A84FF]/20 dark:from-[#0A84FF]/20 dark:to-[#2FA8FF]/20 border border-[#D6EFFF] dark:border-[#22324A] shadow-sm mb-4">
          <Icon className="h-8 w-8 text-[#0A84FF] dark:text-[#2FA8FF]" aria-hidden="true" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#0A84FF] rounded-full ring-2 ring-white dark:ring-[#101826] animate-pulse" />
        </div>
      ) : (
        <div className="relative mx-auto mb-4">
          <BrandLogo size="md" showText={false} />
        </div>
      )}

      <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-[#F5F9FF] font-display">{title}</h3>
      <p className="mt-1.5 text-sm text-slate-500 dark:text-[#A8C0D8] max-w-sm mx-auto leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <div className="mt-6">
          <Button onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
