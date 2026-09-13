import React from 'react';
import { motion } from 'framer-motion';

export default function FormSection({
  title,
  subtitle,
  icon: Icon,
  stepNumber,
  children,
  badge,
  className = '',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`relative rounded-3xl overflow-hidden bg-white dark:bg-[#101826] border border-slate-200/90 dark:border-[#22324A] shadow-sm ${className}`}
    >
      {/* Subtle dot-grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] dark:opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(circle, #3B82F6 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />

      {/* Blue left accent bar */}
      <div className="absolute left-0 top-6 bottom-6 w-1 rounded-full bg-gradient-to-b from-[#3B82F6] via-[#60A5FA] to-[#3B82F6]/40" />

      <div className="relative p-6 sm:p-8">
        {/* Section Header */}
        <div className="flex items-start justify-between gap-4 pb-6 mb-6 border-b border-slate-100 dark:border-[#1E2C42]">
          <div className="flex items-start gap-3.5">
            {Icon && (
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#4F46E5] text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/25">
                <Icon size={20} />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                {stepNumber && (
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#3B82F6] dark:text-[#60A5FA] font-mono bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-900/40">
                    Step 0{stepNumber}
                  </span>
                )}
                <h2 className="text-xl font-black text-slate-900 dark:text-white font-display">
                  {title}
                </h2>
              </div>
              {subtitle && (
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {badge && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 text-[#3B82F6] dark:text-[#60A5FA] border border-blue-100 dark:border-blue-900/40 flex-shrink-0 shadow-sm">
              {badge}
            </span>
          )}
        </div>

        {/* Section Content */}
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
