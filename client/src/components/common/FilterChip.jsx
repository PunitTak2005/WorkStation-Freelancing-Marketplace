import React from 'react';
import { X } from 'lucide-react';

export default function FilterChip({ label, value, onRemove, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition-all hover:bg-indigo-100 dark:hover:bg-indigo-900/60 ${className}`}
    >
      <span className="text-slate-500 dark:text-slate-400 font-normal">{label}:</span>
      <span className="font-semibold">{value}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove filter for ${label}`}
          className="p-0.5 ml-0.5 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-800 text-indigo-500 dark:text-indigo-300 transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <X size={12} />
        </button>
      )}
    </span>
  );
}
