import React from 'react';
import { Sliders, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import Input from '@/components/common/Input';

export default function GeneralSettings({ data, onChange, errors = {}, touched = {}, onBlur }) {
  const languages = ['English (US)', 'English (UK)', 'Hindi (हिंदी)', 'Spanish (Español)', 'French (Français)', 'German (Deutsch)'];
  const timeZones = [
    'UTC+05:30 (India Standard Time - IST)',
    'UTC+00:00 (Greenwich Mean Time - GMT)',
    'UTC-05:00 (Eastern Standard Time - EST)',
    'UTC-08:00 (Pacific Standard Time - PST)',
    'UTC+01:00 (Central European Time - CET)',
    'UTC+08:00 (Singapore / Western Australia)',
    'UTC+09:00 (Japan Standard Time - JST)'
  ];
  const dateFormats = ['DD/MM/YYYY (e.g. 12/09/2026)', 'MM/DD/YYYY (e.g. 09/12/2026)', 'YYYY-MM-DD (e.g. 2026-09-12)'];

  return (
    <div className="rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 space-y-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#0A84FF] flex items-center justify-center shrink-0">
            <Sliders size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
              General Preferences
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Customize regional formats, identity handles, and workspace presentation.
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          <Sparkles size={13} className="text-[#0A84FF]" />
          Global Defaults
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Full Name */}
        <div>
          <Input
            label="Full Legal Name"
            value={data.name || ''}
            onChange={(e) => onChange('name', e.target.value)}
            onBlur={() => onBlur && onBlur('name')}
            placeholder="Rajesh Kumar"
            error={touched.name ? errors.name : undefined}
            success={touched.name && !errors.name && Boolean(data.name)}
            rightIcon={
              touched.name && (
                errors.name ? <AlertCircle className="w-4 h-4 text-rose-500" /> : <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              )
            }
            helperText="Appears on official invoices, contracts, and proposals."
            required
          />
        </div>

        {/* Username */}
        <div>
          <Input
            label="Unique Username"
            value={data.username || ''}
            onChange={(e) => onChange('username', e.target.value.toLowerCase().replace(/[^a-zA-Z0-9_-]/g, ''))}
            onBlur={() => onBlur && onBlur('username')}
            placeholder="rajesh_dev"
            error={touched.username ? errors.username : undefined}
            success={touched.username && !errors.username && Boolean(data.username)}
            rightIcon={
              touched.username && (
                errors.username ? <AlertCircle className="w-4 h-4 text-rose-500" /> : <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              )
            }
            helperText="Custom profile link: workstation.com/u/your_name"
            required
          />
        </div>

        {/* Display Name */}
        <div>
          <Input
            label="Public Display Name"
            value={data.displayName || ''}
            onChange={(e) => onChange('displayName', e.target.value)}
            placeholder="Rajesh K. (Senior Architect)"
            helperText="Visible to clients and collaborators in chat channels."
          />
        </div>

        {/* Language */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Preferred Language
          </label>
          <select
            value={data.language || 'English (US)'}
            onChange={(e) => onChange('language', e.target.value)}
            className="block w-full min-h-[46px] rounded-xl px-3.5 py-2.5 text-sm outline-none shadow-xs bg-white text-slate-900 ring-1 ring-inset ring-slate-300 dark:bg-[#101826] dark:text-[#F5F9FF] dark:ring-[#22324A] focus:ring-2 focus:ring-[#0A84FF]"
          >
            {languages.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        {/* Time Zone */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Operating Time Zone
          </label>
          <select
            value={data.timeZone || 'UTC+05:30 (India Standard Time - IST)'}
            onChange={(e) => onChange('timeZone', e.target.value)}
            className="block w-full min-h-[46px] rounded-xl px-3.5 py-2.5 text-sm outline-none shadow-xs bg-white text-slate-900 ring-1 ring-inset ring-slate-300 dark:bg-[#101826] dark:text-[#F5F9FF] dark:ring-[#22324A] focus:ring-2 focus:ring-[#0A84FF]"
          >
            {timeZones.map((tz) => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
        </div>

        {/* Date Format */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Date Format
          </label>
          <select
            value={data.dateFormat || 'DD/MM/YYYY'}
            onChange={(e) => onChange('dateFormat', e.target.value)}
            className="block w-full min-h-[46px] rounded-xl px-3.5 py-2.5 text-sm outline-none shadow-xs bg-white text-slate-900 ring-1 ring-inset ring-slate-300 dark:bg-[#101826] dark:text-[#F5F9FF] dark:ring-[#22324A] focus:ring-2 focus:ring-[#0A84FF]"
          >
            {dateFormats.map((df) => (
              <option key={df} value={df.split(' ')[0]}>{df}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
