import React from 'react';
import { Palette, Sun, Moon, Laptop, Layout, Type } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setDarkMode } from '@/store/slices/uiSlice';

export default function AppearanceSettings({ data, onChange }) {
  const dispatch = useDispatch();
  const themes = [
    { id: 'light', label: 'Light Theme', icon: Sun, desc: 'Clean, radiant high-contrast UI' },
    { id: 'dark', label: 'Dark Mode', icon: Moon, desc: 'Deep slate tones for reduced eye strain' },
    { id: 'system', label: 'System Default', icon: Laptop, desc: 'Matches your OS appearance preferences' }
  ];

  const accents = [
    { name: 'WorkStation Blue', color: '#0A84FF' },
    { name: 'Emerald Green', color: '#10B981' },
    { name: 'Royal Violet', color: '#8B5CF6' },
    { name: 'Sunset Amber', color: '#F59E0B' },
    { name: 'Rose Red', color: '#F43F5E' }
  ];

  const handleThemeChange = (themeId) => {
    onChange('theme', themeId);
    if (themeId === 'dark') {
      dispatch(setDarkMode(true));
    } else if (themeId === 'light') {
      dispatch(setDarkMode(false));
    } else {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      dispatch(setDarkMode(isDark));
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 space-y-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Palette size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
              Appearance & Layout
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Personalize theme accents, visual density, and dashboard typography.
            </p>
          </div>
        </div>
      </div>

      {/* Theme Selection */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Color Theme
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {themes.map((t) => {
            const Icon = t.icon;
            const isSelected = (data.theme || 'light') === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => handleThemeChange(t.id)}
                className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all ${isSelected ? 'border-[#0A84FF] bg-blue-50/50 dark:bg-blue-950/40 ring-2 ring-[#0A84FF]/20 shadow-xs' : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:border-slate-300'}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-3 ${isSelected ? 'bg-[#0A84FF] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                  <Icon size={16} />
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">{t.label}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{t.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Accent Color */}
      <div className="space-y-3 pt-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Accent Brand Color
        </label>
        <div className="flex items-center gap-3 flex-wrap">
          {accents.map((acc) => {
            const isSelected = (data.accentColor || '#0A84FF') === acc.color;
            return (
              <button
                key={acc.color}
                type="button"
                onClick={() => onChange('accentColor', acc.color)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${isSelected ? 'border-slate-800 dark:border-white shadow-xs ring-2 ring-slate-400/20' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'}`}
              >
                <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: acc.color }} />
                <span className="text-slate-700 dark:text-slate-300">{acc.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Density & Font Size Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            <Layout size={14} />
            Dashboard Density
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'comfortable', label: 'Comfortable', desc: 'Spacious padding' },
              { id: 'compact', label: 'Compact', desc: 'Higher data density' }
            ].map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => onChange('density', d.id)}
                className={`p-3 rounded-2xl border text-left transition-all ${(data.density || 'comfortable') === d.id ? 'border-[#0A84FF] bg-blue-50/50 dark:bg-blue-950/40 font-semibold' : 'border-slate-200 dark:border-slate-800'}`}
              >
                <p className="text-xs text-slate-900 dark:text-white">{d.label}</p>
                <p className="text-[10px] text-slate-500">{d.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            <Type size={14} />
            Typography Scale
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['small', 'medium', 'large'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onChange('fontSize', s)}
                className={`p-3 rounded-2xl border text-center capitalize text-xs transition-all ${(data.fontSize || 'medium') === s ? 'border-[#0A84FF] bg-blue-50/50 dark:bg-blue-950/40 font-bold text-[#0A84FF]' : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
