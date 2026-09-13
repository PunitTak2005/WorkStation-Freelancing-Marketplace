import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { formatDate } from '@/utils/formatters';

const DURATION_PRESETS = [
  { label: '1 Week', days: 7 },
  { label: '2 Weeks', days: 14 },
  { label: '1 Month', days: 30 },
  { label: 'Custom', days: null },
];

export default function TimelineSelector({
  deadline,
  onChange,
  onPresetSelect,
}) {
  // Get tomorrow's ISO date string (YYYY-MM-DD) for min date constraint
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split('T')[0];

  return (
    <div className="space-y-4">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
        Expected Delivery Timeline *
      </label>

      {/* Preset Duration Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {DURATION_PRESETS.map((preset, idx) => {
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onPresetSelect(preset.days)}
              className="py-2.5 px-3 rounded-xl text-xs font-bold bg-slate-50 dark:bg-[#162235] hover:bg-slate-100 dark:hover:bg-[#1E2E44] text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-[#22324A] hover:border-[#0A84FF]/40 transition-all cursor-pointer text-center"
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      {/* Date Picker Input */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
          Specific Project Deadline Date *
        </label>
        <div className="relative">
          <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
          <input
            type="date"
            name="deadline"
            value={deadline}
            min={minDateStr}
            onChange={onChange}
            className="w-full h-11 pl-10 pr-4 text-xs font-bold rounded-xl bg-white dark:bg-[#121B2B] border border-slate-200 dark:border-[#22324A] text-slate-900 dark:text-white focus:border-[#0A84FF] focus:ring-2 focus:ring-[#0A84FF]/20 outline-none transition-all cursor-pointer"
          />
        </div>
      </div>

      {/* Estimated Completion Date display */}
      {deadline && (
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40 p-2.5 rounded-xl">
          <Clock size={14} />
          <span>Expected final delivery target: <strong>{formatDate(deadline)}</strong></span>
        </div>
      )}
    </div>
  );
}
