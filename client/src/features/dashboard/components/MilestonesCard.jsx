import React from 'react';
import Card from '@/components/common/Card';
import { Calendar, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

export default function MilestonesCard({ upcomingMilestones = [] }) {
  const milestones = upcomingMilestones.length > 0 ? upcomingMilestones : [
    {
      title: 'Backend Authentication & Rate Limiting',
      projectTitle: 'API Integration & Pipeline Analytics',
      dueDate: '17 Sept',
      date: 'Sep 17, 2026',
      progress: 72,
      priority: 'High Priority',
      amount: 40000,
      statusLabel: 'In Progress',
      dueBadge: 'Due in 5 days'
    },
    {
      title: 'Charts & Real-time Analytics Reports',
      projectTitle: 'CRM Dashboard Modernization',
      dueDate: '20 Sept',
      date: 'Sep 20, 2026',
      progress: 46,
      priority: 'Medium Priority',
      amount: 30000,
      statusLabel: 'In Review',
      dueBadge: 'Due in 8 days'
    },
    {
      title: 'Performance Audit & SSR Caching',
      projectTitle: 'E-Commerce Performance Optimization',
      dueDate: '24 Sept',
      date: 'Sep 24, 2026',
      progress: 88,
      priority: 'High Priority',
      amount: 35000,
      statusLabel: 'Near Completion',
      dueBadge: 'Due in 12 days'
    },
    {
      title: 'Final Testing & Mobile Touch Handover',
      projectTitle: 'E-Commerce Performance Optimization',
      dueDate: '29 Sept',
      date: 'Sep 29, 2026',
      progress: 15,
      priority: 'Medium Priority',
      amount: 15000,
      statusLabel: 'Funded Escrow',
      dueBadge: 'Due in 17 days'
    }
  ];

  return (
    <Card className="rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg transition-all duration-200 p-6 h-full flex flex-col justify-between overflow-hidden">
      <div>
        {/* 1. Header: 44x44 Icon, Title, and Pending Badge */}
        <div className="flex justify-between items-center gap-2 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-11 w-11 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-500 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display leading-tight">
                Milestones
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Upcoming deliverable deadlines
              </p>
            </div>
          </div>

          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400 border border-orange-200 dark:border-orange-800/40 shrink-0 whitespace-nowrap">
            {milestones.length} Pending
          </span>
        </div>

        {/* 2. Kanban-style Timeline List */}
        <div className="space-y-3">
          {milestones.map((m, idx) => {
            const isHighPriority = m.priority?.toLowerCase().includes('high');
            return (
              <div
                key={m.id || idx}
                className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-colors overflow-hidden"
              >
                <div className="flex justify-between items-start gap-3 mb-2">
                  <div className="min-w-0 flex-1">
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs leading-snug truncate">
                      {m.title}
                    </h5>
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {m.projectTitle || m.project}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white font-mono block">
                      {formatCurrency(m.amount)}
                    </span>
                    <span
                      className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded mt-0.5 ${
                        isHighPriority
                          ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
                          : 'bg-blue-50 text-[#0A84FF] dark:bg-blue-950/40 dark:text-[#2FA8FF]'
                      }`}
                    >
                      {m.dueBadge || `Due ${m.dueDate}`}
                    </span>
                  </div>
                </div>

                {/* Progress bar: full width, 8px height */}
                <div className="space-y-1 mt-2">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">Sprint Completion</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{m.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200/60 dark:bg-slate-700/60 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        m.progress >= 80 ? 'bg-emerald-500' : m.progress >= 40 ? 'bg-[#0A84FF]' : 'bg-amber-500'
                      }`}
                      style={{ width: `${m.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium truncate min-w-0">
          <CheckCircle2 size={13} className="shrink-0" />
          <span className="truncate">Auto-releases upon client sign-off</span>
        </span>
        <span className="font-semibold text-slate-700 dark:text-slate-300 shrink-0 ml-2">Total: ₹1,20,000</span>
      </div>
    </Card>
  );
}
