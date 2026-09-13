import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import Card from '@/components/common/Card';
import ChartTooltip from '@/components/common/ChartTooltip';
import { formatCurrency } from '@/utils/formatters';
import { TrendingUp, ShieldCheck, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

export default function EarningsChart({
  weeklyData = [],
  monthlyData = [],
  totalEarnings = 1860000
}) {
  const [view, setView] = useState('weekly'); // 'weekly' | 'monthly'

  const activeData = view === 'weekly' ? weeklyData : monthlyData;

  // Calculate highest, lowest, average payout
  const amounts = activeData.map((d) => d.amount || d.earnings || 0);
  const highest = amounts.length > 0 ? Math.max(...amounts) : 22000;
  const lowest = amounts.length > 0 ? Math.min(...amounts) : 8000;
  const average = amounts.length > 0 ? Math.round(amounts.reduce((a, b) => a + b, 0) / amounts.length) : 14000;

  return (
    <Card className="rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg transition-all duration-200 p-6 h-full flex flex-col justify-between overflow-hidden">
      <div>
        {/* Header with Icon, Title, Badge and Toggle */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-11 w-11 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#0A84FF] dark:text-[#2FA8FF] flex items-center justify-center flex-shrink-0 shadow-sm">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display leading-tight">
                  {view === 'weekly' ? 'Weekly Earnings' : 'Earnings History'}
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 shrink-0 whitespace-nowrap">
                  <ShieldCheck size={12} />
                  Escrow Protected
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {view === 'weekly'
                  ? 'September milestone escrow releases'
                  : 'Apr – Sep revenue trajectory totaling ₹18,60,000'}
              </p>
            </div>
          </div>

          {/* Toggle pill */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-medium self-end sm:self-auto shrink-0">
            <button
              onClick={() => setView('weekly')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                view === 'weekly'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Weekly (Sep)
            </button>
            <button
              onClick={() => setView('monthly')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                view === 'monthly'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Monthly (6M)
            </button>
          </div>
        </div>

        {/* Quick Analytics Summary Bar (Highest, Lowest, Average) */}
        <div className="grid grid-cols-3 gap-3 p-3.5 mb-5 bg-slate-50/70 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1 truncate">
              <ArrowUpRight size={13} className="text-emerald-500 shrink-0" />
              Highest Payout
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5 truncate font-mono">
              {formatCurrency(highest)}
            </span>
          </div>

          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1 truncate">
              <Activity size={13} className="text-blue-500 shrink-0" />
              Average Payout
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5 truncate font-mono">
              {formatCurrency(average)}
            </span>
          </div>

          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1 truncate">
              <ArrowDownRight size={13} className="text-slate-400 shrink-0" />
              Lowest Payout
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5 truncate font-mono">
              {formatCurrency(lowest)}
            </span>
          </div>
        </div>

        {/* Chart Visualization with Generous Margins */}
        <div className="h-72 sm:h-80 w-full overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activeData} margin={{ top: 12, right: 15, left: -10, bottom: 4 }}>
              <defs>
                <linearGradient id="premiumEarningsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0A84FF" stopOpacity={0.38} />
                  <stop offset="95%" stopColor="#0A84FF" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#CBD5E1" opacity={0.25} />
              <XAxis
                dataKey={view === 'weekly' ? 'date' : 'name'}
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                tick={{ fill: '#64748B', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                width={50}
                tickMargin={6}
                tick={{ fill: '#64748B', fontSize: 12 }}
                tickFormatter={(val) => `₹${val >= 100000 ? `${(val / 100000).toFixed(1)}L` : `${val / 1000}k`}`}
              />
              <Tooltip
                content={
                  <ChartTooltip
                    formatter={(val, name, item) => [
                      formatCurrency(val),
                      view === 'weekly' ? item?.payload?.project || 'Milestone Escrow Payout' : 'Total Monthly Payout',
                    ]}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="amount"
                name="Earnings"
                stroke="#0A84FF"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#premiumEarningsGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer Details */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            This Week: <strong className="text-slate-900 dark:text-white font-bold">₹84,000</strong>
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-medium shrink-0">
            +18% vs last sprint
          </span>
        </div>
        <div className="text-slate-500 dark:text-slate-400 min-w-0">
          Total Settled: <strong className="text-slate-900 dark:text-white font-bold">{formatCurrency(totalEarnings)}</strong>
        </div>
      </div>
    </Card>
  );
}
