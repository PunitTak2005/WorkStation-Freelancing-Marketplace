import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';

const TextAreaField = forwardRef(function TextAreaField(
  {
    error,
    maxLength,
    currentLength,
    disabled = false,
    className = '',
    rows = 4,
    ...props
  },
  ref
) {
  return (
    <div className="relative">
      <textarea
        ref={ref}
        rows={rows}
        disabled={disabled}
        className={cn(
          'w-full rounded-xl p-4 text-sm bg-white dark:bg-slate-800/80 border text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all duration-200 outline-none resize-y',
          error
            ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
            : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20',
          disabled && 'opacity-60 cursor-not-allowed bg-slate-100 dark:bg-slate-900',
          className
        )}
        {...props}
      />

      {maxLength && typeof currentLength === 'number' && (
        <div className="text-right text-[11px] text-slate-400 mt-1 font-mono">
          <span className={currentLength > maxLength ? 'text-rose-500 font-bold' : ''}>
            {currentLength}
          </span>
          /{maxLength}
        </div>
      )}
    </div>
  );
});

export default TextAreaField;
