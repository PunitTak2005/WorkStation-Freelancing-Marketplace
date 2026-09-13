import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/utils/cn';

export default function FormField({
  label,
  required = false,
  error,
  success,
  helperText,
  className = '',
  children,
  id,
}) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label
          htmlFor={id}
          className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300"
        >
          <span>
            {label}
            {required && <span className="text-rose-500 ml-1 font-bold">*</span>}
          </span>
          {success && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-500">
              <CheckCircle2 size={12} /> Valid
            </span>
          )}
        </label>
      )}

      <div className="relative">{children}</div>

      {error ? (
        <p className="flex items-center gap-1 text-xs text-rose-500 dark:text-rose-400 mt-1 font-medium animate-fadeIn">
          <AlertCircle size={13} className="flex-shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{helperText}</p>
      ) : null}
    </div>
  );
}
