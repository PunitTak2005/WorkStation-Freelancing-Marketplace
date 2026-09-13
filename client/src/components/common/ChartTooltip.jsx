import React from 'react';
import { formatCurrency } from '@/utils/formatters';
import { cn } from '@/utils/cn';

/**
 * Custom Theme-Aware Recharts Tooltip
 * Renders high-contrast, polished tooltip in both Light & Dark modes:
 * - Light Mode: bg-white text-gray-900 border-gray-200 shadow-xl rounded-xl
 * - Dark Mode: bg-gray-900 text-white border-gray-700 shadow-2xl rounded-xl
 */
export default function ChartTooltip({
  active,
  payload,
  label,
  formatter,
  valuePrefix = '',
  valueSuffix = '',
  title,
  showTotal = false,
}) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      className={cn(
        'p-3 rounded-xl transition-all duration-150 text-xs min-w-[140px] z-50 pointer-events-none select-none',
        // Light Mode
        'bg-white text-gray-900 border border-gray-200 shadow-xl',
        // Dark Mode
        'dark:bg-gray-900 dark:text-white dark:border-gray-700'
      )}
    >
      {/* Header / Label */}
      {(title || label) && (
        <div className="font-bold text-xs pb-1.5 mb-1.5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3">
          <span className="text-gray-900 dark:text-white">{title || label}</span>
        </div>
      )}

      {/* Items list */}
      <div className="space-y-1.5">
        {payload.map((item, idx) => {
          const itemColor = item.color || item.fill || item.stroke || '#0A84FF';
          let displayVal = item.value;

          if (formatter) {
            const formatted = formatter(item.value, item.name, item);
            if (Array.isArray(formatted)) {
              displayVal = formatted[0];
            } else {
              displayVal = formatted;
            }
          } else if (typeof item.value === 'number') {
            displayVal = `${valuePrefix}${item.value.toLocaleString()}${valueSuffix}`;
          }

          const displayName = item.name || item.dataKey || 'Value';

          return (
            <div key={`tooltip-item-${idx}`} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: itemColor }}
                />
                <span className="text-gray-600 dark:text-gray-300 truncate">
                  {displayName}
                </span>
              </div>
              <span className="font-mono font-bold text-gray-900 dark:text-white flex-shrink-0">
                {displayVal}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
