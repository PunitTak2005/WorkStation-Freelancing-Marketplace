import React from 'react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { Clock, Plus, CheckCircle2, ChevronRight } from 'lucide-react';

function CircularProgressRing({ progress = 87, size = 68, strokeWidth = 6, color = '#0A84FF' }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, progress)) / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90 overflow-visible">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-100 dark:text-slate-800"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <span className="absolute text-xs font-bold text-slate-900 dark:text-white font-mono">
        {progress}%
      </span>
    </div>
  );
}

export default function WorkHoursCard({
  workHoursData = [],
  totalWeeklyHours = 39,
  weeklyTarget = 45,
  onOpenLogsModal
}) {
  const progressPct = Math.round((totalWeeklyHours / weeklyTarget) * 100);
  const hoursRemaining = Math.max(0, weeklyTarget - totalWeeklyHours);

  // Find max daily hours for proportional bar widths
  const maxHours = Math.max(...workHoursData.map((d) => d.hours || 0), 8);

  return (
    <Card className="rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg transition-all duration-200 p-6 h-full flex flex-col justify-between overflow-hidden">
      <div>
        {/* 1. Header: 44x44 Icon, Title, and Action */}
        <div className="flex justify-between items-center gap-2 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-11 w-11 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#0A84FF] dark:text-[#2FA8FF] flex items-center justify-center flex-shrink-0 shadow-sm">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display leading-tight">
                Work Hours
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Weekly Sprint Goal
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onOpenLogsModal}
            className="text-xs flex items-center gap-1 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 shrink-0 h-8 px-2.5 rounded-xl whitespace-nowrap"
          >
            <span>Log Time</span>
            <Plus size={13} className="shrink-0" />
          </Button>
        </div>

        {/* 2. Progress Ring and Target Banner */}
        <div className="flex items-center gap-3.5 p-3.5 mb-5 rounded-2xl bg-gradient-to-r from-blue-50/60 via-slate-50/50 to-white dark:from-slate-800/60 dark:via-slate-800/30 dark:to-slate-900 border border-blue-100/60 dark:border-slate-800">
          <CircularProgressRing progress={progressPct} color="#0A84FF" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1.5">
              <span className="text-sm font-extrabold text-slate-900 dark:text-white whitespace-nowrap">
                {totalWeeklyHours}h <span className="font-medium text-slate-400 text-xs">/ {weeklyTarget}h</span>
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-[#0A84FF] dark:text-[#2FA8FF] shrink-0 whitespace-nowrap">
                {hoursRemaining > 0 ? `${hoursRemaining}h left` : 'Met!'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
              {progressPct}% of 45 hrs weekly goal logged.
            </p>
          </div>
        </div>

        {/* 3. Daily Horizontal Bar Tracker */}
        <div className="space-y-2.5">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-slate-400 pb-1">
            <span>Daily Breakdown</span>
            <span>Hours Logged</span>
          </div>

          {workHoursData.map((d) => {
            const barWidth = Math.min(100, Math.round((d.hours / maxHours) * 100));
            return (
              <div key={d.day} className="flex items-center gap-3 text-xs">
                <span className="w-8 font-semibold text-slate-700 dark:text-slate-300 shrink-0">
                  {d.day}
                </span>
                <div className="flex-1 h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#0A84FF] to-[#2FA8FF] transition-all duration-500"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
                <span className="w-10 text-right font-bold text-slate-900 dark:text-white font-mono shrink-0">
                  {d.hours}h
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Footer */}
      <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium truncate min-w-0">
          <CheckCircle2 size={13} className="shrink-0" />
          <span className="truncate">Verified with automated git commits</span>
        </span>
        <button
          onClick={onOpenLogsModal}
          className="text-[#0A84FF] font-semibold hover:underline flex items-center gap-0.5 shrink-0 ml-2"
        >
          <span>Detailed History</span>
          <ChevronRight size={12} />
        </button>
      </div>
    </Card>
  );
}
