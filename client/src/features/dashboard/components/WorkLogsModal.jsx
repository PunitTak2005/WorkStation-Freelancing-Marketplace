import React from 'react';
import Button from '@/components/common/Button';
import { Clock, CheckCircle2, DollarSign, X } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

export default function WorkLogsModal({ isOpen, onClose, timeLogs = [], totalWeeklyHours = 39 }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
              <Clock size={20} className="text-[#0A84FF]" />
              <span>Billable Work Logs ({totalWeeklyHours} hrs)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Verified daily work logs across active contracts (Mon – Sun)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable list of logs */}
        <div className="overflow-y-auto py-4 space-y-3 flex-1">
          {timeLogs.map((entry, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex justify-between items-start gap-4 hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/40 text-[#0A84FF]">
                    {entry.day}
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {entry.projectTitle}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {entry.description}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-sm font-extrabold text-slate-900 dark:text-white font-mono">
                  {entry.duration} hrs
                </span>
                <span className="block text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 font-mono">
                  {formatCurrency(entry.duration * 2200)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
          <span className="text-slate-500 font-medium">
            Total Billed: <strong className="text-slate-900 dark:text-white text-sm font-mono">{formatCurrency(totalWeeklyHours * 2200)}</strong>
          </span>
          <Button variant="primary" size="sm" onClick={onClose} className="rounded-xl px-5">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
