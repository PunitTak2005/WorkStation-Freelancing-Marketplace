import React from 'react';
import { 
  Sliders, UserCheck, Shield, Bell, Palette, 
  Eye, CreditCard, Link2, Download, AlertOctagon,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/utils/cn';

export const navItems = [
  { id: 'general', label: 'General', icon: Sliders, description: 'Preferences, time zone, language' },
  { id: 'account', label: 'Account', icon: UserCheck, description: 'Profile, contact, job title' },
  { id: 'security', label: 'Security', icon: Shield, description: 'Password, 2FA, active devices' },
  { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Email, push, SMS triggers' },
  { id: 'appearance', label: 'Appearance', icon: Palette, description: 'Theme, density, typography' },
  { id: 'privacy', label: 'Privacy', icon: Eye, description: 'Visibility, presence, indexing' },
  { id: 'billing', label: 'Billing', icon: CreditCard, description: 'Plan, cards, invoices' },
  { id: 'connected', label: 'Connected Accounts', icon: Link2, description: 'Google, GitHub, LinkedIn' },
  { id: 'export', label: 'Data & Export', icon: Download, description: 'Archive profile & history' },
  { id: 'danger', label: 'Danger Zone', icon: AlertOctagon, description: 'Delete account & sessions', isDanger: true },
];

export default function SettingsSidebar({ activeTab, onSelectTab, pendingCounts = {} }) {
  return (
    <aside className="w-full lg:w-64 shrink-0">
      {/* Desktop / Tablet Vertical Navigation */}
      <div className="hidden lg:flex flex-col space-y-1.5 p-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/70 dark:border-slate-800 shadow-xs">
        <div className="px-3.5 py-3 border-b border-slate-100 dark:border-slate-800/80 mb-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Account Navigation
          </p>
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isDanger = item.isDanger;
          const hasPending = pendingCounts[item.id];

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={cn(
                'w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all group outline-none',
                isActive
                  ? isDanger
                    ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 font-semibold shadow-xs'
                    : 'bg-blue-50 text-[#0A84FF] dark:bg-blue-950/50 dark:text-[#2FA8FF] font-semibold shadow-xs'
                  : isDanger
                  ? 'text-rose-500 hover:bg-rose-50/70 dark:text-rose-400 dark:hover:bg-rose-950/30'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={cn(
                    'w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-colors',
                    isActive
                      ? isDanger
                        ? 'bg-rose-500 text-white'
                        : 'bg-[#0A84FF] text-white shadow-xs'
                      : isDanger
                      ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400'
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 group-hover:text-[#0A84FF]'
                  )}
                >
                  <Icon size={15} />
                </div>
                <span className="truncate">{item.label}</span>
              </div>

              {hasPending ? (
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 animate-pulse" />
              ) : (
                <ChevronRight
                  size={14}
                  className={cn(
                    'transition-transform shrink-0',
                    isActive ? 'opacity-100 translate-x-0.5' : 'opacity-0 group-hover:opacity-40'
                  )}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile Horizontal Pill Segmented Scroller */}
      <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 border shadow-xs',
                isActive
                  ? item.isDanger
                    ? 'bg-rose-500 border-rose-500 text-white'
                    : 'bg-[#0A84FF] border-[#0A84FF] text-white'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300'
              )}
            >
              <Icon size={14} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
