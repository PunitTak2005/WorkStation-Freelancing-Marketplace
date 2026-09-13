import React from 'react';
import { Bell, Mail, Smartphone, MessageSquare } from 'lucide-react';

function ToggleRow({ title, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/70 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
          {title}
        </p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
          {description}
        </p>
      </div>

      {/* Modern Switch */}
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

export default function NotificationSettings({ data, onChange }) {
  const email = data.email || {};
  const push = data.push || {};
  const sms = data.sms || {};

  const handleToggle = (category, field, value) => {
    onChange(category, { ...data[category], [field]: value });
  };

  return (
    <div className="rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 space-y-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#0A84FF] flex items-center justify-center shrink-0">
            <Bell size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
              Notification Preferences
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Configure real-time alerts across Email digests, browser push notifications, and SMS triggers.
            </p>
          </div>
        </div>
      </div>

      {/* Category 1: Email Notifications */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Mail size={16} className="text-[#0A84FF]" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Email Notifications
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          <ToggleRow
            title="New Chat Messages"
            description="Direct messages and team discussions."
            checked={email.messages ?? true}
            onChange={(val) => handleToggle('email', 'messages', val)}
          />
          <ToggleRow
            title="Proposal Responses"
            description="Client interview invitations and bids."
            checked={email.proposals ?? true}
            onChange={(val) => handleToggle('email', 'proposals', val)}
          />
          <ToggleRow
            title="Payment & Escrow Releases"
            description="Milestone deposits and completed transfers."
            checked={email.payments ?? true}
            onChange={(val) => handleToggle('email', 'payments', val)}
          />
          <ToggleRow
            title="Project Milestone Updates"
            description="Deliverable submissions and status shifts."
            checked={email.projectUpdates ?? true}
            onChange={(val) => handleToggle('email', 'projectUpdates', val)}
          />
        </div>
      </div>

      {/* Category 2: Push Notifications */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className="text-[#0A84FF]" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Browser & Device Push
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          <ToggleRow
            title="Live Chat Alerts"
            description="Instant toast popups when active."
            checked={push.chat ?? true}
            onChange={(val) => handleToggle('push', 'chat', val)}
          />
          <ToggleRow
            title="Approaching Deadlines"
            description="Reminders 24 hours before milestone delivery."
            checked={push.deadlines ?? true}
            onChange={(val) => handleToggle('push', 'deadlines', val)}
          />
          <ToggleRow
            title="Direct Job Invitations"
            description="Exclusive project invites from verified clients."
            checked={push.offers ?? false}
            onChange={(val) => handleToggle('push', 'offers', val)}
          />
        </div>
      </div>

      {/* Category 3: SMS Alerts */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2">
          <Smartphone size={16} className="text-[#0A84FF]" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            SMS & Security Alerts
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          <ToggleRow
            title="Critical Security Alerts"
            description="Unusual logins, IP changes, or 2FA updates."
            checked={sms.securityAlerts ?? true}
            onChange={(val) => handleToggle('sms', 'securityAlerts', val)}
          />
          <ToggleRow
            title="Payment Confirmations"
            description="SMS receipt for bank withdrawals above ₹5,000."
            checked={sms.paymentConfirmations ?? true}
            onChange={(val) => handleToggle('sms', 'paymentConfirmations', val)}
          />
        </div>
      </div>
    </div>
  );
}
