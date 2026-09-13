import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';

/**
 * Reusable WorkStation Input component
 * Features:
 * - Left icon support (component reference e.g. icon={Phone} or JSX element e.g. icon={<Phone />})
 * - Right icon support (e.g. rightIcon={<button>...eye...</button>} or component)
 * - Explicitly destructures helperText so it NEVER leaks to native DOM <input>
 * - Form validation error and success states
 * - React Hook Form `register` support + standard forwardRef
 * - Full Dark/Light mode theme styling with focus glow
 * - Accessible IDs, aria-invalid, aria-describedby
 */
const Input = forwardRef(function Input(
  {
    label,
    name,
    id,
    type = 'text',
    error,
    success,
    icon,
    rightIcon,
    helperText,
    register,
    className,
    containerClassName,
    labelClassName,
    disabled = false,
    required = false,
    ...inputProps
  },
  ref
) {
  const inputId = id || name || (label ? `input-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}` : undefined);
  const registeredProps = register && name ? register(name) : {};

  // Safely renders an icon whether passed as a Component (icon={Phone}) or JSX Element (icon={<Phone />})
  const renderIcon = (iconTarget, isRight = false) => {
    if (!iconTarget) return null;

    if (React.isValidElement(iconTarget)) {
      return (
        <span
          className={cn(
            'inline-flex items-center justify-center flex-shrink-0',
            isRight ? '' : 'pointer-events-none',
            error
              ? 'text-rose-500 dark:text-rose-400'
              : success
              ? 'text-emerald-500 dark:text-emerald-400'
              : 'text-slate-400 dark:text-[#A8C0D8]'
          )}
        >
          {iconTarget}
        </span>
      );
    }

    if (typeof iconTarget === 'function' || (typeof iconTarget === 'object' && iconTarget !== null)) {
      const IconComponent = iconTarget;
      return (
        <IconComponent
          className={cn(
            'h-4.5 w-4.5 flex-shrink-0 transition-colors pointer-events-none',
            error
              ? 'text-rose-500 dark:text-rose-400'
              : success
              ? 'text-emerald-500 dark:text-emerald-400'
              : 'text-slate-400 dark:text-[#A8C0D8] group-focus-within:text-[#0A84FF]'
          )}
          aria-hidden="true"
        />
      );
    }

    return null;
  };

  const hasLeftIcon = Boolean(icon);
  const hasRightIcon = Boolean(rightIcon);

  return (
    <div className={cn('w-full', containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5',
            labelClassName
          )}
        >
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative group flex items-center">
        {hasLeftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
            {renderIcon(icon, false)}
          </div>
        )}

        <input
          id={inputId}
          name={name}
          type={type}
          disabled={disabled}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error && inputId
              ? `${inputId}-error`
              : helperText && inputId
              ? `${inputId}-helper`
              : undefined
          }
          className={cn(
            'block w-full min-h-[46px] rounded-xl px-3.5 py-2.5 text-sm transition-all duration-200 outline-none shadow-xs',
            'bg-white text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400',
            'dark:bg-[#101826] dark:text-[#F5F9FF] dark:ring-[#22324A] dark:placeholder:text-[#A8C0D8]/60',
            'focus:ring-2 focus:ring-inset focus:ring-[#0A84FF] dark:focus:ring-[#0A84FF]',
            hasLeftIcon ? 'pl-10' : 'pl-3.5',
            hasRightIcon ? 'pr-10' : 'pr-3.5',
            error
              ? 'ring-rose-500 focus:ring-rose-500 dark:ring-rose-500 text-rose-900 dark:text-rose-100'
              : success
              ? 'ring-emerald-500 focus:ring-emerald-500 dark:ring-emerald-500'
              : '',
            disabled ? 'opacity-60 cursor-not-allowed bg-slate-100 dark:bg-slate-900/60' : '',
            className
          )}
          {...registeredProps}
          {...(register ? {} : { ref })}
          {...inputProps}
        />

        {hasRightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center z-10">
            {renderIcon(rightIcon, true)}
          </div>
        )}
      </div>

      {error ? (
        <p
          className="mt-1.5 text-xs font-medium text-rose-500 dark:text-rose-400 flex items-center gap-1"
          id={inputId ? `${inputId}-error` : undefined}
        >
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p
          className="mt-1.5 text-xs text-slate-500 dark:text-slate-400"
          id={inputId ? `${inputId}-helper` : undefined}
        >
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
