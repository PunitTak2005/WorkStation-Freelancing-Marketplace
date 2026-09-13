import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

const SelectField = forwardRef(function SelectField(
  {
    options = [],
    placeholder = 'Select an option',
    error,
    disabled = false,
    className = '',
    children,
    ...props
  },
  ref
) {
  return (
    <div className="relative">
      <select
        ref={ref}
        disabled={disabled}
        className={cn(
          'w-full appearance-none rounded-xl px-4 py-2.5 pr-10 text-sm bg-white dark:bg-slate-800/80 border text-slate-900 dark:text-white transition-all duration-200 outline-none cursor-pointer',
          error
            ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
            : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20',
          disabled && 'opacity-60 cursor-not-allowed bg-slate-100 dark:bg-slate-900',
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children
          ? children
          : options.map((opt) => {
              const val = typeof opt === 'object' ? opt.value : opt;
              const label = typeof opt === 'object' ? opt.label : opt;
              return (
                <option key={val} value={val} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                  {label}
                </option>
              );
            })}
      </select>

      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <ChevronDown size={18} />
      </div>
    </div>
  );
});

export default SelectField;
