import React from 'react';
import { cn } from '@/utils/cn';

const Badge = ({ children, variant = 'indigo', size = 'md', dot = false, className }) => {
  const variants = {
    indigo: 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/50 dark:text-[#2FA8FF] dark:border-blue-800/50',
    info: 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/50 dark:text-[#2FA8FF] dark:border-blue-800/50',
    emerald: 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800/50',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800/50',
    orange: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800/50',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800/50',
    red: 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800/50',
    error: 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800/50',
    gray: 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  };

  const dotColors = {
    indigo: 'bg-indigo-500',
    emerald: 'bg-emerald-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
    gray: 'bg-slate-500',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {dot && (
        <span
          className={cn('mr-1.5 h-2 w-2 rounded-full', dotColors[variant])}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
