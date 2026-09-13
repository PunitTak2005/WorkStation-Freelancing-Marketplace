import React from 'react';
import { cn } from '@/utils/cn';

const TextArea = React.forwardRef(({
  label,
  name,
  error,
  register,
  rows = 4,
  maxLength,
  className,
  ...rest
}, ref) => {
  const inputProps = register ? register(name) : {};

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-1">
          <label htmlFor={name} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
          </label>
        </div>
      )}
      <div className="relative">
        <textarea
          id={name}
          rows={rows}
          maxLength={maxLength}
          className={cn(
            'block w-full rounded-xl border-0 p-3.5 text-slate-900 shadow-xs ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-[#0A84FF] text-sm leading-6 bg-white dark:bg-[#101826] dark:text-white dark:ring-[#22324A] dark:focus:ring-[#0A84FF] transition-all duration-200 resize-y min-h-[96px]',
            error ? 'ring-red-500 focus:ring-red-500 dark:ring-red-500' : '',
            className
          )}
          {...inputProps}
          {...(register ? {} : { ref })}
          {...rest}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500 dark:text-red-400" id={`${name}-error`}>
          {error}
        </p>
      )}
    </div>
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;
