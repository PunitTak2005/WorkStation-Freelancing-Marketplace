import React from 'react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { formatCurrency } from '@/utils/formatters';
import { Calendar, MessageSquare, Clock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ContractCard({ contract, onLogTime }) {
  const isNearComplete = contract.progress >= 80;
  const isInReview = contract.progress >= 40 && contract.progress < 80;

  const statusBadge = isNearComplete ? (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 shrink-0 whitespace-nowrap">
      Complete
    </span>
  ) : isInReview ? (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40 shrink-0 whitespace-nowrap">
      In Review
    </span>
  ) : (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40 shrink-0 whitespace-nowrap">
      Active
    </span>
  );

  return (
    <Card className="rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg transition-all duration-200 p-6 h-full flex flex-col justify-between overflow-hidden">
      <div>
        {/* Top bar: Client Info & Status Badge */}
        <div className="flex justify-between items-center gap-2 mb-3.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              <img
                src={contract.client?.avatar || '/freelancers/rajesh-kumar.webp'}
                alt={contract.client?.name}
                className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
              />
              {contract.client?.isOnline && (
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
              )}
            </div>
            <div className="min-w-0">
              <h5 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm truncate">
                {contract.client?.name || 'Enterprise Client'}
              </h5>
              <p className="text-[11px] text-slate-400 truncate">
                {contract.client?.company || 'Technology Partner'}
              </p>
            </div>
          </div>

          <div>{statusBadge}</div>
        </div>

        {/* Contract Title: 2 lines max */}
        <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug mb-3 line-clamp-2 min-w-0">
          {contract.title}
        </h4>

        {/* Budget Row */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 mb-3.5">
          <span className="text-xs text-slate-500 dark:text-slate-400">Total Contract Value</span>
          <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white font-mono">
            {formatCurrency(contract.budget)}
          </span>
        </div>

        {/* Progress Bar: 8px height */}
        <div className="space-y-1.5 mb-3.5">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-slate-500">Milestone Progress</span>
            <span className="text-slate-900 dark:text-white font-mono">{contract.progress}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                contract.progress >= 80 ? 'bg-emerald-500' : contract.progress >= 50 ? 'bg-[#0A84FF]' : 'bg-amber-500'
              }`}
              style={{ width: `${contract.progress}%` }}
            />
          </div>
        </div>

        {/* Due Date Indicator */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-4 truncate min-w-0">
          <Calendar size={13} className="text-[#0A84FF] shrink-0" />
          <span className="truncate">
            Target Delivery: <strong className="text-slate-800 dark:text-slate-200">{contract.dueDate}</strong>
          </span>
        </div>
      </div>

      {/* Action Buttons: Open, Message, Log Time */}
      <div className="grid grid-cols-3 gap-2 pt-3.5 border-t border-slate-100 dark:border-slate-800 text-xs mt-auto">
        <Link
          to={contract.id ? `/dashboard/contracts/${contract.id}` : '/dashboard/contracts'}
          className="w-full"
        >
          <Button variant="outline" size="sm" className="w-full text-xs font-semibold flex items-center justify-center gap-1 whitespace-nowrap h-8 px-1">
            <span>Open</span>
            <ExternalLink size={11} className="shrink-0" />
          </Button>
        </Link>

        <Link to="/dashboard/messages" className="w-full">
          <Button variant="ghost" size="sm" className="w-full text-xs font-medium flex items-center justify-center gap-1 text-slate-600 dark:text-slate-300 whitespace-nowrap h-8 px-1">
            <MessageSquare size={11} className="shrink-0" />
            <span>Chat</span>
          </Button>
        </Link>

        <Button
          variant="primary"
          size="sm"
          onClick={() => onLogTime && onLogTime(contract)}
          className="w-full text-xs font-semibold flex items-center justify-center gap-1 shadow-sm whitespace-nowrap h-8 px-1"
        >
          <Clock size={11} className="shrink-0" />
          <span>Log</span>
        </Button>
      </div>
    </Card>
  );
}
