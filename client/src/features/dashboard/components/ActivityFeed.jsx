import React from 'react';
import Card from '@/components/common/Card';
import { Activity, DollarSign, MessageSquare, FileText, CheckCircle2, Clock } from 'lucide-react';

export default function ActivityFeed({ activities = [] }) {
  const defaultActivities = [
    {
      title: 'Payment Released',
      description: '₹22,000 released from Escrow for CRM Charts Engine',
      time: 'Today',
      amount: '+₹22,000',
      type: 'payment',
      icon: DollarSign,
      color: 'emerald'
    },
    {
      title: 'New Client Message',
      description: 'Rajesh Sharma: "Great work on the dashboard updates."',
      time: '1h ago',
      type: 'message',
      icon: MessageSquare,
      color: 'blue'
    },
    {
      title: 'Proposal Accepted',
      description: 'Proposal accepted for API Integration & Pipeline Analytics',
      time: 'Yesterday',
      type: 'proposal',
      icon: FileText,
      color: 'purple'
    },
    {
      title: 'Milestone Approved',
      description: 'Backend Authentication & Security Architecture signed off',
      time: '2d ago',
      type: 'milestone',
      icon: CheckCircle2,
      color: 'blue'
    },
    {
      title: 'Time Logged',
      description: '4.0 hours logged on E-Commerce Performance Optimization',
      time: '3d ago',
      type: 'time',
      icon: Clock,
      color: 'amber'
    }
  ];

  const items = activities.length > 0 ? activities : defaultActivities;

  return (
    <Card className="rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg transition-all duration-200 p-6 h-full flex flex-col justify-between overflow-hidden">
      <div>
        {/* 1. Header: 44x44 Icon, Title, and Live Stream Badge */}
        <div className="flex justify-between items-start gap-3 mb-5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-11 w-11 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Activity className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-display truncate">
                Recent Activity Feed
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                Live audit timeline of contracts, messages, and settlements
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/40 shrink-0">
            Live Stream
          </span>
        </div>

        {/* 2. Timeline with Clean Node Alignment */}
        <div className="space-y-4">
          {items.map((item, idx) => {
            const Icon = item.icon || (item.type === 'payment' ? DollarSign : item.type === 'message' ? MessageSquare : FileText);
            const colorClasses =
              item.color === 'emerald'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40'
                : item.color === 'purple'
                ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/40'
                : item.color === 'amber'
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40'
                : 'bg-blue-50 dark:bg-blue-950/40 text-[#0A84FF] dark:text-[#2FA8FF] border border-blue-200 dark:border-blue-800/40';

            return (
              <div key={idx} className="flex items-start gap-3 min-w-0 group">
                {/* Node icon: 36x36 container */}
                <div className={`w-9 h-9 rounded-xl ${colorClasses} flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform`}>
                  <Icon size={16} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline gap-2">
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs truncate">
                      {item.title}
                    </h5>
                    <span className="text-[10px] text-slate-400 font-medium shrink-0">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                    {item.description}
                  </p>
                  {item.amount && (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono inline-block mt-0.5">
                      {item.amount}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Footer */}
      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-400">
        <span className="truncate min-w-0">Verified cryptographic audit log</span>
        <span className="text-emerald-500 font-medium shrink-0 ml-2">Synced</span>
      </div>
    </Card>
  );
}
