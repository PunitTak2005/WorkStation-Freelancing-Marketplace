import React from 'react';
import { Link2, Github, Linkedin, Globe, CheckCircle2 } from 'lucide-react';
import Button from '@/components/common/Button';

export default function ConnectedAccounts({ data = {}, onToggle }) {
  const accounts = [
    {
      id: 'google',
      name: 'Google Workspace',
      desc: 'Seamless single sign-on with Google Calendar integration.',
      icon: Globe,
      connected: data.google?.connected ?? false,
      identifier: data.google?.email || 'Not linked'
    },
    {
      id: 'github',
      name: 'GitHub Enterprise',
      desc: 'Sync public repositories and commit activity to profile badges.',
      icon: Github,
      connected: data.github?.connected ?? true,
      identifier: data.github?.username || 'rajesh-dev'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn Professional',
      desc: 'Verify professional career history, recommendations, and credentials.',
      icon: Linkedin,
      connected: data.linkedin?.connected ?? true,
      identifier: data.linkedin?.username || 'in/rajesh-kumar'
    },
    {
      id: 'microsoft',
      name: 'Microsoft 365',
      desc: 'Sync corporate client communications and Microsoft Teams meetings.',
      icon: Globe,
      connected: data.microsoft?.connected ?? false,
      identifier: data.microsoft?.email || 'Not linked'
    }
  ];

  return (
    <div className="rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 space-y-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
            <Link2 size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
              Connected Accounts
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Link external single sign-on providers, social portfolios, and credential networks.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accounts.map((acc) => {
          const Icon = acc.icon;
          return (
            <div
              key={acc.id}
              className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-800/30 flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 shadow-xs">
                  <Icon size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {acc.name}
                    </h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${acc.connected ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
                      {acc.connected ? 'Connected' : 'Not Connected'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {acc.desc}
                  </p>
                  {acc.connected && (
                    <p className="text-[11px] font-semibold text-[#0A84FF] mt-1 truncate">
                      {acc.identifier}
                    </p>
                  )}
                </div>
              </div>

              <Button
                size="sm"
                variant={acc.connected ? "outline" : "primary"}
                onClick={() => onToggle(acc.id)}
                className="w-full justify-center text-xs font-semibold"
              >
                {acc.connected ? 'Disconnect Account' : 'Connect with Provider'}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
