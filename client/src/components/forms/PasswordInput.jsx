import React, { useState, forwardRef } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import TextInput from './TextInput';

const PasswordInput = forwardRef(function PasswordInput(
  { error, placeholder = '••••••••', ...props },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextInput
      ref={ref}
      type={showPassword ? 'text' : 'password'}
      placeholder={placeholder}
      icon={Lock}
      error={error}
      rightIcon={
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          tabIndex={-1}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none transition-colors"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      }
      {...props}
    />
  );
});

export default PasswordInput;
