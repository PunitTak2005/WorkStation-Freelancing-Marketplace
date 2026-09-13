import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';

const TextInput = forwardRef(function TextInput(
  {
    icon,
    rightIcon,
    error,
    helperText,
    disabled = false,
    className = '',
    type = 'text',
    ...props
  },
  ref
) {
  const renderIcon = (iconTarget) => {
    if (!iconTarget) return null;
    if (React.isValidElement(iconTarget)) {
      return iconTarget;
    }
    if (typeof iconTarget === 'function' || (typeof iconTarget === 'object' && iconTarget !== null)) {
      const IconComp = iconTarget;
      return <IconComp size={18} aria-hidden="true" />;
    }
    return null;
  };

  return (
    <div className="w-full">
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            {renderIcon(icon)}
          </div>
        )}

        <input
          ref={ref}
          type={type}
          disabled={disabled}
          className={cn(
            'w-full rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-slate-800/80 border text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all duration-200 outline-none',
            icon && 'pl-10',
            rightIcon && 'pr-10',
            error
              ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
              : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20',
            disabled && 'opacity-60 cursor-not-allowed bg-slate-100 dark:bg-slate-900',
            className
          )}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-3.5 flex items-center text-slate-400 dark:text-slate-500">
            {renderIcon(rightIcon)}
          </div>
        )}
      </div>

      {helperText && !error && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {helperText}
        </p>
      )}
    </div>
  );
});

export default TextInput;
