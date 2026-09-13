import React from 'react';
import { X, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SkillChip({
  skill,
  onRemove,
  onAdd,
  isSuggested = false,
}) {
  if (isSuggested) {
    return (
      <button
        type="button"
        onClick={() => onAdd(skill)}
        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-[#162235] text-slate-700 dark:text-slate-300 hover:bg-[#0A84FF]/10 hover:text-[#0A84FF] dark:hover:text-[#2FA8FF] border border-slate-200/80 dark:border-[#22324A] hover:border-[#0A84FF]/40 transition-all cursor-pointer group"
      >
        <Plus size={12} className="text-slate-400 group-hover:text-[#0A84FF] dark:group-hover:text-[#2FA8FF] transition-colors" />
        <span>{skill}</span>
      </button>
    );
  }

  return (
    <motion.span
      layout
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.15 }}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 dark:bg-blue-950/50 text-[#0A84FF] dark:text-[#2FA8FF] border border-blue-200/80 dark:border-blue-900/60 shadow-2xs group"
    >
      <span>{skill}</span>
      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(skill)}
          className="p-0.5 rounded-md hover:bg-[#0A84FF]/20 text-[#0A84FF] dark:text-[#2FA8FF] transition-colors cursor-pointer"
          title={`Remove ${skill}`}
        >
          <X size={12} strokeWidth={2.5} />
        </button>
      )}
    </motion.span>
  );
}
