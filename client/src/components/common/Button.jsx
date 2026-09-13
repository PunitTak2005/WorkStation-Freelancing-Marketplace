import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  isLoading = false,
  icon: Icon,
  iconPosition = 'left',
  disabled,
  className,
  type = 'button',
  ...rest
}, ref) => {
  const isSpinning = loading || isLoading;
  const baseStyles = 'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none whitespace-nowrap shrink-0 max-w-full';
  
  const variants = {
    primary: 'bg-gradient-to-r from-[#002366] via-[#0A84FF] to-[#2FA8FF] dark:from-[#0A84FF] dark:to-[#2FA8FF] text-white hover:shadow-lg hover:shadow-[#0A84FF]/30 focus:ring-[#0A84FF] border border-transparent',
    secondary: 'bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:bg-[#162235] dark:text-[#F5F9FF] dark:border-[#22324A] dark:hover:bg-[#22324A] focus:ring-[#0A84FF] shadow-2xs',
    outline: 'border-2 border-[#0A84FF] text-[#0A84FF] hover:bg-[#0A84FF] hover:text-white dark:border-[#2FA8FF] dark:text-[#2FA8FF] dark:hover:bg-[#2FA8FF] dark:hover:text-[#080B12] focus:ring-[#0A84FF]',
    ghost: 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-[#A8C0D8] dark:hover:bg-[#162235] dark:hover:text-[#F5F9FF] focus:ring-[#0A84FF]',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500 shadow-sm',
  };

  const sizes = {
    sm: 'h-8 px-3 text-sm gap-1.5',
    md: 'h-10 px-4 text-sm gap-2',
    lg: 'h-12 px-6 text-base gap-2.5',
  };

  const isInteractive = !disabled && !isSpinning;

  const renderIcon = () => {
    if (isSpinning) {
      return <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />;
    }
    if (!Icon) return null;

    // If passed as a JSX Element: icon={<RefreshCw size={16} />}
    if (React.isValidElement(Icon)) {
      return <span className="inline-flex items-center flex-shrink-0">{Icon}</span>;
    }

    // If passed as a Component: icon={RefreshCw} or icon={House}
    if (typeof Icon === 'function' || (typeof Icon === 'object' && Icon !== null)) {
      const IconComponent = Icon;
      return <IconComponent className="h-4 w-4 flex-shrink-0" />;
    }

    return null;
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled || isSpinning}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      whileHover={isInteractive ? { scale: 1.02, y: -1 } : {}}
      whileTap={isInteractive ? { scale: 0.98 } : {}}
      {...rest}
    >
      {iconPosition !== 'right' && renderIcon()}
      {children && <span>{children}</span>}
      {iconPosition === 'right' && renderIcon()}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;
