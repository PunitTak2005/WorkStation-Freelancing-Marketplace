import React from 'react';
import Card from '@/components/common/Card';

function MiniSparkline({ color = '#0A84FF', data = [10, 14, 12, 18, 16, 22, 25, 28] }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 100;
  const height = 28;

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 8) - 4;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="w-full h-7 overflow-hidden flex items-center">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    </div>
  );
}

export default function StatsCard({
  title,
  value,
  formattedValue,
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
  color = 'blue',
  sparklineData = [12, 15, 14, 20, 18, 24, 26, 30]
}) {
  const colorMap = {
    emerald: {
      border: 'border-slate-200/60 dark:border-slate-800',
      iconContainer: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
      trendBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40',
      sparkColor: '#10B981'
    },
    blue: {
      border: 'border-slate-200/60 dark:border-slate-800',
      iconContainer: 'bg-blue-50 dark:bg-blue-950/40 text-[#0A84FF] dark:text-[#2FA8FF]',
      trendBg: 'bg-blue-50 dark:bg-blue-950/40 text-[#0A84FF] dark:text-[#2FA8FF] border border-blue-200 dark:border-blue-800/40',
      sparkColor: '#0A84FF'
    },
    purple: {
      border: 'border-slate-200/60 dark:border-slate-800',
      iconContainer: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400',
      trendBg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800/40',
      sparkColor: '#8B5CF6'
    },
    amber: {
      border: 'border-slate-200/60 dark:border-slate-800',
      iconContainer: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
      trendBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40',
      sparkColor: '#F59E0B'
    }
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <Card className="rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg transition-all duration-200 p-6 h-full flex flex-col justify-between overflow-hidden">
      {/* 1. Header: Icon + Trend Badge */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className={`h-11 w-11 rounded-xl ${scheme.iconContainer} flex items-center justify-center flex-shrink-0 shadow-sm`}>
          {Icon && <Icon className="h-5 w-5" />}
        </div>
        {trend && (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${scheme.trendBg}`}>
            {trend}
          </span>
        )}
      </div>

      {/* 2. Primary Metric */}
      <div className="min-w-0 mb-3">
        <h3 className="text-2xl sm:text-3xl xl:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display truncate">
          {formattedValue || value}
        </h3>
        {/* 3. Supporting Information */}
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate mt-1">
          {title}
        </p>
        {subtitle && (
          <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      {/* 4. Visualization: Mini Sparkline */}
      <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800/60 w-full overflow-hidden">
        <MiniSparkline color={scheme.sparkColor} data={sparklineData} />
      </div>
    </Card>
  );
}
