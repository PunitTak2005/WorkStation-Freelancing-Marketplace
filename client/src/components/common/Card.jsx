import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

const Card = ({ children, className, hover = false, glass = false, ...rest }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -5 } : {}}
      className={cn(
        'rounded-2xl p-6 transition-all duration-300',
        glass
          ? 'bg-white/90 dark:bg-[#101826]/80 backdrop-blur-xl border border-slate-200/90 dark:border-[#22324A] shadow-sm dark:shadow-workstation-dark'
          : 'bg-white dark:bg-[#101826] border border-slate-200 dark:border-[#22324A] shadow-sm dark:shadow-workstation-dark',
        hover ? 'hover:border-[#0A84FF]/60 dark:hover:border-[#0A84FF]/70 hover:shadow-lg hover:shadow-[#0A84FF]/10' : '',
        className
      )}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export default Card;
