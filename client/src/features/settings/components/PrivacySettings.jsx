import React from 'react';
import { Eye, ShieldCheck, Search, Users } from 'lucide-react';

function PrivacyToggle({ title, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/70 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
          {title}
        </p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0A84FF] ${checked ? 'bg-[#0A84FF]' : 'bg-slate-200 dark:bg-slate-700'}`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </button>
    </div>
  );
}

export default function PrivacySettings({ data, onChange }) {
  return (
    <div className="rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 space-y-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
            <Eye size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
              Privacy Controls
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Manage marketplace visibility, online availability indicators, and search engine discovery.
            </p>
          </div>
        </div>
      </div>

      {/* Visibility Dropdown */}
      <div>
        <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
          Profile Visibility Scope
        </label>
        <select
          value={data.profileVisibility || 'public'}
          onChange={(e) => onChange('profileVisibility', e.target.value)}
          className="block w-full min-h-[46px] rounded-xl px-3.5 py-2.5 text-sm outline-none shadow-xs bg-white text-slate-900 ring-1 ring-inset ring-slate-300 dark:bg-[#101826] dark:text-[#F5F9FF] dark:ring-[#22324A] focus:ring-2 focus:ring-[#0A84FF]"
        >
          <option value="public">Public (Visible to everyone on WorkStation and the web)</option>
          <option value="clients_only">Clients Only (Visible only to signed-in employers and buyers)</option>
          <option value="private">Private (Hidden from marketplace listings and search)</option>
        </select>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
          Setting to Private pauses incoming invitation inquiries.
        </p>
      </div>

      {/* Granular Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <PrivacyToggle
          title="Show Online Status"
          description="Display green indicator when you are actively messaging."
          checked={data.showOnlineStatus ?? true}
          onChange={(val) => onChange('showOnlineStatus', val)}
        />
        <PrivacyToggle
          title="Show Last Seen Timestamp"
          description="Displays when you last browsed or completed milestones."
          checked={data.showLastSeen ?? true}
          onChange={(val) => onChange('showLastSeen', val)}
        />
        <PrivacyToggle
          title="Allow Direct Inbound Messages"
          description="Permits clients to initiate new direct conversations."
          checked={data.allowDirectMessages ?? true}
          onChange={(val) => onChange('allowDirectMessages', val)}
        />
        <PrivacyToggle
          title="Search Engine Indexing"
          description="Allow Google to index your public portfolio headshot & skills."
          checked={data.searchEngineIndexing ?? true}
          onChange={(val) => onChange('searchEngineIndexing', val)}
        />
        <div className="md:col-span-2">
          <PrivacyToggle
            title="Freelancer Smart Recommendations"
            description="Feature your profile in client matching carousels and top talent roundups."
            checked={data.freelancerRecommendations ?? true}
            onChange={(val) => onChange('freelancerRecommendations', val)}
          />
        </div>
      </div>
    </div>
  );
}
