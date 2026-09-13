import React from 'react';
import { cn } from '@/utils/cn';
import { ChevronDown } from 'lucide-react';

const Select = React.forwardRef(({
  label,
  name,
  options = [],
  error,
  register,
  className,
  ...rest
}, ref) => {
  const inputProps = register ? register(name) : {};

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={name}
          className={cn(
            'block w-full appearance-none rounded-xl border-0 py-2.5 pl-3.5 pr-10 text-slate-900 shadow-xs ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-[#0A84FF] bg-white sm:text-sm sm:leading-6 dark:bg-[#101826] dark:text-white dark:ring-[#22324A] dark:focus:ring-[#0A84FF] transition-all duration-200',
            error ? 'ring-red-500 focus:ring-red-500 dark:ring-red-500' : '',
            className
          )}
          {...inputProps}
          {...(register ? {} : { ref })}
          {...rest}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden="true" />
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500 dark:text-red-400" id={`${name}-error`}>
          {error}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
