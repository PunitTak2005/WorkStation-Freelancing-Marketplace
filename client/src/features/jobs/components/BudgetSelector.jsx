import React, { useMemo } from 'react';
import { IndianRupee, Clock, Briefcase, ShieldCheck, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

const PRESETS = [
  { label: '₹5k – ₹10k', min: 5000, max: 10000 },
  { label: '₹15k – ₹25k', min: 15000, max: 25000 },
  { label: '₹30k – ₹50k', min: 30000, max: 50000 },
  { label: '₹50k – ₹80k', min: 50000, max: 80000 },
  { label: '₹1L+', min: 100000, max: 200000 },
];

const MAX_DISPLAY = 200000;

export default function BudgetSelector({
  budgetType,
  minBudget,
  maxBudget,
  onChange,
  onPresetSelect,
}) {
  const minVal = Number(minBudget) || 0;
  const maxVal = Number(maxBudget) || 0;

  // Percentages for the visual range bar
  const leftPct = useMemo(() => Math.min((minVal / MAX_DISPLAY) * 100, 100), [minVal]);
  const rightPct = useMemo(() => Math.min((maxVal / MAX_DISPLAY) * 100, 100), [maxVal]);

  return (
    <div className="space-y-6">
      {/* 1. Fixed vs Hourly Segmented Toggle */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
          Pricing Structure *
        </label>
        <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-slate-100/80 dark:bg-[#162235] border border-slate-200/80 dark:border-[#22324A]">
          <button
            type="button"
            onClick={() => onChange({ target: { name: 'budgetType', value: 'fixed' } })}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
              budgetType === 'fixed'
                ? 'bg-gradient-to-r from-[#3B82F6] to-[#4F46E5] text-white shadow-md shadow-blue-500/30'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
            }`}
          >
            <Briefcase size={15} />
            <span>Fixed Price</span>
          </button>

          <button
            type="button"
            onClick={() => onChange({ target: { name: 'budgetType', value: 'hourly' } })}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
              budgetType === 'hourly'
                ? 'bg-gradient-to-r from-[#3B82F6] to-[#4F46E5] text-white shadow-md shadow-blue-500/30'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
            }`}
          >
            <Clock size={15} />
            <span>Hourly Rate</span>
          </button>
        </div>
      </div>

      {/* 2. Min and Max Budget Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Minimum {budgetType === 'fixed' ? 'Budget' : 'Rate'} (₹) *
          </label>
          <div className="relative group">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-bold text-sm pointer-events-none">₹</span>
            <input
              type="number"
              name="minBudget"
              value={minBudget}
              onChange={onChange}
              placeholder="e.g. 15000"
              min="1"
              className="w-full h-12 pl-8 pr-4 text-sm font-bold font-mono rounded-xl bg-white dark:bg-[#121B2B] border border-slate-200 dark:border-[#22324A] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Maximum {budgetType === 'fixed' ? 'Budget' : 'Rate'} (₹) *
          </label>
          <div className="relative group">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-bold text-sm pointer-events-none">₹</span>
            <input
              type="number"
              name="maxBudget"
              value={maxBudget}
              onChange={onChange}
              placeholder="e.g. 30000"
              min="1"
              className="w-full h-12 pl-8 pr-4 text-sm font-bold font-mono rounded-xl bg-white dark:bg-[#121B2B] border border-slate-200 dark:border-[#22324A] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* 3. Visual Budget Range Bar */}
      {(minVal > 0 || maxVal > 0) && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
            <span className="flex items-center gap-1">
              <TrendingUp size={12} className="text-[#3B82F6]" />
              Budget Range Visualization
            </span>
            <span className="text-[#3B82F6] dark:text-[#60A5FA] font-mono">
              {formatCurrency(minVal)} – {formatCurrency(maxVal)}
              {budgetType === 'hourly' ? '/hr' : ''}
            </span>
          </div>
          <div className="relative h-2.5 rounded-full bg-slate-100 dark:bg-[#1A263A] overflow-hidden">
            {/* Track fill */}
            <div
              className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] transition-all duration-500"
              style={{ left: `${leftPct}%`, right: `${100 - rightPct}%` }}
            />
            {/* Min knob */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#3B82F6] shadow-md transition-all duration-500"
              style={{ left: `calc(${leftPct}% - 7px)` }}
            />
            {/* Max knob */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#60A5FA] shadow-md transition-all duration-500"
              style={{ left: `calc(${rightPct}% - 7px)` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>₹0</span>
            <span>₹50k</span>
            <span>₹1L</span>
            <span>₹2L+</span>
          </div>
        </div>
      )}

      {/* 4. Quick Budget Preset Chips */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
          Quick Budget Presets
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset, idx) => {
            const isSelected = Number(minBudget) === preset.min && Number(maxBudget) === preset.max;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => onPresetSelect(preset.min, preset.max)}
                className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer overflow-hidden group ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#3B82F6] to-[#4F46E5] text-white shadow-md shadow-blue-500/30 scale-105'
                    : 'bg-slate-100/90 dark:bg-[#162235] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#1E2E44] border border-slate-200/80 dark:border-[#22324A] hover:border-[#3B82F6]/40 hover:text-[#3B82F6] dark:hover:text-[#60A5FA]'
                }`}
              >
                {/* Shine effect on hover */}
                {!isSelected && (
                  <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none" />
                )}
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Escrow Guarantee Note */}
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-blue-50/80 to-indigo-50/60 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-100 dark:border-blue-900/40 text-slate-600 dark:text-[#A8C0D8] text-xs">
        <div className="w-8 h-8 rounded-xl bg-[#3B82F6]/10 text-[#3B82F6] flex items-center justify-center flex-shrink-0">
          <ShieldCheck size={16} />
        </div>
        <span>
          <strong className="text-slate-800 dark:text-white">WorkStation Escrow Protection:</strong>{' '}
          Funds are locked securely and only released when deliverables meet your satisfaction.
        </span>
      </div>
    </div>
  );
}
