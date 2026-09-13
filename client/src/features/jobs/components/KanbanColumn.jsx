import React from 'react';
import { FolderPlus } from 'lucide-react';
import ProjectKanbanCard from './ProjectKanbanCard';

export default function KanbanColumn({
  column,
  jobs = [],
  onDeleteJob,
  onPostJob,
}) {
  return (
    <div
      className={`flex flex-col rounded-3xl p-3.5 sm:p-4 border transition-all min-w-[310px] sm:min-w-[320px] max-w-[340px] flex-shrink-0 snap-start backdrop-blur-md ${column.theme.columnBg} ${column.theme.columnGlow}`}
    >
      {/* Top Column Color Strip */}
      <div className={`h-1.5 w-full rounded-full mb-3.5 ${column.theme.strip}`} />

      {/* Sticky Column Header with Colored Pip, Title, and Count Badge */}
      <div className="sticky top-0 z-10 backdrop-blur-md pb-3 mb-3.5 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${column.theme.pip}`} />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate font-display">
            {column.label}
          </h3>
        </div>
        <span
          className={`px-2.5 py-0.5 text-xs font-mono font-bold rounded-full border shadow-2xs ${column.theme.badge}`}
        >
          {jobs.length}
        </span>
      </div>

      {/* Column Cards Scrollable Container */}
      <div className="flex-1 space-y-3.5 overflow-y-auto max-h-[calc(100vh-320px)] pr-1 scrollbar-thin">
        {jobs.length === 0 ? (
          /* Clean SaaS Column Empty State */
          <div className="py-10 px-4 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white/40 dark:bg-[#121B2B]/40 flex flex-col items-center justify-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#1A263A] text-slate-400 dark:text-slate-500 flex items-center justify-center shadow-2xs">
              <FolderPlus size={18} />
            </div>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
              {column.emptyTitle}
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-tight max-w-[200px]">
              {column.emptyDesc}
            </p>
            {(column.id === 'open' || column.id === 'draft') && onPostJob && (
              <button
                onClick={onPostJob}
                className="mt-2 px-3 py-1.5 text-[11px] font-bold text-[#0A84FF] dark:text-[#2FA8FF] bg-[#0A84FF]/10 hover:bg-[#0A84FF]/20 rounded-lg transition-colors cursor-pointer"
              >
                + Post Project
              </button>
            )}
          </div>
        ) : (
          jobs.map((job) => (
            <ProjectKanbanCard
              key={job._id}
              job={job}
              onDelete={onDeleteJob}
            />
          ))
        )}
      </div>
    </div>
  );
}
